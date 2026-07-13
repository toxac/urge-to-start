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

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
// =========================================================================



// =========================================================================
// SERVER ACTIONS
// =========================================================================

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
 * GET: Fetch a single project by ID
 */
export async function getProject(
  projectId: string
): Promise<ActionResponse<ProjectRow>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error) {
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

    const updatePayload: ProjectUpdate = {
      updated_at: new Date().toISOString(),
      ...validated,
    };

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