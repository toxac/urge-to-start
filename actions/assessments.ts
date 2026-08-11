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

interface FounderProfileContext {
  fullname?: string | null;
  country?: string | null;
  age_group?: string | null;
  bio?: string | null;
  skills?: any;
  motivations?: any;
  roadblocks?: any;
}

interface OpportunityReviewInput {
  opportunityTitle: string;
  opportunityDescription: string;
  coreProblem?: string;
  targetAudience?: string;
  currentScores: {
    passion: number;
    urgency: number;
    workaround_spend: number;
    unfair_advantage: number;
    msp_feasibility: number;
  };
  founderProfile?: FounderProfileContext;
}

interface OpportunityReviewOutput {
  feedback: string;
  suggestion: string;
  blindSpot: string;
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

/**
 * Reviews an opportunity score against the founder's real profile context (demographics, skills, motivations, roadblocks)
 * and provides direct mentorship feedback. Logs output to public.ai_logs.
 */
export async function runOpportunityScoreReviewAction(
  input: OpportunityReviewInput,
  taskId?: string
): Promise<ActionResponse<OpportunityReviewOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required.' };
    }

    const p = input.founderProfile;

    const systemPrompt = `You are a candid, supportive venture mentor analyzing an early-stage startup opportunity score.

GOAL:
Evaluate the founder's self-assessed opportunity scores by cross-referencing the problem details with their profile context (demographics, reported skills, motivations, and potential roadblocks).

TONE & STYLE:
- Conversational, direct, clear, and actionable. Zero fluff, no corporate jargon.

Return ONLY valid JSON matching this schema:
{
  "feedback": "string (2 concise sentences evaluating their scores against their personal profile edge, skills, and background)",
  "blindSpot": "string (1 critical question or blind spot given their motivations or reported roadblocks)",
  "suggestion": "string (1 actionable micro-step to validate their highest-risk score given their location/market)"
}`;

    const userPrompt = JSON.stringify({
      founderContext: {
        fullname: p?.fullname || 'Founder',
        country: p?.country || 'Unknown',
        ageGroup: p?.age_group || 'Unspecified',
        bio: p?.bio || 'None provided',
        skills: p?.skills || [],
        motivations: p?.motivations || {},
        roadblocks: p?.roadblocks || {},
      },
      opportunity: {
        title: input.opportunityTitle,
        description: input.opportunityDescription,
        coreProblem: input.coreProblem || 'N/A',
        targetAudience: input.targetAudience || 'N/A',
        selfAssessedScores: input.currentScores,
      },
    }, null, 2);

    let parsedResult: OpportunityReviewOutput;

    try {
      const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Evaluate this opportunity against founder context:\n${userPrompt}` }
        ]
      });

      const raw = JSON.parse(response.choices[0].message.content || '{}');
      parsedResult = {
        feedback: raw.feedback || "Your self-assessment reflects strong enthusiasm. Ensure your perceived unfair advantage matches your reported technical and domain skills.",
        blindSpot: raw.blindSpot || "Are potential customers in your target market actively paying for workarounds today?",
        suggestion: raw.suggestion || "Talk to 3 target users to confirm how much time or money they currently spend on existing workarounds."
      };
    } catch (err) {
      console.error('AI Review fallback triggered:', err);
      parsedResult = {
        feedback: "Your scores indicate solid alignment with your reported skills. Double check if the urgency score reflects true customer willingness to pay.",
        blindSpot: "Given your current schedule and roadblocks, can you realistically deliver a Minimum Sellable Product quickly?",
        suggestion: "Ask 3 target users what hacky workaround they currently use to solve this."
      };
    }

    // Audit Logging
    await supabase.from('ai_logs').insert({
      user_id: user.id,
      task_id: taskId || null,
      context_type: 'opportunity_score_review',
      user_input: userPrompt,
      generated_output: parsedResult as any,
    });

    return { success: true, data: parsedResult };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to generate AI review' };
  }
}