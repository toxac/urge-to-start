// actions/observations.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/profiles';
import { Database } from '@/types/supabase';

type UserObservationRow = Database['public']['Tables']['user_observations']['Row'];

interface CreateObservationParams {
  taskId?: string;
  who: string;
  whereLocation: string;
  whenContext: string;
  what: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export async function createObservationAction(
  params: CreateObservationParams
): Promise<ActionResponse<UserObservationRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('user_observations')
      .insert({
        user_id: user.id,
        task_id: params.taskId || null,
        who: params.who,
        where_location: params.whereLocation,
        when_context: params.whenContext,
        what: params.what,
        notes: params.notes || null,
        metadata: params.metadata || {},
      })
      .select()
      .single();

    if (error || !data) throw error;

    return { success: true, data };
  } catch (err: any) {
    console.error('❌ Error creating observation:', err);
    return { success: false, error: err.message || 'Failed to record observation' };
  }
}

export async function getUserObservationsAction(
  taskId?: string
): Promise<ActionResponse<UserObservationRow[]>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    let query = supabase
      .from('user_observations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error('❌ Error fetching observations:', err);
    return { success: false, error: err.message || 'Failed to fetch observations' };
  }
}