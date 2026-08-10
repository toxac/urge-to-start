// actions/assessments.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/actions/progress';
import { deepseek } from '@/lib/ai/deepseekClient';

interface ChallengeOption {
  id: string;
  title: string;
  description: string;
  checkbackDelayDays: number;
  channelName?: string;
  growthPillar: 'new_presence' | 'grow_following' | 'increase_engagement';
}

interface SocialAssessmentOutput {
  summary: string;
  strengths: string[];
  growthAreas: string[];
  suggestedActions: ChallengeOption[];
}

/**
 * Evaluates social channels and produces presence, follower growth, and engagement actions.
 * Saves raw generated output to public.ai_logs.
 */
export async function runSocialAssessmentAction(
  profileState: Record<string, any>,
  taskId?: string
): Promise<ActionResponse<SocialAssessmentOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required.' };
    }

    const footprint = profileState.social_footprint || [];
    const motivations = profileState.motivations || {};
    const inputPayloadString = JSON.stringify({ footprint, motivations }, null, 2);

    const systemPrompt = `You are a social presence and distribution advisor for early-stage founders.
Review the founder's existing channels and profile details.

GOAL OF SUGGESTIONS:
At this stage, DO NOT suggest problem validation or customer interviews.
Focus ONLY on these 3 distribution growth pillars:
1. NEW PRESENCE: Establishing a profile on an essential network they are not currently on.
2. GROW FOLLOWING: Specific steps to expand their connection or follower count on their primary active platform.
3. INCREASE ENGAGEMENT: Simple habits to boost interaction and visibility on their existing spaces.

TONE & STYLE:
- Conversational, warm, direct, and supportive.
- NO buzzwords or corporate jargon (NO "Go-To-Market", "SaaS", "CAC", "B2B", "Funnel", "VC").

Return ONLY valid JSON matching this schema:
{
  "summary": "string (2 straightforward sentences highlighting their current distribution reach and best growth opportunity)",
  "strengths": ["string (2 plain strengths)"],
  "growthAreas": ["string (2 plain growth opportunities)"],
  "suggestedActions": [
    {
      "id": "string",
      "title": "string (Actionable title like: Connect with 15 peers in your domain)",
      "description": "string (Clear, straightforward step to execute)",
      "checkbackDelayDays": number (e.g. 3),
      "channelName": "string",
      "growthPillar": "new_presence" | "grow_following" | "increase_engagement"
    }
  ]
}`;

    let parsedResult: SocialAssessmentOutput;

    try {
      const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Founder Spaces & Goals:\n${inputPayloadString}` }
        ]
      });

      const raw = JSON.parse(response.choices[0].message.content || '{}');
      parsedResult = {
        summary: raw.summary || "You have a solid set of active channels. Expanding your reach and building steady engagement habits will amplify your future launch.",
        strengths: raw.strengths || ["Mapped active communication spaces"],
        growthAreas: raw.growthAreas || ["Consistent connection building on primary channels"],
        suggestedActions: raw.suggestedActions || []
      };
    } catch (err) {
      console.error('AI Assessment fallback triggered:', err);
      parsedResult = {
        summary: "You have a solid set of active channels. Focusing on growing your connection count and driving engagement will prepare your network for upcoming milestones.",
        strengths: [
          `Active presence in ${footprint.length || 1} network channel(s)`,
          "Clear founder goals aligned with network expansion"
        ],
        growthAreas: [
          "Building direct connections with relevant peers",
          "Creating a consistent weekly engagement routine"
        ],
        suggestedActions: [
          {
            id: 'action_1',
            title: 'Connect with 15 active peers in your space',
            description: 'Send personalized connection requests on your primary platform to people sharing similar interests.',
            checkbackDelayDays: 3,
            channelName: 'LinkedIn / Social',
            growthPillar: 'grow_following'
          },
          {
            id: 'action_2',
            title: 'Set up presence on a missing distribution channel',
            description: 'Create a profile on X or a domain-specific Slack group where your target audience hangs out.',
            checkbackDelayDays: 2,
            channelName: 'New Platform',
            growthPillar: 'new_presence'
          },
          {
            id: 'action_3',
            title: 'Leave 3 insightful comments on key community posts',
            description: 'Engage thoughtfully on posts by domain creators to increase your profile visibility.',
            checkbackDelayDays: 2,
            channelName: 'Community / Slack',
            growthPillar: 'increase_engagement'
          }
        ]
      };
    }

    // ⚡ AUDIT LOGGING: Save generation record to public.ai_logs
    const { error: logErr } = await supabase.from('ai_logs').insert({
      user_id: user.id,
      task_id: taskId || null,
      context_type: 'social_footprint_assessment',
      user_input: inputPayloadString,
      generated_output: parsedResult as any,
    });

    if (logErr) {
      console.error('Failed to log AI assessment response:', logErr.message);
    }

    return { success: true, data: parsedResult };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to analyze network footprint' };
  }
}