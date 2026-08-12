// actions/devFeedback.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

type DevFeedbackRow = Database['public']['Tables']['dev_feedbacks']['Row'] ;

export async function getDevFeedbacksAction(taskId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('dev_feedbacks')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };

    return { success: true, data: (data || []) as DevFeedbackRow[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch feedback' };
  }
}

export async function createDevFeedbackAction({
  taskId,
  title,
  text
}: {
  taskId: string;
  title: string;
  text: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Get username from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const username = profile?.username || user.email?.split('@')[0] || 'tester';

    const { data, error } = await supabase
      .from('dev_feedbacks')
      .insert({
        user_id: user.id,
        username,
        title: title.trim(),
        text: text.trim(),
        status: 'unresolved',
        task_id: taskId
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/platform/program');
    return { success: true, data: data as DevFeedbackRow };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save feedback' };
  }
}