// types/profiles.ts
import { Database } from './supabase';
import { z } from 'zod';



// =========================================================================
// 1. ENUMS & EXTRACTED SUPABASE TYPES
// =========================================================================
export type EducationLevel = Database['public']['Enums']['education_level'];

export type UserRole = Database['public']['Enums']['user_role'] ;

export type UserAgeGroup = Database['public']['Enums']['user_age_group'] ;


// =========================================================================
// 2. TYPED JSON SCHEMAS FOR STRUCTURED PROFILE COLUMNS
// =========================================================================
export type ProfileSkills = {
  category: string;
  title: string;
  level: string;
};

export type ProfileMotivationSchema = {
  push: string;
  push_other: string | null;
  pull: string;
  pull_other: string | null;
  urgency: string;
  urgency_other: string | null;
  why_statement: string;
};

export type ProfileCommitmentSchema = {
  time_to_launch: number; // in months
  weekly_hours: number;
  capital: number | null;
};

export type ProfileRoadblockSchema = {
  roadblocks: string[] | null;
  roadblocks_other: string | null;
};

export type ProfileSocialFootprintSchema = {
  type: "platform" | "clubs" | "professional" | "network" | "other";
  name: string;
  profile_link_url: string;
  total_connections: number | null;
};

export type ProfileAssessmentSchema = {
  assessment_type: string;
  observation: string;
  recommendation: string[];
  score: number;
};

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

// =========================================================================
// 3. MERGED PROFILE TYPES & SERVER ACTION RESPONSE CONTRACTS
// =========================================================================
type BaseProfile = Database['public']['Tables']['profiles']['Row'];

export type ProfileRow = Omit<
  BaseProfile,
  'motivations' | 'commitment' | 'roadblocks' | 'social_footprint' | 'skills' | 'assessment' | 'mentor_profile' | 'provider_metadata'
> & {
  motivations?: ProfileMotivationSchema | null;
  commitment?: ProfileCommitmentSchema | null;
  roadblocks?: ProfileRoadblockSchema | null;
  social_footprint?: ProfileSocialFootprintSchema[] | null;
  skills?: ProfileSkills[] | null;
  assessment?: ProfileAssessmentSchema[] | null;
  mentor_profile?: MentorMetadata | null;
  provider_metadata?: ProviderMetadata | null;
};

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// 4. ZOD VALIDATION SCHEMAS (Centralized for Action Imports)
// =========================================================================
export const UpdateProfileSchema = z.object({
  fullname: z.string().min(1).max(100).trim().optional(),
  username: z.string().min(3).max(30).trim().regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores"
  }).optional(),
  bio: z.string().max(1000).trim().nullable().optional(),
  country: z.string().min(2).max(100).trim().nullable().optional(),
  city: z.string().max(100).trim().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  gender: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  age_group: z.enum(['under_18', '18_24', '25_34', '35_44', '45_54', '55_plus']).nullable().optional(),
  highest_education_level: z.enum(['high_school', 'undergraduate_degree', 'postgraduate_degree', 'self_taught']).nullable().optional(),
  
  // JSONB Schema Fields
  motivations: z.record(z.string(), z.any()).nullable().optional(),
  commitment: z.record(z.string(), z.any()).nullable().optional(),
  roadblocks: z.record(z.string(), z.any()).nullable().optional(),
  social_footprint: z.array(z.record(z.string(), z.any())).nullable().optional(),
  skills: z.array(z.record(z.string(), z.any())).nullable().optional(),
  assessment: z.array(z.record(z.string(), z.any())).nullable().optional(),
  integrations: z.record(z.string(), z.any()).nullable().optional(),
});

export const AdvanceOnboardingSchema = z.object({
  step: z.string().or(z.number()),
});

export const AdminSyncRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum([
    'base',
    'trial',
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