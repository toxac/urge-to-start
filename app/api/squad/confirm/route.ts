// actions/contacts.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { ActionResponse } from '@/types/profiles';
import { 
  UserContactRow, 
  BulkSquadContactsSchema, 
  CreateSquadContactSchema 
} from '@/types/contacts';

/**
 * Adds one or more Cheer Squad contacts to user_contacts table
 */
export async function addSquadContactsAction(
  rawInput: z.infer<typeof BulkSquadContactsSchema>
): Promise<ActionResponse<UserContactRow[]>> {
  try {
    const validated = BulkSquadContactsSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const payload = validated.contacts.map((c) => ({
      user_id: user.id,
      email: c.email.trim().toLowerCase(),
      first_name: c.first_name?.trim() || null,
      last_name: c.last_name?.trim() || null,
      note: c.note?.trim() || null,
      categories: ['squad' as const],
      status: 'unconfirmed' as const,
      source: 'personal_network' as const,
      stage: 'lead' as const,
    }));

    const { data, error } = await supabase
      .from('user_contacts')
      .insert(payload)
      .select();

    if (error || !data) throw error;

    revalidatePath('/program');
    return { success: true, data: data as UserContactRow[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save squad contacts' };
  }
}

/**
 * Fetches all Cheer Squad contacts for the current user
 */
export async function getSquadContactsAction(): Promise<ActionResponse<UserContactRow[]>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('user_contacts')
      .select('*')
      .eq('user_id', user.id)
      .contains('categories', ['squad'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: (data || []) as UserContactRow[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch squad contacts' };
  }
}

/**
 * Deletes a squad contact
 */
export async function deleteSquadContactAction(contactId: string): Promise<ActionResponse<{ id: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { error } = await supabase
      .from('user_contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/program');
    return { success: true, data: { id: contactId } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete contact' };
  }
}