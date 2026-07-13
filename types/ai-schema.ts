// lib/schemas/ai-schemas.ts
import { z } from 'zod';

const CritiqueOutputContract = z.object({
  score: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestedRewrite: z.string(),
  realWorldExecutionAdvice: z.array(z.string()),
});

export const ObservationAnalysisContract = z.object({
  pattern_recognition: z.string(),
  deeper_questions: z.array(z.string()),
  potential_opportunities: z.array(z.string()),
  encouragement: z.string(),
  next_steps: z.string(),
});

export type ObservationAnalysis = z.infer<typeof ObservationAnalysisContract>;