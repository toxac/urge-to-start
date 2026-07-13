'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { CreateEventSchema, QueryEventsSchema } from '@/types/events';

type EventRow = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
// =========================================================================


// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * POST: Privileged creation endpoint allowing Admins or Mentors to schedule events.
 * Updated to check roles array instead of a single role field.
 */
export async function createPlatformEventAdmin(rawInput: z.infer<typeof CreateEventSchema>): Promise<ActionResponse<EventRow>> {
  try {
    const validated = CreateEventSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Authentication required to create events' };
    }

    // ✅ FIXED: Use roles array instead of single role field
    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    // Check if user has admin or mentor role in their roles array
    const userRoles = (profile.roles || []) as string[];
    const isAdmin = userRoles.includes('superadmin') || userRoles.includes('admin_marketing') || userRoles.includes('admin_accounts');
    const isMentor = userRoles.includes('mentor');

    if (!isAdmin && !isMentor) {
      return { 
        success: false, 
        error: 'Access Denied: Only platform administrators or mentors can organize calendar events' 
      };
    }

    const eventPayload: EventInsert = {
      ...validated,
      speakers: validated.speakers as Json,
      venue_details: validated.venue_details as Json,
      participants: [] as any,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('events')
      .insert(eventPayload)
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/events');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to schedule new event' };
  }
}

/**
 * POST: Registers an authenticated user for a specific event entry row.
 * Safely aggregates attendee objects inside the participants JSONB map.
 */
export async function registerForEvent(eventId: string): Promise<ActionResponse<{ registered: boolean; totalParticipants: number }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication signature required to register for events' };

    // 1. Fetch current roster map parameters
    const { data: event, error: fetchErr } = await supabase
      .from('events')
      .select('participants, event_date')
      .eq('id', eventId)
      .single();

    if (fetchErr || !event) return { success: false, error: 'Target event configuration not found' };

    // 2. Prevent past event entry modifications
    if (new Date(event.event_date).getTime() < Date.now()) {
      return { success: false, error: 'Registration Block: This calendar event has already concluded' };
    }

    // 3. Parse existing registration sheets safely
    let currentParticipants = Array.isArray(event.participants) ? (event.participants as Record<string, any>[]) : [];

    // 4. IDEMPOTENCY GUARD: Check for existing signups
    const alreadyRegistered = currentParticipants.some(p => p.user_id === user.id);
    if (alreadyRegistered) {
      return { success: false, error: 'Idempotency Block: You have already secured a slot for this event' };
    }

    // 5. Append new immutable validation node
    const newParticipantNode = {
      user_id: user.id,
      registered_at: new Date().toISOString(),
      checked_in: false
    };

    const updatedParticipants = [...currentParticipants, newParticipantNode];

    const { error: updateErr } = await supabase
      .from('events')
      .update({
        participants: updatedParticipants as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId);

    if (updateErr) throw updateErr;

    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);

    return { 
      success: true, 
      data: { 
        registered: true, 
        totalParticipants: updatedParticipants.length 
      } 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to complete registration trace loop' };
  }
}

/**
 * GET: Pulls future chronological events feed grids.
 */
export async function getUpcomingEventsFeed(rawInput: z.infer<typeof QueryEventsSchema>): Promise<ActionResponse<EventRow[]>> {
  try {
    const query = QueryEventsSchema.parse(rawInput);
    const supabase = await createClient();

    let dbQuery = supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString());

    if (!query.includePrivate) {
      dbQuery = dbQuery.eq('is_public', true);
    }
    if (query.format) {
      dbQuery = dbQuery.eq('format', query.format);
    }
    if (query.type) {
      dbQuery = dbQuery.eq('type', query.type);
    }

    const { data, error } = await dbQuery.order('event_date', { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to extract calendar feed records' };
  }
}