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
}

interface SocialAssessmentOutput {
  summary: string;
  strengths: string[];
  growthAreas: string[];
  suggestedActions: ChallengeOption[];
}

/**
 * Evaluates social channels and produces plain, non-jargon founder growth actions.
 */
export async function runSocialAssessmentAction(
  profileState: Record<string, any>
): Promise<ActionResponse<SocialAssessmentOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required.' };
    }

    const footprint = profileState.social_footprint || [];
    const motivations = profileState.motivations || {};

    const systemPrompt = `You are an actionable growth advisor for early-stage founders.
Review the founder's existing social channels and goals.

CRITICAL TONE & QUALITY RULES:
1. Use simple, warm, direct language. Label the main header as "summary" in your JSON.
2. DO NOT use generic, low-value suggestions like "post on social media", "join an alumni forum", or "browse events".
3. Provide 2-3 specific, high-leverage ACTIONS focused on value-first direct outreach to specific people in their network to ask for 10-minute problem feedback.
4. DO NOT use corporate/startup jargon (NO "Go-To-Market", "SaaS", "CAC", "B2B", "Funnel", "VC").

Return ONLY valid JSON matching this schema:
{
  "summary": "string (2 straightforward sentences analyzing their network leverage)",
  "strengths": ["string"],
  "growthAreas": ["string"],
  "suggestedActions": [
    {
      "id": "string",
      "title": "string (Concrete title e.g.: Message 3 former colleagues for problem feedback)",
      "description": "string (Specific non-salesy message angle or action step)",
      "checkbackDelayDays": number,
      "channelName": "string"
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
          {
            role: 'user',
            content: `Profile channels and goals:\n${JSON.stringify({ footprint, motivations }, null, 2)}`
          }
        ]
      });

      const raw = JSON.parse(response.choices[0].message.content || '{}');
      parsedResult = {
        summary: raw.summary || "You have a clear list of channels mapped out. Now focus on starting direct, personal chats.",
        strengths: raw.strengths || ["You already have active spaces where people know you."],
        growthAreas: raw.growthAreas || ["Reaching out directly to individuals for 1-on-1 chats."],
        suggestedActions: raw.suggestedActions || []
      };
    } catch (err) {
      console.error('AI Assessment fallback triggered:', err);
      parsedResult = {
        summary: "You have a solid starting point mapped out. The highest leverage next step is having warm, direct conversations with real people.",
        strengths: [
          `Mapped ${footprint.length || 1} active communication channel(s)`,
          "Clear personal reasons for launching this journey"
        ],
        growthAreas: [
          "Reaching out directly to people in your existing network",
          "Asking targeted questions to validate real problems"
        ],
        suggestedActions: [
          {
            id: 'action_1',
            title: 'Send a quick message to 3 former teammates',
            description: 'Ask how they are doing and share a short line about the problem you are looking to solve.',
            checkbackDelayDays: 2,
            channelName: 'Direct Message'
          },
          {
            id: 'action_2',
            title: 'Ask 1 specific question in your primary community',
            description: 'Post a quick question asking how members currently handle your target problem.',
            checkbackDelayDays: 3,
            channelName: 'Community'
          }
        ]
      };
    }

    return { success: true, data: parsedResult };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to analyze network footprint' };
  }
}