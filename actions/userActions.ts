// actions/userActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { ActionResponse } from '@/actions/progress';

type UserActionInsert = Database['public']['Tables']['user_actions']['Insert'];
type UserActionRow = Database['public']['Tables']['user_actions']['Row'];

interface CreateUserActionInput {
  title: string;
  description: string;
  checkbackDelayDays: number;
  metadata?: Record<string, any>;
  taskId?: string;
  actionType?: 'program' | 'general' | 'system';
}

/**
 * Creates a new action choice in public.user_actions table.
 */
export async function createUserAction(
  input: CreateUserActionInput
): Promise<ActionResponse<{ actionId: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required.' };
    }

    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + (input.checkbackDelayDays || 3));

    const payload: UserActionInsert = {
      user_id: user.id,
      task_id: input.taskId || null,
      title: input.title,
      description: input.description,
      action_type: input.actionType || 'program',
      status: 'pending',
      checkback_delay_days: input.checkbackDelayDays || 3,
      due_at: dueAt.toISOString(),
      metadata: input.metadata || {},
    };

    const { data, error } = await supabase
      .from('user_actions')
      .insert(payload)
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath('/dashboard');

    return { success: true, data: { actionId: data.id } };
  } catch (err: any) {
    console.error('❌ Error creating user action:', err.message);
    return { success: false, error: err.message || 'Failed to create action goal' };
  }
}


export async function updateUserActionStatusAction(
  actionId: string,
  status: 'pending' | 'completed' | 'dismissed'
): Promise<ActionResponse<UserActionRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required.' };
    }

    const updates: Database['public']['Tables']['user_actions']['Update'] = {
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_actions')
      .update(updates)
      .eq('id', actionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/dashboard');

    return { success: true, data };
  } catch (err: any) {
    console.error('❌ Error updating user action status:', err.message);
    return { success: false, error: err.message || 'Failed to update action' };
  }
}