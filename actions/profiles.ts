'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase'; // Import the unified Json type explicitly
import { createClient } from '@/lib/supabase/server';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
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
  // FIXED Error 1: Explicitly defining both key and value schemas for z.record
  social_profiles: z.record(z.string(), z.string().url().or(z.string())).optional(),
});

export const AdvanceOnboardingSchema = z.object({
  step: z.number().int().min(1).max(10),
});

export const RoleMetadataSchema = z.object({
  // FIXED Error 2: Providing both key and value schema requirements to z.record
  metadata: z.record(z.string(), z.any()),
});

export const AdminSyncRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['lead', 'member_full', 'member_network', 'mentor', 'provider', 'admin', 'suspended']),
});

// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * PATCH: Safely updates the user's personal profile card fields.
 * Aligns custom dictionary mappings cleanly with Supabase Json interfaces.
 */
export async function updateMyProfile(rawInput: z.infer<typeof UpdateProfileSchema>): Promise<ActionResponse<ProfileRow>> {
  try {
    const validated = UpdateProfileSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required to modify profile coordinates' };

    // FIXED Error 3: Cast social_profiles directly to your schema's recursive Json type interface
    const profileUpdatePayload: ProfileUpdate = {
      ...validated,
      social_profiles: validated.social_profiles as Json, // Direct database assignment compatibility lock
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(profileUpdatePayload)
      .eq('id', user.id)
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath(`/dashboard/profile`);
    return { success: true, data };
  } catch (err: any) {
    if (err.code === '23505') {
      return { success: false, error: 'This username is already claimed by another platform member' };
    }
    return { success: false, error: err.message || 'Failed to update user profile parameters' };
  }
}

/**
 * PATCH: Updates the user's current sequence pointer inside the onboarding loop setup.
 */
export async function advanceOnboardingStep(rawInput: z.infer<typeof AdvanceOnboardingSchema>): Promise<ActionResponse<{ step: number }>> {
  try {
    const { step } = AdvanceOnboardingSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication signature required' };

    const { error } = await supabase
      .from('profiles')
      .update({ 
        onboarding_step: step, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', user.id);

    if (error) throw error;

    return { success: true, data: { step } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to advance onboarding workflow sequence' };
  }
}

/**
 * PATCH: Safely manages specialized unstructured role details inside role-restricted JSONB columns.
 */
export async function updateRoleMetadata(
  type: 'mentor' | 'provider',
  rawInput: z.infer<typeof RoleMetadataSchema>
): Promise<ActionResponse<ProfileRow>> {
  try {
    const { metadata } = RoleMetadataSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication credentials not verified' };

    const { data: profile, error: fetchErr } = await supabase
      .from('profiles')
      .select('role, mentor_metadata, provider_metadata')
      .eq('id', user.id)
      .single();

    if (fetchErr || !profile) return { success: false, error: 'User workspace profile not found' };

    const updatePayload: ProfileUpdate = {
      updated_at: new Date().toISOString()
    };

    if (type === 'mentor') {
      if (profile.role !== 'mentor' && profile.role !== 'admin') {
        return { success: false, error: 'Access Denied: Account does not possess certified Mentor parameters' };
      }
      const currentMeta = (profile.mentor_metadata as Record<string, any>) || {};
      // Ensure the structural payload maps cleanly to the expected custom Json union type interface
      updatePayload.mentor_metadata = { ...currentMeta, ...metadata } as Json;
    } 
    
    else if (type === 'provider') {
      if (profile.role !== 'provider' && profile.role !== 'admin') {
        return { success: false, error: 'Access Denied: Account does not possess verified Partner Provider parameters' };
      }
      const currentMeta = (profile.provider_metadata as Record<string, any>) || {};
      updatePayload.provider_metadata = { ...currentMeta, ...metadata } as Json;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id)
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath(`/dashboard/settings`);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to merge metadata parameters' };
  }
}

/**
 * PATCH: Secure administrative action handler to sync user roles or freeze bad accounts.
 */
export async function syncUserRoleAdmin(rawInput: z.infer<typeof AdminSyncRoleSchema>): Promise<ActionResponse<{ assignedRole: string }>> {
  try {
    const validated = AdminSyncRoleSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').single();

    if (!callerProfile || callerProfile.role !== 'admin') {
      return { success: false, error: 'Access Denied: Administrative authority credentials required' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ 
        role: validated.role, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', validated.userId);

    if (error) throw error;

    revalidatePath(`/admin/users`);
    return { success: true, data: { assignedRole: validated.role } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sync platform authorization credentials' };
  }
}