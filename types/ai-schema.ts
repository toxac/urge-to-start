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

export interface ActionParams {
  taskId?: string;
  questId?: string;
  missionId?: string;
  contextType: 'prerequisite_expansion' | 'resource_summary' | 'retrospective_synthesis' | 'observation_analysis' | 'program_question';
  userInputText?: string;
  additionalContext?: Record<string, any>;
}

export interface CostCompletenessCheckOutput {
  hasGaps: boolean;
  overallHealth: string;
  missingItems: Array<{
    taskToFix: 'unit_cost' | 'overhead' | 'acquisition';
    taskTitle: string;
    missingItemName: string;
    reason: string;
  }>;
}

export interface CostAnalysisOutput {
  summary: string;
  unitCostAnalysis: string;
  overheadAnalysis: string;
  acquisitionAnalysis: string;
  potentialRisks: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  economiesOfScaleUpside: string;
}

export type ObservationAnalysis = z.infer<typeof ObservationAnalysisContract>;