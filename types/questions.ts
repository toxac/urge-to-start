import { z } from 'zod';
import { Database } from './supabase';

export type UserQuestion = Database['public']['Tables']['user_questions']['Row'];
export type UserQuestionInsert = Database['public']['Tables']['user_questions']['Insert'];
export type UserQuestionUpdate = Database['public']['Tables']['user_questions']['Update'];

export const AskQuestionSchema = z.object({
  itemType: z.enum(['task', 'quest', 'mission', 'event', 'launch']),
  itemId: z.string(),
  question: z.string().min(1).max(500),
});

export type AskQuestionInput = z.infer<typeof AskQuestionSchema>;