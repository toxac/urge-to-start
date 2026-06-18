'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';

type ListingRow = Database['public']['Tables']['marketplace_listings']['Row'];
type ListingInsert = Database['public']['Tables']['marketplace_listings']['Insert'];
type ReviewInsert = Database['public']['Tables']['marketplace_reviews']['Insert'];
type FlagInsert = Database['public']['Tables']['marketplace_flags']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
// =========================================================================

export const SubmitListingSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  tagline: z.string().min(1).max(255).trim(),
  description: z.string().min(1),
  category: z.string().min(1).trim(),
  listing_type: z.enum(['peer_service', 'provider_perk']),
  cta_url: z.string().url(),
  cta_type: z.string().default('Apply Now'),
  price_display: z.string().default('Free'),
  promo_code: z.string().trim().optional().nullable(),
});

export const QueryListingsSchema = z.object({
  listing_type: z.enum(['peer_service', 'provider_perk']).optional().nullable(),
  category: z.string().optional().nullable(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const SubmitReviewSchema = z.object({
  listingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000).trim(),
});

export const SubmitFlagSchema = z.object({
  listingId: z.string().uuid(),
  reason: z.enum(['broken_link', 'misleading_offer', 'spam_or_abuse', 'expired_perk', 'failed_to_deliver']),
  details: z.string().max(1000).optional().nullable(),
});

export const AdminAuditSchema = z.object({
  listingId: z.string().uuid(),
  ai_verification_score: z.number().min(0).max(100),
  ai_audit_notes: z.string().min(1),
  status: z.enum(['approved', 'rejected', 'draft', 'expired']),
});

// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * POST: Instantiates a fresh marketplace listing.
 * Enforces cross-role policy checks based on selected listing types.
 */
export async function submitMarketplaceListing(rawInput: z.infer<typeof SubmitListingSchema>): Promise<ActionResponse<ListingRow>> {
  try {
    const validated = SubmitListingSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required to post listings' };

    // 1. ROLE COMPATIBILITY SECURITY CHECK
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile) return { success: false, error: 'User profile ledger entry could not be resolved' };

    if (validated.listing_type === 'provider_perk' && profile.role !== 'provider' && profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only certified providers or admins can publish ecosystem perk vouchers' };
    }
    if (validated.listing_type === 'peer_service' && (profile.role === 'lead' || profile.role === 'suspended')) {
      return { success: false, error: 'Your account status tier does not carry listing creation privileges' };
    }

    // 2. CONSTRUCT UNIQUE IDENTIFIER SLUG
    const cleanSlug = `${validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;

    const listingPayload: ListingInsert = {
      ...validated,
      creator_id: user.id,
      slug: cleanSlug,
      status: 'pending_review', // Force triage path curation validation upfront
      ai_verification_score: 0,
      avg_rating: 0,
      reviews_count: 0,
      flags_count: 0,
    };

    const { data, error } = await supabase.from('marketplace_listings').insert(listingPayload).select().single();
    if (error || !data) throw error;

    revalidatePath('/marketplace');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit marketplace listing' };
  }
}

/**
 * GET: Reads approved, active directory rows to supply the main interface grid panels.
 */
export async function getApprovedListings(rawInput: z.infer<typeof QueryListingsSchema>): Promise<ActionResponse<ListingRow[]>> {
  try {
    const query = QueryListingsSchema.parse(rawInput);
    const supabase = await createClient();

    let dbQuery = supabase.from('marketplace_listings').select('*').eq('status', 'approved');

    if (query.listing_type) dbQuery = dbQuery.eq('listing_type', query.listing_type);
    if (query.category) dbQuery = dbQuery.eq('category', query.category);

    // Sort listings with high validation scores and better star ratings at the top
    const { data, error } = await dbQuery
      .order('ai_verification_score', { ascending: false })
      .order('avg_rating', { ascending: false })
      .range(query.offset, query.offset + query.limit - 1);

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to query marketplace listings' };
  }
}

/**
 * POST: Submits a review and updates the listing's averages.
 */
export async function submitListingReview(rawInput: z.infer<typeof SubmitReviewSchema>): Promise<ActionResponse<{ reviews_count: number; avg_rating: number }>> {
  try {
    const validated = SubmitReviewSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication token signature required to leave reviews' };

    // 1. INJECT REVIEW ENTRY
    const reviewPayload: ReviewInsert = {
      listing_id: validated.listingId,
      user_id: user.id,
      rating: validated.rating,
      comment: validated.comment,
    };

    const { error: insErr } = await supabase.from('marketplace_reviews').insert(reviewPayload);
    if (insErr) return { success: false, error: 'You have already logged a review signature for this specific resource' };

    // 2. COUNTER RECALCULATION LOOP
    const { data: allReviews } = await supabase.from('marketplace_reviews').select('rating').eq('listing_id', validated.listingId);
    
    const count = allReviews?.length || 0;
    const sum = allReviews?.reduce((acc, curr) => acc + curr.rating, 0) || 0;
    const computedAverage = count > 0 ? sum / count : 0;

    const { error: updErr } = await supabase
      .from('marketplace_listings')
      .update({
        reviews_count: count,
        avg_rating: Math.round(computedAverage * 10) / 10,
        updated_at: new Date().toISOString()
      })
      .eq('id', validated.listingId);

    if (updErr) throw updErr;

    revalidatePath('/marketplace');
    revalidatePath(`/marketplace/${validated.listingId}`);
    return { success: true, data: { reviews_count: count, avg_rating: computedAverage } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to finalize review sequence' };
  }
}

/**
 * POST: Places content moderation flag alerts against listings.
 * Triggers quarantine auto-deactivations when scores bypass limit triggers.
 */
export async function flagMarketplaceListing(rawInput: z.infer<typeof SubmitFlagSchema>): Promise<ActionResponse<{ automatedQuarantine: boolean }>> {
  try {
    const validated = SubmitFlagSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication mandatory to file flag alerts' };

    // 1. RECORD MODERATION FLAG DETAILS
    const flagPayload: FlagInsert = {
      listing_id: validated.listingId,
      user_id: user.id,
      reason: validated.reason,
      details: validated.details,
      is_resolved: false,
    };

    const { error: flagInsErr } = await supabase.from('marketplace_flags').insert(flagPayload);
    if (flagInsErr) return { success: false, error: 'You have already recorded an alert report for this listing' };

    // 2. INCREMENT COUNTER & VALIDATE QUARANTINE FLOORS
    const { data: listing } = await supabase.from('marketplace_listings').select('flags_count, status').eq('id', validated.listingId).single();
    if (!listing) return { success: false, error: 'Target listing not found' };

    const directFlagsCount = listing.flags_count + 1;
    const shouldQuarantine = directFlagsCount >= 3; // Quarantine item if reported 3 separate times

    const updatePayload: { flags_count: number; status?: 'pending_review'; updated_at: string } = {
      flags_count: directFlagsCount,
      updated_at: new Date().toISOString()
    };

    if (shouldQuarantine) updatePayload.status = 'pending_review';

    const { error: updateErr } = await supabase.from('marketplace_listings').update(updatePayload).eq('id', validated.listingId);
    if (updateErr) throw updateErr;

    revalidatePath('/marketplace');
    return { success: true, data: { automatedQuarantine: shouldQuarantine } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to file moderation report' };
  }
}

/**
 * PATCH: Admin Curation endpoint to score and audit entries.
 */
export async function auditListingAdmin(rawInput: z.infer<typeof AdminAuditSchema>): Promise<ActionResponse<{ status: string }>> {
  try {
    const validated = AdminAuditSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').single();
    
    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Access Denied: Administrative permissions required' };
    }

    const { error } = await supabase
      .from('marketplace_listings')
      .update({
        ai_verification_score: validated.ai_verification_score,
        ai_audit_notes: validated.ai_audit_notes,
        status: validated.status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', validated.listingId);

    if (error) throw error;

    revalidatePath('/marketplace');
    return { success: true, data: { status: validated.status } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to complete administrative audit configuration' };
  }
}