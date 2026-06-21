import { Database } from '@/types/supabase';

// 1. Keep this custom type strictly focused on mapping the *internal content* of the jsonb column
export interface TaskProgressPayload {
  userDraft?: string;
  selectedScenario?: string;
  aiFeedback?: {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    suggestedRewrite: string;
    realWorldExecutionAdvice: string[];
  };
}

// 2. Pull the authentic raw Row type straight from your Supabase definitions
export type SupabaseProgressRow = Database['public']['Tables']['user_progress']['Row'];

// 3. Combine them so your store is fully backed by your real database structure
export interface StronglyTypedProgressStore extends Omit<SupabaseProgressRow, 'saved_payload'> {
  saved_payload: TaskProgressPayload; // Overrides the loose 'Json' type with your clean interface!
}