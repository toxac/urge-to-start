// actions/assessments.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/actions/progress';
import { deepseek } from '@/lib/ai/deepseekClient';
import { InterviewRecord } from '@/types/projects';
import { CostCompletenessCheckOutput, CostAnalysisOutput } from '@/types/ai-schema';

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

interface OpportunityAssessmentInput {
  opportunityTitle: string;
  opportunityDescription: string;
  coreProblem?: string;
  targetAudience?: string;
  founderProfile?: FounderProfileContext;
}

interface OpportunityAssessmentOutput {
  founderAlignment: string;
  opportunityStrength: string;
  keyRiskOrBlindSpot: string;
}

interface SynthesizeProblemInput {
  opportunityTitle?: string;
  opportunityDescription?: string;
  interviews: InterviewRecord[];
}

export interface SynthesizeProblemOutput {
  problem_statement: string;
  affected_audience: string;
  when_context: string;
  where_location: string;
  current_workaround: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'occasionally' | 'seasonal';
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
 * Provides an AI mentorship assessment of an opportunity based on the founder's profile context.
 * Does NOT evaluate or assign numerical scores. Logs output to public.ai_logs.
 */
export async function runOpportunityAssessmentAction(
  input: OpportunityAssessmentInput,
  taskId?: string
): Promise<ActionResponse<OpportunityAssessmentOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required.' };
    }

    const p = input.founderProfile;

    const systemPrompt = `You are a candid, supportive venture mentor analyzing an early-stage startup opportunity.

GOAL:
Provide qualitative insights on the opportunity itself and how well it matches the founder's background. DO NOT assign, mention, or evaluate numerical scores.

TONE & STYLE:
- Direct, clear, grounded, and actionable. Zero fluff, no corporate jargon.

Return ONLY valid JSON matching this schema:
{
  "founderAlignment": "string (2 concise sentences on how well this opportunity leverages the founder's reported background, skills, and motivations)",
  "opportunityStrength": "string (1 strong signal or market advantage about this specific problem/solution concept)",
  "keyRiskOrBlindSpot": "string (1 challenge, market risk, or execution bottleneck given reported roadblocks or location)"
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
      },
    }, null, 2);

    let parsedResult: OpportunityAssessmentOutput;

    try {
      const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze opportunity against founder context:\n${userPrompt}` }
        ]
      });

      const raw = JSON.parse(response.choices[0].message.content || '{}');
      parsedResult = {
        founderAlignment: raw.founderAlignment || "This opportunity leverages your skill set well and offers a practical problem space.",
        opportunityStrength: raw.opportunityStrength || "The problem addresses an immediate operational bottleneck with clear customer pain.",
        keyRiskOrBlindSpot: raw.keyRiskOrBlindSpot || "Validate whether target users actively pay for workarounds or rely on free alternatives."
      };
    } catch (err) {
      console.error('AI Assessment fallback triggered:', err);
      parsedResult = {
        founderAlignment: "This problem aligns with your domain background and reported skills.",
        opportunityStrength: "Targeting a specific audience with explicit friction makes initial validation straightforward.",
        keyRiskOrBlindSpot: "Ensure customer urgency translates to willingness to pay before building."
      };
    }

    // Audit Logging
    await supabase.from('ai_logs').insert({
      user_id: user.id,
      task_id: taskId || null,
      context_type: 'opportunity_context_assessment',
      user_input: userPrompt,
      generated_output: parsedResult as any,
    });

    return { success: true, data: parsedResult };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to generate opportunity assessment' };
  }
}


/**
 * Uses AI to synthesize customer interview logs and opportunity context into a grounded problem statement.
 */
export async function synthesizeProblemFromInterviewsAction(
  input: SynthesizeProblemInput
): Promise<ActionResponse<SynthesizeProblemOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required.' };
    }

    const systemPrompt = `You are a candid, supportive venture mentor helping an early-stage founder synthesize customer research into a concrete problem statement.

RULES:
1. Base your synthesis PRIMARILY on the provided customer interviews.
2. Be specific, concrete, grounded, and actionable. Zero fluff or generic corporate jargon.
3. Return ONLY valid JSON matching this schema:
{
  "problem_statement": "string (1 concrete sentence articulating the core pain revealed in interviews)",
  "affected_audience": "string (Specific target audience who confirmed this friction)",
  "when_context": "string (Specific trigger or context when the problem happens)",
  "where_location": "string (Physical or digital context where it happens)",
  "current_workaround": "string (The hacky workaround or solution customers currently use)",
  "frequency": "string (One of: daily, weekly, monthly, occasionally, seasonal)"
}`;

    const userPrompt = JSON.stringify({
      opportunityTitle: input.opportunityTitle || 'N/A',
      interviews: input.interviews.map(i => ({
        interviewee: i.interviewee_name,
        role: i.role_or_context,
        confirmed: i.problem_confirmed,
        workaround: i.current_workaround,
        spend_or_time: i.existing_spend_or_time,
        buying_signal: i.buying_signal,
        quote: i.key_quote_or_surprise
      }))
    }, null, 2);

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Synthesize research into problem definition:\n${userPrompt}` }
      ]
    });

    const raw = JSON.parse(response.choices[0].message.content || '{}');
    const data: SynthesizeProblemOutput = {
      problem_statement: raw.problem_statement || '',
      affected_audience: raw.affected_audience || '',
      when_context: raw.when_context || '',
      where_location: raw.where_location || '',
      current_workaround: raw.current_workaround || '',
      frequency: raw.frequency || 'daily'
    };

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to synthesize problem statement' };
  }
}


export async function analyzeMarketLandscapeAction(
  projectData: Record<string, any>
): Promise<ActionResponse<{
  macro_trend: string;
  competitors_and_diy: string;
  what_is_working: string;
  what_is_failing_or_hard: string;
}>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const systemPrompt = `You are a supportive startup mentor helping a high school student or first-time founder analyze the market around their idea.

RULES:
1. Speak in plain, simple, everyday English. Avoid business school jargon (e.g. no "incumbents", "macro-economic shifts", "market capture").
2. Write realistic, practical answers based on the project's details, customer interviews, and problem statement.
3. Return ONLY valid JSON with this exact structure:
{
  "macro_trend": "string (Why is this idea important or popular right now? What changed in tech or habits?)",
  "competitors_and_diy": "string (Who else solves this or what hacky DIY fixes do people use instead?)",
  "what_is_working": "string (What are current solutions or apps doing really well?)",
  "what_is_failing_or_hard": "string (Where are current options falling short, or why do people hate them?)"
}`;

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this venture's market landscape in simple terms:\n${JSON.stringify(projectData, null, 2)}` }
      ]
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to analyze market landscape' };
  }
}


/**
 * 1. Checks Quest 1 and Quest 2 data for obvious missing cost items
 */
export async function runCostCompletenessCheckAction(
  projectData: Record<string, any>
): Promise<ActionResponse<CostCompletenessCheckOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const systemPrompt = `You are a supportive startup financial mentor checking if an early-stage founder forgot any essential costs.

Review the product promise, requirements, customer journey, unit costs, overhead, and marketing budget.

RULES:
1. Speak in plain, simple English. Avoid accounting jargon (NO "OpEx", "CapEx", "COGS", "Amortization").
2. Look for obvious missing items:
   - Physical shipping product without packaging boxes or courier fees?
   - Digital service without hosting or domain fees?
   - Food/bakery item without permits or wastage buffer?
   - Marketing channel listed without ad/material budget?
3. Return ONLY valid JSON:
{
  "hasGaps": boolean,
  "overallHealth": "string (1 encouraging sentence on their cost mapping thoroughness)",
  "missingItems": [
    {
      "taskToFix": "unit_cost" | "overhead" | "acquisition",
      "taskTitle": "string (e.g. Cost to Make & Deliver One Unit)",
      "missingItemName": "string (e.g. Outer Packaging Boxes)",
      "reason": "string (1 short sentence explaining why they probably need this)"
    }
  ]
}`;

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Check project for missing costs:\n${JSON.stringify(projectData, null, 2)}` }
      ]
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    const data: CostCompletenessCheckOutput = {
      hasGaps: parsed.hasGaps ?? false,
      overallHealth: parsed.overallHealth || "You have mapped out your core costs clearly.",
      missingItems: parsed.missingItems || []
    };

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to check cost completeness' };
  }
}

/**
 * 2. Analyzes cost ratios, benchmarks, and generates risk checklist & upside insights
 */
export async function runCostAnalysisAction(
  projectData: Record<string, any>
): Promise<ActionResponse<CostAnalysisOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const systemPrompt = `You are an early-stage startup mentor providing a clear financial reality check.

RULES:
1. Use warm, simple, conversational English. Zero corporate or VC jargon.
2. Provide a benchmark comparison for an early-stage business of this type.
3. Generate 3-4 realistic cost-related risks the founder should be aware of.
4. Highlight 1 key opportunity for economies of scale (how costs decrease as sales grow).
5. Return ONLY valid JSON:
{
  "summary": "string (2 straightforward sentences summarizing their cost foundation)",
  "unitCostAnalysis": "string (Feedback on their per-unit cost efficiency)",
  "overheadAnalysis": "string (Feedback on their monthly fixed running costs)",
  "acquisitionAnalysis": "string (Feedback on their customer acquisition budget)",
  "potentialRisks": [
    {
      "id": "string",
      "title": "string (Concise risk name)",
      "description": "string (Clear explanation of the risk)",
      "severity": "low" | "medium" | "high"
    }
  ],
  "economiesOfScaleUpside": "string (How buying/producing in bigger quantities will lower their unit cost in future)"
}`;

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze project costs:\n${JSON.stringify(projectData, null, 2)}` }
      ]
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    const data: CostAnalysisOutput = {
      summary: parsed.summary || "Your cost structure gives you a clear baseline of what it takes to produce orders and run monthly.",
      unitCostAnalysis: parsed.unitCostAnalysis || "Your per-unit costs cover direct materials well.",
      overheadAnalysis: parsed.overheadAnalysis || "Your monthly bills are lean and manageable for launch.",
      acquisitionAnalysis: parsed.acquisitionAnalysis || "Your acquisition budget is a good starting point for initial testing.",
      potentialRisks: parsed.potentialRisks || [
        {
          id: 'risk_1',
          title: 'Unplanned Packaging or Delivery Surges',
          description: 'Courier partner rates or fuel surcharges could eat into your per-unit profit.',
          severity: 'medium'
        },
        {
          id: 'risk_2',
          title: 'Higher Ad Costs Per Sale Initially',
          description: 'When starting ads, finding the right targeting takes experimentation before costs stabilize.',
          severity: 'medium'
        }
      ],
      economiesOfScaleUpside: parsed.economiesOfScaleUpside || "As order volume grows, ordering materials in bulk will lower your per-unit packaging and production cost significantly."
    };

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to generate cost analysis' };
  }
}