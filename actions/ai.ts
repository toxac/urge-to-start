'use server';

import { createClient } from '@/lib/supabase/server';
import { executeKipConductor } from '@/lib/ai/conductor';
import { PREREQUISITE_PROMPT_REGISTRY } from '@/lib/ai/prompts';
import { z } from 'zod';

const CritiqueOutputContract = z.object({
  score: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestedRewrite: z.string(),
  realWorldExecutionAdvice: z.array(z.string()),
});

const PrerequisiteOutputSchema = z.object({
  expandedExplanation: z.string()
});

interface ActionParams {
  taskId?: string;
  questId?: string;
  missionId?: string;
  contextType: 'prerequisite_expansion' | 'resource_summary' | 'retrospective_synthesis';
  promptKey?: string;
  userInputText?: string;
}

export async function analyzeUserMessageDraft(scenario: string, userDraft: string, userProfile: any) {
  // Routes to the pro reasoning engine to handle human psychology critique perfectly
  return await executeKipConductor({
    model: 'deepseek-v4-pro',
    reasoningEffort: 'high',
    skills: ["Master Communicator", "Persuasion Strategist", "Human Behavior Expert"],
    userContext: {
      user_name: userProfile?.full_name,
      current_constraints: userProfile?.constraints
    },
    prompt: `
      The user is testing out a message draft for this specific scenario: "${scenario}".
      Here is their draft: "${userDraft}"

      Break down the emotional and behavioral dynamics of this text. Give them a highly strategic rewrite, and a 2-step blueprint on how to handle the follow-up loop.
    `,
    responseSchema: CritiqueOutputContract
  });
}

export async function executeSidebarConductorAction(params: ActionParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized access' };

  // 1. LOOK UP CACHE LAYER: Prevents re-running DeepSeek on same key context
  if (params.promptKey) {
    const { data: cache } = await supabase
      .from('ai_logs')
      .select('generated_output')
      .eq('user_id', user.id)
      .eq('context_type', params.contextType)
      // ⚡ Native arrow operator queries directly into the JSON column object properties
      .eq('generated_output->>promptKey', params.promptKey)
      .maybeSingle();

    if (cache?.generated_output) {
      return { success: true, data: cache.generated_output };
    }
  }

  // 2. CACHE MISS -> Execute logic flow
  if (params.contextType === 'prerequisite_expansion' && params.promptKey) {
    const systemicBlueprint = PREREQUISITE_PROMPT_REGISTRY[params.promptKey];
    if (!systemicBlueprint) return { success: false, error: "Prompt key missing from Registry." };

    const aiResponse = await executeKipConductor({
      model: 'deepseek-chat', // Fast, optimized standard layout model
      skills: ["Strategic Advisory", "Friction Reducer"],
      prompt: `${systemicBlueprint}\nUser Target Objective context: "${params.userInputText}"`,
      responseSchema: PrerequisiteOutputSchema
    });

    if (aiResponse.success && aiResponse.data) {
      // 3. LOG OUTPUT TO CACHE DB TABLE
      await supabase.from('ai_logs').insert({
        user_id: user.id,
        mission_id: params.missionId || null,
        context_type: params.contextType,
        user_input: params.userInputText || null,
        generated_output: { ...aiResponse.data, promptKey: params.promptKey }
      });
    }

    return aiResponse;
  }

  return { success: false, error: "Unsupported operation parameters." };
}