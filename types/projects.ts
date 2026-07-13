import { z } from 'zod';

export const CreateProjectSchema = z.object({
  biz_name: z.string().min(1).max(255).trim(),
  five_word_hook: z.string().max(100).nullable().optional(),
  // ⚡ No opportunity_id here - it's handled by opportunities table
});

export const UpdateProjectSchema = z.object({
  biz_name: z.string().min(1).max(255).trim().optional(),
  five_word_hook: z.string().max(100).nullable().optional(),
  is_active: z.boolean().optional(),
});