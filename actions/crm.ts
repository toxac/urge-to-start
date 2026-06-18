'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase'; // Using your uploaded types natively
import { queueEmail } from '@/lib/email';

// Replace with your project's specific Next.js Supabase client instantiators
import { createClient } from '@/lib/supabase/server'; 
import { createAdminClient } from '@/lib/supabase/admin'; 

// 1. EXTRACT STRICT DATABASE TYPES DIRECTLY FROM YOUR SCHEMA
type LeadRow = Database['public']['Tables']['leads']['Row'];
type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];

type NewsletterRow = Database['public']['Tables']['newsletters']['Row'];
type NewsletterInsert = Database['public']['Tables']['newsletters']['Insert'];
type NewsletterUpdate = Database['public']['Tables']['newsletters']['Update'];

// Unified response wrapper mapping
type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// 2. RUNTIME ZOD VALIDATION SCHEMAS (Synced to your Postgres Enums)
// =========================================================================
export const SubmitLeadSchema = z.object({
  first_name: z.string().max(100).optional().nullable(),
  last_name: z.string().max(100).optional().nullable(),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().nullable(),
  linkedin_username: z.string().max(100).optional().nullable(),
  instagram_username: z.string().max(100).optional().nullable(),
  // Utilizing your database enums explicitly
  source: z.enum(["manual_outbound", "linkedin", "instagram", "website_form", "referral", "other"]).default('website_form'),
  opted_in_newsletter: z.boolean().default(false),
  internal_notes: z.string().optional().nullable(),
});

export const UpdateLeadAdminSchema = SubmitLeadSchema.partial();

export const CreateNewsletterSchema = z.object({
  subject: z.string().min(1).max(255),
  content: z.string().min(1), // Raw Markdown Document contents body
});

export const UpdateNewsletterSchema = CreateNewsletterSchema.partial();

export const ScheduleNewsletterSchema = z.object({
  scheduled_for: z.string().datetime({ message: "Must be a valid ISO datetime string" }),
});

// =========================================================================
// 3. INTERNAL AUTHENTICATION GUARD CONTROL
// =========================================================================
async function assertAdminUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('UNAUTHENTICATED');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    throw new Error('UNAUTHORIZED_ADMIN_ONLY');
  }

  return user;
}

// =========================================================================
// 4. LEADS ACTIONS IMPLEMENTATION
// =========================================================================

/**
 * POST: Public anonymous endpoint for landing pages.
 * Fully type-safe upsert operation utilizing the LeadInsert interface.
 */
export async function submitAnonymousLead(rawInput: z.infer<typeof SubmitLeadSchema>): Promise<ActionResponse<LeadRow>> {
  try {
    const validated = SubmitLeadSchema.parse(rawInput);
    const supabaseAdmin = await createAdminClient();

    // Enforce LeadInsert interface constraint parameters
    const leadPayload: LeadInsert = {
      ...validated,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('leads')
      .upsert(leadPayload, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit lead data' };
  }
}

/**
 * GET: Secure administrative ledger list fetcher.
 */
export async function getLeadsAdmin(params?: { limit?: number; offset?: number }): Promise<ActionResponse<LeadRow[]>> {
  try {
    await assertAdminUser();
    const supabase = await createClient();

    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to retrieve ledger entries' };
  }
}

/**
 * PATCH: Secure admin update endpoint mapping directly to LeadUpdate interface parameters.
 */
export async function updateLeadAdmin(id: string, rawInput: z.infer<typeof UpdateLeadAdminSchema>): Promise<ActionResponse<LeadRow>> {
  try {
    await assertAdminUser();
    const validated = UpdateLeadAdminSchema.parse(rawInput);
    const supabase = await createClient();

    const leadUpdatePayload: LeadUpdate = {
      ...validated,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('leads')
      .update(leadUpdatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/crm/leads');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update lead properties' };
  }
}

/**
 * DELETE: Permanently expunges a lead row record.
 */
export async function deleteLeadAdmin(id: string): Promise<ActionResponse<{ deleted: boolean }>> {
  try {
    await assertAdminUser();
    const supabase = await createClient();

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/crm/leads');
    return { success: true, data: { deleted: true } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to clear record' };
  }
}

// =========================================================================
// 5. NEWSLETTERS ACTIONS IMPLEMENTATION
// =========================================================================

/**
 * POST: Initializes a fresh marketing message draft utilizing NewsletterInsert constraints.
 */
export async function createNewsletterDraft(rawInput: z.infer<typeof CreateNewsletterSchema>): Promise<ActionResponse<NewsletterRow>> {
  try {
    await assertAdminUser();
    const validated = CreateNewsletterSchema.parse(rawInput);
    const supabase = await createClient();

    const newsletterPayload: NewsletterInsert = {
      ...validated,
      status: 'draft',
    };

    const { data, error } = await supabase
      .from('newsletters')
      .insert(newsletterPayload)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to store newsletter compilation parameters' };
  }
}

/**
 * GET: Lists all historic and active campaign newsletter logs.
 */
export async function getNewslettersAdmin(): Promise<ActionResponse<NewsletterRow[]>> {
  try {
    await assertAdminUser();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to extract campaign data' };
  }
}

/**
 * PATCH: Upgrades markdown bodies or updates titles prior to locking dispatch sequences.
 */
export async function updateNewsletterDraft(id: string, rawInput: z.infer<typeof UpdateNewsletterSchema>): Promise<ActionResponse<NewsletterRow>> {
  try {
    await assertAdminUser();
    const validated = UpdateNewsletterSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: baseline } = await supabase.from('newsletters').select('status').eq('id', id).single();
    if (baseline && (baseline.status === 'sent' || baseline.status === 'scheduled')) {
      return { success: false, error: 'Cannot update content of an active or fully spent campaign' };
    }

    const newsletterUpdatePayload: NewsletterUpdate = {
      ...validated,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('newsletters')
      .update(newsletterUpdatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to adjust compilation contents' };
  }
}

/**
 * POST/PATCH combination: Shoves scheduled broadcast units directly down your asynchronous processing queue blocks.
 */
export async function scheduleNewsletterCampaign(
  id: string, 
  rawInput: z.infer<typeof ScheduleNewsletterSchema>
): Promise<ActionResponse<{ scheduledCount: number; status: string }>> {
  try {
    await assertAdminUser();
    const { scheduled_for } = ScheduleNewsletterSchema.parse(rawInput);
    const targetDate = new Date(scheduled_for);

    if (targetDate.getTime() <= Date.now()) {
      return { success: false, error: 'Scheduling targets must point explicitly to future execution vectors' };
    }

    const supabase = await createClient();
    const supabaseAdmin = await createAdminClient();

    const { data: newsletter, error: fetchError } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !newsletter) return { success: false, error: 'Campaign resource not located' };
    if (newsletter.status !== 'draft') return { success: false, error: 'Only campaign drafts can enter deployment tracks' };

    const { data: activeLeads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('email')
      .eq('opted_in_newsletter', true);

    if (leadsError) throw leadsError;
    if (!activeLeads || activeLeads.length === 0) {
      return { success: false, error: 'No active leads currently carry opted_in credentials' };
    }

    const newsletterLockPayload: NewsletterUpdate = {
      status: 'scheduled',
      scheduled_for,
      updated_at: new Date().toISOString()
    };

    const { error: lockError } = await supabase
      .from('newsletters')
      .update(newsletterLockPayload)
      .eq('id', id);

    if (lockError) throw lockError;

    for (const lead of activeLeads) {
      await queueEmail({
        to: lead.email,
        subject: newsletter.subject,
        html: newsletter.content, 
      }, targetDate);
    }

    revalidatePath('/admin/crm/newsletters');
    return { success: true, data: { scheduledCount: activeLeads.length, status: 'scheduled' } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Processing queue failed execution' };
  }
}