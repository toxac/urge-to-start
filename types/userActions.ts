// types/actions.ts
import { z } from 'zod';
import { Database } from './supabase';

export type UserActionRow = Database['public']['Tables']['user_actions']['Row'];
export type UserActionInsert = Database['public']['Tables']['user_actions']['Insert'];

export const GeneratedActionSchema = z.object({
  title: z.string().min(3, 'Action title must be at least 3 characters'),
  description: z.string().min(5, 'Action description is required'),
  checkback_delay_days: z.number().int().min(0).default(3),
  action_type: z.enum(['program', 'general', 'system']).default('system'),
});

export const AIAssessmentResultSchema = z.object({
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  summary: z.string(),
  suggested_actions: z.array(GeneratedActionSchema).min(1),
});


export interface AuditGoalOption {
  id: string;
  label: string;
  category: 'audience' | 'outreach' | 'content' | 'revenue';
  suggestedPlatforms: string[];
  defaultTargetValue: number;
  unit: string;
  timeframeDays: number;
}

export interface UserAuditGoal {
  goalId: string;
  platform: string;
  targetValue: number;
  timeframeDays: number;
}

export interface AuditFormPayload {
  selectedGoals: UserAuditGoal[];
  primaryFocusArea: string;
  biggestObstacle: string;
}

export const AUDIT_GOAL_OPTIONS: AuditGoalOption[] = [
  {
    id: "follower_growth",
    label: "Expand audience reach",
    category: "audience",
    suggestedPlatforms: ["X (Twitter)", "LinkedIn", "Instagram", "YouTube"],
    defaultTargetValue: 100,
    unit: "new followers",
    timeframeDays: 30,
  },
  {
    id: "outreach_attempts",
    label: "Build momentum through cold pitches",
    category: "outreach",
    suggestedPlatforms: ["Email", "LinkedIn DM", "X DM"],
    defaultTargetValue: 50,
    unit: "outreach attempts",
    timeframeDays: 30,
  },
  {
    id: "content_consistency",
    label: "Establish authority with regular posts",
    category: "content",
    suggestedPlatforms: ["LinkedIn", "X (Twitter)", "Medium", "YouTube"],
    defaultTargetValue: 12,
    unit: "published pieces",
    timeframeDays: 30,
  },
  {
    id: "customer_conversations",
    label: "Validate demand through discovery calls",
    category: "revenue",
    suggestedPlatforms: ["Calendly", "Zoom", "Phone"],
    defaultTargetValue: 10,
    unit: "completed calls",
    timeframeDays: 30,
  },
];

export type AIAssessmentResult = z.infer<typeof AIAssessmentResultSchema>;