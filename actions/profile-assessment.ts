// actions/profile-assessment.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/profiles';
import { AIAssessmentResult, AIAssessmentResultSchema, UserActionInsert } from '@/types/userActions';
import { completeTaskExecution } from '@/actions/progress';
import { deepseek } from '@/lib/ai/deepseekClient';

export async function runAIAssessmentAction(taskId: string): Promise<ActionResponse<{
  assessment: AIAssessmentResult;
  actionsCreatedCount: number;
}>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // 1. Fetch user profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profileData) {
      return { success: false, error: 'User profile not found' };
    }

    // Safe type assertions for JSON columns on profile
    const profile = profileData as Record<string, any>;
    const commitment = (profile.commitment as Record<string, any>) || {};
    const motivations = (profile.motivations as Record<string, any>) || {};
    const roadblocks = (profile.roadblocks as Record<string, any>) || {};
    const skills = (profile.skills as any[]) || [];
    const socialFootprint = (profile.social_footprint as Record<string, any>) || {};

    // IDEMPOTENCY GUARD: If assessment was already run, return existing saved assessment
    if (profile.assessment) {
      const existingAssessment = profile.assessment as AIAssessmentResult;
      return {
        success: true,
        data: {
          assessment: existingAssessment,
          actionsCreatedCount: existingAssessment.suggested_actions?.length || 0,
        },
      };
    }

    // 2. Aggregate all user reflections from Mission 1
    const { data: progressRows } = await supabase
      .from('user_progress')
      .select('task_id, reflections')
      .eq('user_id', user.id);

    const aggregatedReflections: string[] = [];
    (progressRows || []).forEach((row) => {
      const refs = (row.reflections as any[]) || [];
      refs.forEach((r) => {
        if (r.reflection_text) aggregatedReflections.push(r.reflection_text);
      });
    });

    // 3. Prepare AI Assessment prompt payload
    const contextPayload = {
      motivations,
      commitment,
      roadblocks,
      skills,
      social_footprint: socialFootprint,
      reflections_logged: aggregatedReflections,
    };

    // 4. Generate AI Assessment using DeepSeek
    let assessmentResult: AIAssessmentResult;
    // System prompt update inside actions/profile-assessment.ts
    const systemPrompt = `You are an elite startup mentor auditing a founder's readiness at the end of Mission 1. 
    Analyze their commitments, skills, distribution footprint, roadblocks, and logged reflections.

    Rather than plain tasks, generate 3-4 ambitious, measurable growth targets framed as GOALS (e.g., "Gain 100 new followers", "Complete 10 discovery calls", "Publish 12 authority posts").
    Suggest relevant platforms or channels for each goal based on the founder's footprint.

    Return ONLY valid JSON matching this schema:
    {
    "strengths": ["string"],
    "gaps": ["string"],
    "summary": "string",
    "suggested_actions": [
        {
        "title": "string", // Goal headline (e.g., "Expand Audience Reach")
        "description": "string", // Specific measurable outcome (e.g., "Reach 100 new followers to validate distribution demand.")
        "checkback_delay_days": number, // Target timeframe in days (e.g., 30)
        "action_type": "program" | "general" | "system",
        "metadata": {
            "platform": "string", // e.g., "LinkedIn", "X (Twitter)", "Email"
            "target_metric": "string", // e.g., "100 new followers"
            "category": "audience" | "outreach" | "content" | "revenue"
        }
        }
    ]
    }`;

    try {
      const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Founder Data:\n${JSON.stringify(contextPayload, null, 2)}`
          }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      assessmentResult = AIAssessmentResultSchema.parse(parsed);
    } catch (aiErr) {
      console.error('DeepSeek API error, using structured fallback:', aiErr);

      // Rule-based structured assessment fallback
      const skillsCount = skills.length;
      const reflectionsCount = aggregatedReflections.length;
      const hoursCommitted = commitment.weekly_hours || 10;

      assessmentResult = {
        strengths: [
          `Clear core drivers locked in with ${hoursCommitted} hrs/wk committed`,
          `Identified ${skillsCount} foundational skill asset(s) for early execution`,
          `Logged ${reflectionsCount} reflections across early execution tasks`,
        ],
        gaps: [
          'Initial audience footprint needs focused distribution channel setup',
          'Potential skill gap in early cold outreach & offer validation',
        ],
        summary: `You've established a solid foundation during Mission 1. Your commitment level of ${hoursCommitted} hours/week is realistic for rapid sprints. To prepare for customer interviews, focus on strengthening your direct outreach process.`,
        suggested_actions: [
          {
            title: 'Identify 10 Target Prospect Contacts',
            description: 'List 10 specific people who experience your target problem and save them in your contacts manager.',
            checkback_delay_days: 2,
            action_type: 'program',
          },
          {
            title: 'Draft Personal Problem Validation Message',
            description: 'Write a non-salesy, 2-sentence message asking target prospects for a 15-minute problem discovery chat.',
            checkback_delay_days: 3,
            action_type: 'system',
          },
          {
            title: 'Audit Weekly Calendar Block',
            description: 'Block out your dedicated hours directly in your primary calendar app to protect execution time.',
            checkback_delay_days: 1,
            action_type: 'general',
          }
        ]
      };
    }

    // 5. Save audit result to profiles.assessment
    const { error: profileUpdateErr } = await supabase
      .from('profiles')
      .update({
        assessment: assessmentResult as any,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileUpdateErr) throw profileUpdateErr;

    // 6. Insert generated actions into user_actions table
    const actionsToInsert: UserActionInsert[] = assessmentResult.suggested_actions.map((act) => {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + (act.checkback_delay_days || 0));

      return {
        user_id: user.id,
        task_id: taskId,
        title: act.title,
        description: act.description,
        action_type: act.action_type,
        status: 'pending',
        checkback_delay_days: act.checkback_delay_days,
        due_at: dueAt.toISOString(),
        metadata: { source: 'mission1_ai_audit' },
      };
    });

    const { error: actionsErr } = await supabase
      .from('user_actions')
      .insert(actionsToInsert);

    if (actionsErr) throw actionsErr;

    // 7. Complete task mission1_quest4_task4 & grant XP
    await completeTaskExecution({
      taskId,
      savedPayload: {
        actions_created: actionsToInsert.length,
        evaluated_at: new Date().toISOString(),
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/program');

    return {
      success: true,
      data: {
        assessment: assessmentResult,
        actionsCreatedCount: actionsToInsert.length,
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to complete AI assessment' };
  }
}