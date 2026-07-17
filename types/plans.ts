// types/plans.ts
import { Database } from './supabase';

export type UserPlan = Database['public']['Tables']['user_plans']['Row'];
export type UserPlanInsert = Database['public']['Tables']['user_plans']['Insert'];
export type UserPlanUpdate = Database['public']['Tables']['user_plans']['Update'];