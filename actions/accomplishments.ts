// actions/accomplishments.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export interface RecordAccomplishmentInput {
  awardedFor: 'task' | 'quest' | 'mission' | 'post' | 'event' | 'engagement' | string;
  title: string;
  description?: string | null;
  pointsGranted: number;
  badgeGranted?: string | null;
  relatedTable?: string | null;
  relatedReferenceId?: string | null;
}

/**
 * Universal accomplishment action — records points and optional badges to user_accomplishments.
 */
export async function recordAccomplishment(input: RecordAccomplishmentInput) {
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) {
    return { success: false, error: 'Unauthorized user session.' };
  }

  const { data, error } = await supabase
    .from('user_accomplishments')
    .insert({
      user_id: user.id,
      awarded_for: input.awardedFor,
      title: input.title,
      description: input.description || null,
      points_granted: input.pointsGranted || 0,
      badge_granted: input.badgeGranted || null,
      related_table: input.relatedTable || null,
      related_reference_id: input.relatedReferenceId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating accomplishment record:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, accomplishmentRow: data };
}