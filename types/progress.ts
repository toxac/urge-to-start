// types/progress.ts


import { z } from 'zod';
import { Database, Json } from '@/types/supabase';


export type ProgressRow = Database['public']['Tables']['user_progress']['Row'];
export type ProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
export type AccomplishmentInsert = Database['public']['Tables']['user_accomplishments']['Insert'];

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS (NOT EXPORTED - keep internal only)
// =========================================================================

export const CompleteTaskSchema = z.object({
  taskId: z.string().uuid(),
  savedPayload: z.record(z.string(), z.any()).default({}),
});



export const LogReflectionSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  reflectionText: z.string().min(1, 'Reflection text is required'),
  targetCount: z.number().int().min(1).default(1),
});

export type LogReflectionInput = z.infer<typeof LogReflectionSchema>;