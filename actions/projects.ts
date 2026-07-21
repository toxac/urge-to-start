// actions/projects.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { CreateProjectSchema, UpdateProjectSchema } from '@/types/projects';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

/**
 * POST: Creates a new project
 */
export async function createProject(
  rawInput: z.infer<typeof CreateProjectSchema>
): Promise<ActionResponse<ProjectRow>> {
  try {
    const validated = CreateProjectSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required to create a project' };
    }

    const insertPayload: ProjectInsert = {
      user_id: user.id,
      biz_name: validated.biz_name,
      five_word_hook: validated.five_word_hook || null,
      is_active: true,
      // ⚡ Required JSON fields - initialized as empty objects
      discovery_metrics: {},
      financial_blueprint: {},
      infrastructure_nodes: {},
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      console.error('Create project error:', error);
      throw error;
    }

    revalidatePath('/dashboard/projects');
    return { success: true, data };
  } catch (err: any) {
    console.error('Create project catch:', err);
    return { success: false, error: err.message || 'Failed to create project' };
  }
}

/**
 * GET: Fetch all projects for the current user
 */
export async function getProjects(
  options?: {
    status?: string[];
    limit?: number;
  }
): Promise<ActionResponse<ProjectRow[]>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    let query = supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get projects error:', error);
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error('Get projects catch:', err);
    return { success: false, error: err.message || 'Failed to fetch projects' };
  }
}

/**
 * GET: Fetch the current user's project
 */
export async function getCurrentProject(): Promise<ActionResponse<ProjectRow>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no project found, return null data
      if (error.code === 'PGRST116') {
        return { success: true, data: null as any };
      }
      console.error('Get project error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Get project catch:', err);
    return { success: false, error: err.message || 'Failed to fetch project' };
  }
}

/**
 * PUT: Updates a project
 */
export async function updateProject(
  projectId: string,
  updates: z.infer<typeof UpdateProjectSchema>
): Promise<ActionResponse<ProjectRow>> {
  try {
    const validated = UpdateProjectSchema.parse(updates);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check ownership
    const { data: existing, error: fetchError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: 'Project not found' };
    }

    if (existing.user_id !== user.id) {
      return { success: false, error: 'Access denied' };
    }

    // Build update payload - only include fields that are provided
    const updatePayload: ProjectUpdate = {
      updated_at: new Date().toISOString()
    };

    // Core fields
    if (validated.biz_name !== undefined) updatePayload.biz_name = validated.biz_name;
    if (validated.five_word_hook !== undefined) updatePayload.five_word_hook = validated.five_word_hook;
    if (validated.tagline !== undefined) updatePayload.tagline = validated.tagline;
    if (validated.is_active !== undefined) updatePayload.is_active = validated.is_active;
    if (validated.status !== undefined) updatePayload.status = validated.status;
    if (validated.current_mission !== undefined) updatePayload.current_mission = validated.current_mission;

    // JSON fields
    if (validated.discovery_metrics !== undefined) updatePayload.discovery_metrics = validated.discovery_metrics as Json;
    if (validated.financial_blueprint !== undefined) updatePayload.financial_blueprint = validated.financial_blueprint as Json;
    if (validated.infrastructure_nodes !== undefined) updatePayload.infrastructure_nodes = validated.infrastructure_nodes as Json;
    if (validated.validation_data !== undefined) updatePayload.validation_data = validated.validation_data as Json;
    if (validated.competitive_landscape !== undefined) updatePayload.competitive_landscape = validated.competitive_landscape as Json;
    if (validated.compliance_checklist !== undefined) updatePayload.compliance_checklist = validated.compliance_checklist as Json;
    if (validated.solution_design !== undefined) updatePayload.solution_design = validated.solution_design as Json;
    if (validated.viability_check !== undefined) updatePayload.viability_check = validated.viability_check as Json;
    if (validated.build_data !== undefined) updatePayload.build_data = validated.build_data as Json;
    if (validated.launch_data !== undefined) updatePayload.launch_data = validated.launch_data as Json;
    if (validated.operations_data !== undefined) updatePayload.operations_data = validated.operations_data as Json;
    if (validated.review_data !== undefined) updatePayload.review_data = validated.review_data as Json;

    const { data, error } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', projectId)
      .select()
      .single();

    if (error || !data) {
      console.error('Update project error:', error);
      throw error;
    }

    revalidatePath('/dashboard/projects');
    return { success: true, data };
  } catch (err: any) {
    console.error('Update project catch:', err);
    return { success: false, error: err.message || 'Failed to update project' };
  }
}


/**
 * Helper: Update a specific section of the project
 */
export async function updateProjectSection(
  projectId: string,
  section: keyof Pick<
    ProjectRow,
    'validation_data' | 'competitive_landscape' | 'compliance_checklist' | 
    'solution_design' | 'viability_check' | 'build_data' | 
    'launch_data' | 'operations_data' | 'review_data' | 'financial_blueprint'
  >,
  data: Record<string, any>
): Promise<ActionResponse<ProjectRow>> {
  return updateProject(projectId, { [section]: data });
}