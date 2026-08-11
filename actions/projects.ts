// actions/projects.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/profiles';
import { Database } from '@/types/supabase';

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