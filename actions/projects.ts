// actions/projects.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/profiles';
import { Database } from '@/types/supabase';
import { 
  InterviewRecord, 
  ProblemHypothesis, 
  CustomerPersona, 
  MSPPayload, 
  CompetitiveLandscapePayload, 
  ViabilityCheckPayload 
} from '@/types/projects';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface CreateProjectParams {
  opportunityId: string;
  bizName: string;
  description: string;
}

export async function createProjectFromOpportunityAction(
  params: CreateProjectParams
): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Deactivate previous active projects
    await supabase
      .from('user_projects')
      .update({ is_active: false })
      .eq('user_id', user.id);

    const { data, error } = await supabase
      .from('user_projects')
      .insert({
        user_id: user.id,
        opportunity_id: params.opportunityId,
        biz_name: params.bizName,
        status: 'active',
        current_mission: 'mission-3',
        is_active: true,
        discovery_metrics: {
          description: params.description,
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error || !data) throw error;

    return { success: true, data };
  } catch (err: any) {
    console.error('❌ Error creating project:', err);
    return { success: false, error: err.message || 'Failed to create project' };
  }
}

export async function getActiveProjectAction(): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data: project, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;

    if (!project) {
      // Find committed opportunity to initialize active project
      const { data: opp } = await supabase
        .from('user_opportunities')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'committed')
        .maybeSingle();

      if (opp) {
        const { data: newProj, error: createErr } = await supabase
          .from('user_projects')
          .insert({
            user_id: user.id,
            opportunity_id: opp.id,
            biz_name: opp.title.replace(/^Solving:\s*/i, ''),
            status: 'active',
            current_mission: 'mission-3',
            is_active: true,
            discovery_metrics: {
              source_opportunity_id: opp.id,
            }
          })
          .select()
          .single();

        if (createErr) throw createErr;
        return { success: true, data: newProj };
      }

      return { success: false, error: 'No active project found. Please commit to an opportunity in Mission 2.' };
    }

    return { success: true, data: project };
  } catch (err: any) {
    console.error('❌ Error fetching active project:', err);
    return { success: false, error: err.message || 'Failed to retrieve project' };
  }
}

/**
 * Log customer interview entry into validation_data
 */
export async function logCustomerInterviewAction(
  projectId: string,
  interview: Omit<InterviewRecord, 'id' | 'logged_at'>
): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const { data: project } = await supabase
      .from('user_projects')
      .select('validation_data')
      .eq('id', projectId)
      .single();

    const existingValidation = (project?.validation_data as any) || { interviews: [] };
    const currentInterviews: InterviewRecord[] = existingValidation.interviews || [];

    const newInterview: InterviewRecord = {
      ...interview,
      id: crypto.randomUUID(),
      logged_at: new Date().toISOString()
    };

    const updatedInterviews = [newInterview, ...currentInterviews];

    const { data, error } = await supabase
      .from('user_projects')
      .update({
        validation_data: {
          ...existingValidation,
          interviews: updatedInterviews,
          total_interviews: updatedInterviews.length,
          last_updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to log interview' };
  }
}

/**
 * Helper to update discovery_metrics (Problem hypothesis / Persona)
 */
export async function updateProjectDiscoveryMetricsAction(
  projectId: string,
  payload: { problem_hypothesis?: ProblemHypothesis; persona?: CustomerPersona }
): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const { data: project } = await supabase
      .from('user_projects')
      .select('discovery_metrics')
      .eq('id', projectId)
      .single();

    const existing = (project?.discovery_metrics as any) || {};

    let updatedMetrics = { ...existing };
    if (payload.problem_hypothesis) {
      updatedMetrics.problem_hypothesis = payload.problem_hypothesis;
    }
    if (payload.persona) {
      const existingPersonas = existing.customer_personas || [];
      updatedMetrics.customer_personas = [payload.persona, ...existingPersonas];
    }

    const { data, error } = await supabase
      .from('user_projects')
      .update({
        discovery_metrics: updatedMetrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update discovery metrics' };
  }
}

/**
 * Helper to update solution_design (MSP definition & Build details)
 */
export async function updateProjectSolutionDesignAction(
  projectId: string,
  mspPayload: Partial<MSPPayload>
): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const { data: project } = await supabase
      .from('user_projects')
      .select('solution_design')
      .eq('id', projectId)
      .single();

    const existingDesign = (project?.solution_design as any) || {};
    const updatedMSP = { ...(existingDesign.msp || {}), ...mspPayload };

    const { data, error } = await supabase
      .from('user_projects')
      .update({
        solution_design: {
          ...existingDesign,
          msp: updatedMSP,
          updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update solution design' };
  }
}

/**
 * Update competitive landscape
 */
export async function updateProjectLandscapeAction(
  projectId: string,
  landscape: CompetitiveLandscapePayload
): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const { data, error } = await supabase
      .from('user_projects')
      .update({
        competitive_landscape: landscape as any, // ⚡ Cast to avoid Supabase strict Json index signature error
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update competitive landscape' };
  }
}

/**
 * Update viability check
 */
export async function updateProjectViabilityAction(
  projectId: string,
  viabilityPayload: Partial<ViabilityCheckPayload>
): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return { success: false, error: 'Authentication required' };

    const { data: project } = await supabase
      .from('user_projects')
      .select('viability_check')
      .eq('id', projectId)
      .single();

    const existing = (project?.viability_check as any) || {};
    const updatedViability = { ...existing, ...viabilityPayload };

    const { data, error } = await supabase
      .from('user_projects')
      .update({
        viability_check: updatedViability,
        status: viabilityPayload.final_decision === 'pivot' ? 'pivot' : 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update viability check' };
  }
}


/**
 * Generic update helper for specific project JSONB sections
 */
export async function updateProjectSectionAction(
  projectId: string,
  sectionKey: 'compliance_checklist' | 'discovery_metrics' | 'solution_design' | 'viability_check' | 'competitive_landscape',
  payload: Record<string, any>
): Promise<ActionResponse<UserProjectRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) return { success: false, error: 'Authentication required' };

    // Build explicit update payload based on sectionKey to satisfy Supabase strict typings
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (sectionKey === 'compliance_checklist') updateData.compliance_checklist = payload;
    if (sectionKey === 'discovery_metrics') updateData.discovery_metrics = payload;
    if (sectionKey === 'solution_design') updateData.solution_design = payload;
    if (sectionKey === 'viability_check') updateData.viability_check = payload;
    if (sectionKey === 'competitive_landscape') updateData.competitive_landscape = payload;

    const { data, error } = await supabase
      .from('user_projects')
      .update(updateData as any)
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || `Failed to update project ${sectionKey}` };
  }
}