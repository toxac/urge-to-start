// actions/profiles.ts
'use server';

import { revalidatePath } from 'next/cache';
import { Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import {
  ProfileRow,
  ProfileUpdate,
  ActionResponse,
  UserRole,
  UpdateProfileSchema,
  AdvanceOnboardingSchema,
  RoleMetadataSchema,
  AdminSyncRoleSchema,
} from '@/types/profiles';

// Helper to safely cast to UserRole[]
function asUserRoles(roles: string[]): UserRole[] {
  const validRoles: UserRole[] = [
     'trial', 'member', 'mentor', 
    'superadmin', 'admin_marketing', 'admin_accounts'
  ];
  return roles.filter((r): r is UserRole => validRoles.includes(r as UserRole));
}

/**
 * PATCH: Safely updates the user's personal profile card fields.
 */
export async function updateMyProfile(
  rawInput: z.infer<typeof UpdateProfileSchema>
): Promise<ActionResponse<ProfileRow>> {
  try {
    const validated = UpdateProfileSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required to modify profile coordinates' };
    }

    const profileUpdatePayload: ProfileUpdate = {
      ...validated,
      motivations: validated.motivations as Json,
      commitment: validated.commitment as Json,
      roadblocks: validated.roadblocks as Json,
      social_footprint: validated.social_footprint as Json,
      skills: validated.skills as Json,
      assessment: validated.assessment as Json,
      integrations: validated.integrations as Json,
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
    return { success: true, data: data as ProfileRow };
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
export async function advanceOnboardingStep(
  rawInput: z.infer<typeof AdvanceOnboardingSchema>
): Promise<ActionResponse<{ step: string | number }>> {
  try {
    const { step } = AdvanceOnboardingSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication signature required' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ 
        onboarding_step: String(step), 
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
    if (authError || !user) {
      return { success: false, error: 'Authentication credentials not verified' };
    }

    const { data: profile, error: fetchErr } = await supabase
      .from('profiles')
      .select('roles, mentor_profile, provider_metadata')
      .eq('id', user.id)
      .single();

    if (fetchErr || !profile) {
      return { success: false, error: 'User workspace profile not found' };
    }

    const userRoles = asUserRoles(profile.roles || []);
    const hasRequiredRole = userRoles.includes(type as UserRole);
    const isAdmin = userRoles.includes('superadmin');

    if (type === 'mentor') {
      if (!hasRequiredRole && !isAdmin) {
        return { 
          success: false, 
          error: 'Access Denied: Account does not possess certified Mentor parameters. Required role: "mentor"' 
        };
      }
      
      const currentMeta = (profile.mentor_profile as Record<string, any>) || {};
      const updatePayload: ProfileUpdate = {
        mentor_profile: { ...currentMeta, ...metadata } as Json,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select()
        .single();

      if (error || !data) throw error;

      revalidatePath(`/dashboard/settings`);
      return { success: true, data: data as ProfileRow };
    } 
    else if (type === 'provider') {
      if (!hasRequiredRole && !isAdmin) {
        return { 
          success: false, 
          error: 'Access Denied: Account does not possess verified Partner Provider parameters. Required role: "provider"' 
        };
      }
      
      const currentMeta = (profile.provider_metadata as Record<string, any>) || {};
      const updatePayload: ProfileUpdate = {
        provider_metadata: { ...currentMeta, ...metadata } as Json,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select()
        .single();

      if (error || !data) throw error;

      revalidatePath(`/dashboard/settings`);
      return { success: true, data: data as ProfileRow };
    }

    return { success: false, error: 'Invalid metadata type specified' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to merge metadata parameters' };
  }
}

/**
 * PATCH: Secure administrative action handler to sync user roles.
 */
export async function syncUserRoleAdmin(
  rawInput: z.infer<typeof AdminSyncRoleSchema>
): Promise<ActionResponse<{ assignedRole: string; currentRoles: UserRole[] }>> {
  try {
    const validated = AdminSyncRoleSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user: callerUser } } = await supabase.auth.getUser();
    if (!callerUser) {
      return { success: false, error: 'Authentication required' };
    }

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', callerUser.id)
      .single();

    if (!callerProfile || !callerProfile.roles?.includes('superadmin')) {
      return { success: false, error: 'Access Denied: Super Admin authority credentials required' };
    }

    const { data: targetProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', validated.userId)
      .single();

    if (fetchError || !targetProfile) {
      return { success: false, error: 'Target user not found' };
    }

    const currentRoles = asUserRoles(targetProfile.roles || []);
    let updatedRoles: UserRole[];

    if (validated.operation === 'add') {
      if (currentRoles.includes(validated.role as UserRole)) {
        return { 
          success: false, 
          error: `User already has the "${validated.role}" role` 
        };
      }
      updatedRoles = [...currentRoles, validated.role as UserRole];
    } else if (validated.operation === 'remove') {
      if (!currentRoles.includes(validated.role as UserRole)) {
        return { 
          success: false, 
          error: `User does not have the "${validated.role}" role` 
        };
      }
      updatedRoles = currentRoles.filter(r => r !== validated.role);
    } else {
      updatedRoles = [validated.role as UserRole];
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        roles: updatedRoles, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', validated.userId);

    if (updateError) throw updateError;

    revalidatePath(`/admin/users`);
    return { 
      success: true, 
      data: { 
        assignedRole: validated.role,
        currentRoles: updatedRoles 
      } 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sync platform authorization credentials' };
  }
}