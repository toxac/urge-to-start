'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';

type OpportunityRow = Database['public']['Tables']['opportunities']['Row'];
type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
// =========================================================================

export const CaptureSeedSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  description: z.string().min(1),
  source_type: z.enum(['personal', 'peer_circle', 'internet_safari']),
  capture_metadata: z.record(z.string(), z.any()).default({}),
});

export const LogValidationSchema = z.object({
  opportunityId: z.string().uuid(),
  interviews: z.array(z.record(z.string(), z.any())).min(1),
  pain_score_grade: z.number().min(0).max(100),
});

// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * POST: Captures a raw problem seed discovered during the initial hunt phases (Quests 1-3).
 */
export async function captureOpportunitySeed(rawInput: z.infer<typeof CaptureSeedSchema>): Promise<ActionResponse<OpportunityRow>> {
  try {
    const validated = CaptureSeedSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required to log opportunities' };

    const seedPayload: OpportunityInsert = {
      ...validated,
      user_id: user.id,
      status: 'raw_seed', // Standard initial maturity level
      capture_metadata: validated.capture_metadata as Json,
      validation_interviews: [] as any,
      pain_score_grade: 0,
    };

    const { data, error } = await supabase
      .from('opportunities')
      .insert(seedPayload as any) // Safely casted during ongoing migration syncs
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/dashboard/discovery');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to register problem seed' };
  }
}

/**
 * POST: Logs validation interview conversations and updates the friction score (Quest 5, Task 1).
 */
export async function logValidationInterviews(rawInput: z.infer<typeof LogValidationSchema>): Promise<ActionResponse<OpportunityRow>> {
  try {
    const validated = LogValidationSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication credentials not verified' };

    // Ownership Control Guard
    const { data: currentSeed } = await supabase.from('opportunities').select('user_id').eq('id', validated.opportunityId).single();
    if (!currentSeed || currentSeed.user_id !== user.id) {
      return { success: false, error: 'Access Denied: Row tenancy verification mismatch' };
    }

    const { data, error } = await supabase
      .from('opportunities')
      .update({
        status: 'validated',
        validation_interviews: validated.interviews as Json,
        pain_score_grade: validated.pain_score_grade,
        updated_at: new Date().toISOString()
      })
      .eq('id', validated.opportunityId)
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/dashboard/discovery');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to log verification insights' };
  }
}

/**
 * POST: Multi-row transactional atomic pivot (Quest 5, Task 2).
 * Commits to an idea, deploys a parent project profile row, and locks down the foreign key link.
 */
export async function commitToPrimaryOpportunity(opportunityId: string): Promise<ActionResponse<{ project: any; opportunity: OpportunityRow }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication signature mandatory to execute pivots' };

    // 1. Fetch and assert ownership of target opportunity
    const { data: opportunity } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (!opportunity || opportunity.user_id !== user.id) {
      return { success: false, error: 'Unauthorized target resource selection identifier mismatch' };
    }

    // 2. ATOMIC STEP A: Spawn the corresponding row record profile inside the projects table
    const projectPayload: ProjectInsert = {
      user_id: user.id,
      biz_name: opportunity.title, // Seed initial business profile using opportunity's title
      five_word_hook: 'A problem worth solving.',
      discovery_metrics: {},
      financial_blueprint: {},
      infrastructure_nodes: {},
      is_active: true
    };

    const { data: spawnedProject, error: projErr } = await supabase
      .from('projects')
      .insert(projectPayload)
      .select()
      .single();

    if (projErr || !spawnedProject) throw projErr;

    // 3. ATOMIC STEP B: Update opportunity status parameters and lock the new parent project_id link
    const { data: updatedOpportunity, error: oppErr } = await supabase
      .from('opportunities')
      .update({
        status: 'committed',
        project_id: spawnedProject.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', opportunityId)
      .select()
      .single();

    if (oppErr || !updatedOpportunity) {
      // Rollback protection guard: wipe the spawned project row if the opportunity update snaps
      await supabase.from('projects').delete().eq('id', spawnedProject.id);
      throw oppErr;
    }

    revalidatePath('/dashboard/discovery');
    revalidatePath('/dashboard/projects');

    return {
      success: true,
      data: {
        project: spawnedProject,
        opportunity: updatedOpportunity
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Fatal exception running atomic opportunity commitment loop' };
  }
}