import { z } from 'zod';

export const CreateProjectSchema = z.object({
  biz_name: z.string().min(1).max(255).trim(),
  five_word_hook: z.string().max(100).nullable().optional(),
  // ⚡ No opportunity_id here - it's handled by opportunities table
});

export const UpdateProjectSchema = z.object({
  // Core fields
  biz_name: z.string().min(1).max(255).trim().optional(),
  five_word_hook: z.string().max(255).nullable().optional(),
  tagline: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  status: z.enum(['ideation', 'validation', 'planning', 'building', 'launched', 'growing', 'reviewing', 'completed', 'archived']).optional(),
  current_mission: z.enum(['1', '2', '3', '4', '5', '6', '7', '8']).optional(),
  
  // JSON fields - each can be updated individually
  discovery_metrics: z.record(z.string(), z.any()).optional(),
  financial_blueprint: z.record(z.string(), z.any()).optional(),
  infrastructure_nodes: z.record(z.string(), z.any()).optional(),
  validation_data: z.record(z.string(), z.any()).optional(),
  competitive_landscape: z.record(z.string(), z.any()).optional(),
  compliance_checklist: z.record(z.string(), z.any()).optional(),
  solution_design: z.record(z.string(), z.any()).optional(),
  viability_check: z.record(z.string(), z.any()).optional(),
  build_data: z.record(z.string(), z.any()).optional(),
  launch_data: z.record(z.string(), z.any()).optional(),
  operations_data: z.record(z.string(), z.any()).optional(),
  review_data: z.record(z.string(), z.any()).optional(),
});