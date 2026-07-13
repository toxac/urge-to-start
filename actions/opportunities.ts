// actions/opportunities.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';

type OpportunityRow = Database['public']['Tables']['opportunities']['Row'];
type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert'];
type OpportunityUpdate = Database['public']['Tables']['opportunities']['Update'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectRow = Database['public']['Tables']['projects']['Row'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
// =========================================================================

const OpportunitySourceType = z.enum([
  'personal_problems',
  'skills',
  'zone_of_influence',
  'broader_search'
]);

const OpportunityStatus = z.enum([
  'raw_seed',
  'validated',
  'committed',
  'archived',
  'scored'
]);

const CreateOpportunitySchema = z.object({
  title: z.string().min(1).max(255).trim(),
  description: z.string().min(1),
  source_type: OpportunitySourceType,
  capture_metadata: z.record(z.string(), z.any()).default({}),
  validation_interviews: z.record(z.string(), z.any()).default({}),
  scores: z.record(z.string(), z.any()).nullable().default(null),
});

const ValidateOpportunitySchema = z.object({
  opportunityId: z.string().uuid(),
  people_spoken_to: z.number().min(0),
  confirmed_problem: z.boolean(),
  would_pay: z.boolean(),
  willingness_to_pay: z.number().nullable().optional(),
  quotes: z.array(z.string()).default([]),
  insights: z.string().optional(),
});

const ScoreOpportunitySchema = z.object({
  opportunityId: z.string().uuid(),
  cares_about_problem: z.number().min(1).max(10),
  knows_people_with_problem: z.number().min(1).max(10),
  can_talk_to_them: z.number().min(1).max(10),
  unfair_advantage: z.number().min(1).max(10),
  clear_payment_path: z.number().min(1).max(10),
});

// =========================================================================
// TYPES FOR OPTIONS
// =========================================================================

type OpportunityStatusType = 'raw_seed' | 'validated' | 'committed' | 'archived' | 'scored';
type OpportunitySourceType = 'personal_problems' | 'skills' | 'zone_of_influence' | 'broader_search';

// =========================================================================
// SERVER ACTIONS
// =========================================================================

export async function createOpportunity(
  rawInput: z.infer<typeof CreateOpportunitySchema>
): Promise<ActionResponse<OpportunityRow>> {
  try {
    const validated = CreateOpportunitySchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required to create opportunities' };
    }

    const insertPayload: OpportunityInsert = {
      user_id: user.id,
      title: validated.title,
      description: validated.description,
      source_type: validated.source_type,
      status: 'raw_seed',
      capture_metadata: validated.capture_metadata as Json,
      validation_interviews: validated.validation_interviews as Json,
      scores: validated.scores as Json | null,
      pain_score_grade: null,
      project_id: null,
      validated_at: null,
    };

    const { data, error } = await supabase
      .from('opportunities')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      console.error('Create opportunity error:', error);
      throw error;
    }

    revalidatePath('/dashboard/discovery');
    return { success: true, data };
  } catch (err: any) {
    console.error('Create opportunity catch:', err);
    return { success: false, error: err.message || 'Failed to create opportunity' };
  }
}

export async function validateOpportunity(
  rawInput: z.infer<typeof ValidateOpportunitySchema>
): Promise<ActionResponse<OpportunityRow>> {
  try {
    const validated = ValidateOpportunitySchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data: existing, error: fetchError } = await supabase
      .from('opportunities')
      .select('user_id, status, validation_interviews')
      .eq('id', validated.opportunityId)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: 'Opportunity not found' };
    }

    if (existing.user_id !== user.id) {
      return { success: false, error: 'Access denied' };
    }

    if (existing.status !== 'raw_seed' && existing.status !== 'validated') {
      return { success: false, error: `Opportunity is already ${existing.status}` };
    }

    const validationData = {
      people_spoken_to: validated.people_spoken_to,
      confirmed_problem: validated.confirmed_problem,
      would_pay: validated.would_pay,
      willingness_to_pay: validated.willingness_to_pay || null,
      quotes: validated.quotes,
      insights: validated.insights || '',
      validated_at: new Date().toISOString()
    };

    let mergedValidation = validationData;
    if (existing.validation_interviews) {
      const existingData = existing.validation_interviews as Record<string, any>;
      mergedValidation = {
        ...existingData,
        ...validationData
      };
    }

    const updatePayload: OpportunityUpdate = {
      status: 'validated',
      validation_interviews: mergedValidation as Json,
      validated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('opportunities')
      .update(updatePayload)
      .eq('id', validated.opportunityId)
      .select()
      .single();

    if (error || !data) {
      console.error('Validate opportunity error:', error);
      throw error;
    }

    revalidatePath('/dashboard/discovery');
    return { success: true, data };
  } catch (err: any) {
    console.error('Validate opportunity catch:', err);
    return { success: false, error: err.message || 'Failed to validate opportunity' };
  }
}

export async function scoreOpportunity(
  rawInput: z.infer<typeof ScoreOpportunitySchema>
): Promise<ActionResponse<OpportunityRow>> {
  try {
    const validated = ScoreOpportunitySchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data: existing, error: fetchError } = await supabase
      .from('opportunities')
      .select('user_id, status')
      .eq('id', validated.opportunityId)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: 'Opportunity not found' };
    }

    if (existing.user_id !== user.id) {
      return { success: false, error: 'Access denied' };
    }

    if (existing.status !== 'validated' && existing.status !== 'scored') {
      return { success: false, error: `Opportunity must be validated first (current: ${existing.status})` };
    }

    const totalScore = 
      validated.cares_about_problem +
      validated.knows_people_with_problem +
      validated.can_talk_to_them +
      validated.unfair_advantage +
      validated.clear_payment_path;

    const scoresData = {
      cares_about_problem: validated.cares_about_problem,
      knows_people_with_problem: validated.knows_people_with_problem,
      can_talk_to_them: validated.can_talk_to_them,
      unfair_advantage: validated.unfair_advantage,
      clear_payment_path: validated.clear_payment_path,
      total_score: totalScore,
      scored_at: new Date().toISOString()
    };

    const updatePayload: OpportunityUpdate = {
      status: 'scored',
      scores: scoresData as Json,
      pain_score_grade: totalScore,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('opportunities')
      .update(updatePayload)
      .eq('id', validated.opportunityId)
      .select()
      .single();

    if (error || !data) {
      console.error('Score opportunity error:', error);
      throw error;
    }

    revalidatePath('/dashboard/discovery');
    return { success: true, data };
  } catch (err: any) {
    console.error('Score opportunity catch:', err);
    return { success: false, error: err.message || 'Failed to score opportunity' };
  }
}

export async function archiveOpportunity(
  opportunityId: string
): Promise<ActionResponse<OpportunityRow>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('opportunities')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Archive opportunity error:', error);
      throw error;
    }

    revalidatePath('/dashboard/discovery');
    return { success: true, data };
  } catch (err: any) {
    console.error('Archive opportunity catch:', err);
    return { success: false, error: err.message || 'Failed to archive opportunity' };
  }
}

export async function commitToOpportunity(
  opportunityId: string,
  projectData?: {
    biz_name?: string;
    five_word_hook?: string;
    tagline?: string;
  }
): Promise<ActionResponse<{ project: ProjectRow; opportunity: OpportunityRow }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data: opportunity, error: oppFetchError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();

    if (oppFetchError || !opportunity) {
      return { success: false, error: 'Opportunity not found or access denied' };
    }

    if (opportunity.status !== 'scored' && opportunity.status !== 'validated') {
      return { success: false, error: `Opportunity must be scored first (current: ${opportunity.status})` };
    }

    const projectPayload: ProjectInsert = {
      user_id: user.id,
      biz_name: projectData?.biz_name || opportunity.title,
      five_word_hook: projectData?.five_word_hook || null,
      discovery_metrics: {},
      financial_blueprint: {},
      infrastructure_nodes: {},
      is_active: true,
    };

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(projectPayload)
      .select()
      .single();

    if (projectError || !project) {
      console.error('Create project error:', projectError);
      throw projectError;
    }

    const updatePayload: OpportunityUpdate = {
      status: 'committed',
      project_id: project.id,
      updated_at: new Date().toISOString()
    };

    const { data: updatedOpportunity, error: oppUpdateError } = await supabase
      .from('opportunities')
      .update(updatePayload)
      .eq('id', opportunityId)
      .select()
      .single();

    if (oppUpdateError || !updatedOpportunity) {
      console.error('Update opportunity error:', oppUpdateError);
      await supabase.from('projects').delete().eq('id', project.id);
      throw oppUpdateError;
    }

    revalidatePath('/dashboard/discovery');
    revalidatePath('/dashboard/projects');

    return {
      success: true,
      data: {
        project,
        opportunity: updatedOpportunity
      }
    };
  } catch (err: any) {
    console.error('Commit to opportunity catch:', err);
    return { success: false, error: err.message || 'Failed to commit to opportunity' };
  }
}

/**
 * GET: Fetch all opportunities for the current user
 * ⚡ FIXED: Use type assertion with as any to bypass the type checking
 */
export async function getOpportunities(
  options?: {
    status?: OpportunityStatusType[];
    source_type?: OpportunitySourceType[];
    limit?: number;
  }
): Promise<ActionResponse<OpportunityRow[]>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // ⚡ FIXED: Use as any to bypass the type checking since we know the values are valid
    if (options?.status && options.status.length > 0) {
      query = query.in('status', options.status as any);
    }

    if (options?.source_type && options.source_type.length > 0) {
      query = query.in('source_type', options.source_type as any);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get opportunities error:', error);
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error('Get opportunities catch:', err);
    return { success: false, error: err.message || 'Failed to fetch opportunities' };
  }
}

export async function getOpportunity(
  opportunityId: string
): Promise<ActionResponse<OpportunityRow>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Get opportunity error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Get opportunity catch:', err);
    return { success: false, error: err.message || 'Failed to fetch opportunity' };
  }
}

export async function updateOpportunity(
  opportunityId: string,
  updates: {
    title?: string;
    description?: string;
    capture_metadata?: Record<string, any>;
  }
): Promise<ActionResponse<OpportunityRow>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const updatePayload: OpportunityUpdate = {
      updated_at: new Date().toISOString()
    };

    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.capture_metadata !== undefined) {
      updatePayload.capture_metadata = updates.capture_metadata as Json;
    }

    const { data, error } = await supabase
      .from('opportunities')
      .update(updatePayload)
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Update opportunity error:', error);
      throw error;
    }

    revalidatePath('/dashboard/discovery');
    return { success: true, data };
  } catch (err: any) {
    console.error('Update opportunity catch:', err);
    return { success: false, error: err.message || 'Failed to update opportunity' };
  }
}