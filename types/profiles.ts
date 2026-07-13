// types/profiles.ts
import { Database } from './supabase';
import { z } from 'zod';

// =========================================================================
// 1. Extract the raw generated row type directly from Supabase's schema definitions
// =========================================================================
type BaseProfile = Database['public']['Tables']['profiles']['Row'];

// =========================================================================
// 2. Define strict contracts for your flexible JSONB metadata containers
// =========================================================================
export interface MentorMetadata {
  bio?: string;
  about_markdown?: string;
  expertise_tags?: string[];
  company_position?: string;
  calendly_url?: string;
  is_featured?: boolean;
}

export interface ProviderMetadata {
  company_name?: string;
  company_website?: string;
  support_email?: string;
  company_description?: string;
  industry_sector?: string;
}

export interface ConstraintFormInputs {
  weekly_hours: '2_5_hours' | '5_10_hours' | '10_20_hours' | '20_plus';
  time_slot: 'evenings' | 'weekends' | 'scraps';
  money_budget: number;
}

export interface CoreDriver {
  core_focus?: string;
  freedom_metric?: string;
  anti_goal?: string;
}

// Define the allowed roles type from your schema
export type UserRole = 'base' | 'enrolled' | 'member' | 'provider' | 'mentor' | 'superadmin' | 'admin_marketing' | 'admin_accounts';

// =========================================================================
// 3. Profile type that merges BaseProfile with custom types
// =========================================================================
export type Profile = Omit<BaseProfile, 'mentor_metadata' | 'provider_metadata'> & {
  mentor_metadata: MentorMetadata;
  provider_metadata: ProviderMetadata;
  constraints?: ConstraintFormInputs;
  core_driver?: CoreDriver;
};

// =========================================================================
// 4. Type aliases for server action responses
// =========================================================================
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// 5. Export profile-related Zod schemas
// =========================================================================
export const UpdateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).trim().optional(),
  username: z.string().min(3).max(30).trim().regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores"
  }).optional(),
  avatar_url: z.string().url().optional().nullable(),
  city: z.string().max(100).trim().optional().nullable(),
  country: z.string().min(2).max(100).trim().optional(),
  description: z.string().max(1000).trim().optional().nullable(),
  core_driver: z.string().max(255).trim().optional().nullable(),
  social_profiles: z.record(z.string(), z.string().url().or(z.string())).optional(),
  constraints: z.object({
    weekly_hours: z.enum(['2_5_hours', '5_10_hours', '10_20_hours', '20_plus']).optional(),
    time_slot: z.enum(['evenings', 'weekends', 'scraps']).optional(),
    money_budget: z.number().min(0).optional(),
  }).optional(),
});

export const AdvanceOnboardingSchema = z.object({
  step: z.number().int().min(1).max(10),
});

export const AdminSyncRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum([
    'base',
    'enrolled', 
    'member', 
    'provider', 
    'mentor', 
    'superadmin',
    'admin_marketing',
    'admin_accounts'
  ]),
  operation: z.enum(['add', 'remove', 'replace']).optional().default('replace'),
});

export const RoleMetadataSchema = z.object({
  metadata: z.record(z.string(), z.any()),
});