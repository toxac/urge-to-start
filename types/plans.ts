
// types/plans.ts
import { z } from 'zod';
import { Database } from './supabase';

export type UserPlan = Database['public']['Tables']['user_plans']['Row'];
export type UserPlanInsert = Database['public']['Tables']['user_plans']['Insert'];
export type UserPlanUpdate = Database['public']['Tables']['user_plans']['Update'];

export const GenerateScheduleSchema = z.object({
  missionId: z.string(),
  questId: z.string(),
  taskId: z.string().optional(),
  numberOfSessions: z.number().default(3),
  durationMinutes: z.number().default(60),
});

export const ScheduleConfigSchema = z.object({
  preferred_days: z.array(z.string()).default(['monday', 'wednesday', 'friday']),
  preferred_hours: z.object({
    start: z.string().default('19:00'),
    end: z.string().default('22:00'),
  }).default({ start: '19:00', end: '22:00' }),
  timezone: z.string().default('UTC'),
});

export type ScheduleConfig = z.infer<typeof ScheduleConfigSchema>;