'use server';

import { executeKipConductor } from '@/lib/ai/conductor';
import { z } from 'zod';

const CritiqueOutputContract = z.object({
  score: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestedRewrite: z.string(),
  realWorldExecutionAdvice: z.array(z.string()),
});

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