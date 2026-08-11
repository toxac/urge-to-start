// actions/opportunities.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/profiles';
import { Database } from '@/types/supabase';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunitySourceType = Database['public']['Enums']['opportunity_source_type'];
type OpportunityStatus = Database['public']['Enums']['opportunity_status'];

interface CreateOpportunityParams {
  taskId?: string;
  projectId?: string;
  title: string;
  description: string;
  sourceType: OpportunitySourceType;
  status?: OpportunityStatus;
  captureMetadata?: Record<string, any>;
}

interface ScoreOpportunityParams {
  opportunityId: string;
  scores: {
    passion: number;
    urgency: number;
    workaround_spend: number;
    unfair_advantage: number;
    msp_feasibility: number;
  };
  notes?: string;
}

export async function createOpportunityAction(
  params: CreateOpportunityParams
): Promise<ActionResponse<UserOpportunityRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('user_opportunities')
      .insert({
        user_id: user.id,
        project_id: params.projectId || null,
        task_id: params.taskId || null,
        title: params.title,
        description: params.description,
        source_type: params.sourceType,
        status: params.status || 'raw_seed',
        capture_metadata: params.captureMetadata || {},
      })
      .select()
      .single();

    if (error || !data) throw error;

    return { success: true, data };
  } catch (err: any) {
    console.error('❌ Error creating opportunity:', err);
    return { success: false, error: err.message || 'Failed to create opportunity' };
  }
}

export async function getUserOpportunitiesAction(
  sourceType?: OpportunitySourceType
): Promise<ActionResponse<UserOpportunityRow[]>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    let query = supabase
      .from('user_opportunities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (sourceType) {
      query = query.eq('source_type', sourceType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error('❌ Error fetching opportunities:', err);
    return { success: false, error: err.message || 'Failed to fetch opportunities' };
  }
}

export async function scoreOpportunityAction(
  params: ScoreOpportunityParams
): Promise<ActionResponse<UserOpportunityRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const totalScore = 
      params.scores.passion +
      params.scores.urgency +
      params.scores.workaround_spend +
      params.scores.unfair_advantage +
      params.scores.msp_feasibility;

    const { data, error } = await supabase
      .from('user_opportunities')
      .update({
        scores: {
          criteria: params.scores,
          total_score: totalScore,
          notes: params.notes || null,
          scored_at: new Date().toISOString()
        },
        status: 'scored',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.opportunityId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;

    return { success: true, data };
  } catch (err: any) {
    console.error('❌ Error scoring opportunity:', err);
    return { success: false, error: err.message || 'Failed to score opportunity' };
  }
}

export async function selectOpportunityAction(
  opportunityId: string,
  justification: string
): Promise<ActionResponse<UserOpportunityRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Reset any previously selected opportunity back to 'scored'
    await supabase
      .from('user_opportunities')
      .update({ status: 'scored' })
      .eq('user_id', user.id)
      .eq('status', 'committed');

    // Mark current opportunity as 'committed'
    const { data, error } = await supabase
      .from('user_opportunities')
      .update({
        status: 'committed',
        capture_metadata: {
          justification,
          committed_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;

    return { success: true, data };
  } catch (err: any) {
    console.error('❌ Error committing opportunity:', err);
    return { success: false, error: err.message || 'Failed to select opportunity' };
  }
}