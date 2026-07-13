'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { 
  SubmitListingSchema, 
  QueryListingsSchema, 
  SubmitReviewSchema, 
  SubmitFlagSchema, 
  AdminAuditSchema 
} from '@/types/marketplace';

type ListingRow = Database['public']['Tables']['marketplace_listings']['Row'];
type ListingInsert = Database['public']['Tables']['marketplace_listings']['Insert'];
type ReviewInsert = Database['public']['Tables']['marketplace_reviews']['Insert'];
type FlagInsert = Database['public']['Tables']['marketplace_flags']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

/**
 * Helper to safely check if a user has a specific role in their roles array
 */
async function getUserRoles(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('roles')
    .eq('id', userId)
    .single();
  
  return (profile?.roles as string[]) || [];
}

/**
 * Helper to check if a user has admin privileges
 */
async function isUserAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  const adminRoles = ['superadmin', 'admin_marketing', 'admin_accounts'];
  return roles.some(role => adminRoles.includes(role));
}

// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * POST: Instantiates a fresh marketplace listing.
 * Enforces cross-role policy checks based on selected listing types.
 */
export async function submitMarketplaceListing(
  rawInput: z.infer<typeof SubmitListingSchema>
): Promise<ActionResponse<ListingRow>> {
  try {
    const validated = SubmitListingSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required to post listings' };
    }

    // 1. ROLE COMPATIBILITY SECURITY CHECK - using roles array
    const userRoles = await getUserRoles(user.id);
    const isProvider = userRoles.includes('provider');
    const isAdmin = userRoles.includes('superadmin') || 
                    userRoles.includes('admin_marketing') || 
                    userRoles.includes('admin_accounts');
    const isSuspended = userRoles.includes('suspended');

    if (validated.listing_type === 'provider_perk' && !isProvider && !isAdmin) {
      return { 
        success: false, 
        error: 'Unauthorized: Only certified providers or admins can publish ecosystem perk vouchers' 
      };
    }
    
    if (validated.listing_type === 'peer_service' && isSuspended) {
      return { 
        success: false, 
        error: 'Your account status tier does not carry listing creation privileges' 
      };
    }

    // 2. CONSTRUCT UNIQUE IDENTIFIER SLUG
    const cleanSlug = `${validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;

    const listingPayload: ListingInsert = {
      ...validated,
      creator_id: user.id,
      slug: cleanSlug,
      status: 'pending_review',
      ai_verification_score: 0,
      avg_rating: 0,
      reviews_count: 0,
      flags_count: 0,
    };

    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert(listingPayload)
      .select()
      .single();
      
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
export async function getApprovedListings(
  rawInput: z.infer<typeof QueryListingsSchema>
): Promise<ActionResponse<ListingRow[]>> {
  try {
    const query = QueryListingsSchema.parse(rawInput);
    const supabase = await createClient();

    let dbQuery = supabase
      .from('marketplace_listings')
      .select('*')
      .eq('status', 'approved');

    if (query.listing_type) {
      dbQuery = dbQuery.eq('listing_type', query.listing_type);
    }
    if (query.category) {
      dbQuery = dbQuery.eq('category', query.category);
    }

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
export async function submitListingReview(
  rawInput: z.infer<typeof SubmitReviewSchema>
): Promise<ActionResponse<{ reviews_count: number; avg_rating: number }>> {
  try {
    const validated = SubmitReviewSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication token signature required to leave reviews' };
    }

    // 1. INJECT REVIEW ENTRY
    const reviewPayload: ReviewInsert = {
      listing_id: validated.listingId,
      user_id: user.id,
      rating: validated.rating,
      comment: validated.comment,
    };

    const { error: insErr } = await supabase
      .from('marketplace_reviews')
      .insert(reviewPayload);
      
    if (insErr) {
      return { success: false, error: 'You have already logged a review signature for this specific resource' };
    }

    // 2. COUNTER RECALCULATION LOOP
    const { data: allReviews } = await supabase
      .from('marketplace_reviews')
      .select('rating')
      .eq('listing_id', validated.listingId);
    
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
export async function flagMarketplaceListing(
  rawInput: z.infer<typeof SubmitFlagSchema>
): Promise<ActionResponse<{ automatedQuarantine: boolean }>> {
  try {
    const validated = SubmitFlagSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication mandatory to file flag alerts' };
    }

    // 1. RECORD MODERATION FLAG DETAILS
    const flagPayload: FlagInsert = {
      listing_id: validated.listingId,
      user_id: user.id,
      reason: validated.reason,
      details: validated.details || null,
      is_resolved: false,
    };

    const { error: flagInsErr } = await supabase
      .from('marketplace_flags')
      .insert(flagPayload);
      
    if (flagInsErr) {
      return { success: false, error: 'You have already recorded an alert report for this listing' };
    }

    // 2. INCREMENT COUNTER & VALIDATE QUARANTINE FLOORS
    const { data: listing } = await supabase
      .from('marketplace_listings')
      .select('flags_count, status')
      .eq('id', validated.listingId)
      .single();
      
    if (!listing) {
      return { success: false, error: 'Target listing not found' };
    }

    const directFlagsCount = listing.flags_count + 1;
    const shouldQuarantine = directFlagsCount >= 3;

    const updatePayload: { flags_count: number; status?: 'pending_review'; updated_at: string } = {
      flags_count: directFlagsCount,
      updated_at: new Date().toISOString()
    };

    if (shouldQuarantine) {
      updatePayload.status = 'pending_review';
    }

    const { error: updateErr } = await supabase
      .from('marketplace_listings')
      .update(updatePayload)
      .eq('id', validated.listingId);
      
    if (updateErr) throw updateErr;

    revalidatePath('/marketplace');
    return { success: true, data: { automatedQuarantine: shouldQuarantine } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to file moderation report' };
  }
}

/**
 * PATCH: Admin Curation endpoint to score and audit entries.
 * ✅ FIXED: Uses roles array instead of 'role' column
 */
export async function auditListingAdmin(
  rawInput: z.infer<typeof AdminAuditSchema>
): Promise<ActionResponse<{ status: string }>> {
  try {
    const validated = AdminAuditSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // ✅ FIXED: Use roles array instead of 'role' column
    const userRoles = await getUserRoles(user.id);
    const isAdmin = userRoles.includes('superadmin') || 
                    userRoles.includes('admin_marketing') || 
                    userRoles.includes('admin_accounts');

    if (!isAdmin) {
      return { success: false, error: 'Access Denied: Administrative permissions required' };
    }

    const { error } = await supabase
      .from('marketplace_listings')
      .update({
        ai_verification_score: validated.ai_verification_score,
        ai_audit_notes: validated.ai_audit_notes,
        status: validated.status,
        reviewed_by: user.id,
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