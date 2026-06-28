'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

// Zero-argument client instantiators matching your exact configuration
import { createClient } from '@/lib/supabase/server'; 

// Extract strict database interfaces from your schema definition contract
type OfferingRow = Database['public']['Tables']['offerings']['Row'];
type DiscountRow = Database['public']['Tables']['discounts']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

// Unified API Response Wrapper Envelope
type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD PAYLOAD RUNTIME SCHEMAS
// =========================================================================

export const ValidateDiscountSchema = z.object({
  code: z.string().min(1).trim().toUpperCase(),
  offeringId: z.string().uuid(),
  currency: z.string().min(3).max(5).trim().toUpperCase().default('INR'),
});

export const InitializeCheckoutSchema = z.object({
  offeringId: z.string().uuid(),
  currency: z.string().min(3).max(5).trim().toUpperCase().default('INR'),
  provider: z.string().min(1), // e.g., 'razorpay', 'cashfree', 'mock_gateway'
  couponCode: z.string().trim().toUpperCase().optional().nullable(),
});

export const CompleteCheckoutSchema = z.object({
  transactionId: z.string().uuid(),
});

// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * GET Equivalent: Verifies the integrity of a promotional coupon voucher.
 * Validates a coupon code against your real schema parameters.
 */
export async function verifyDiscountCode(
  rawInput: z.infer<typeof ValidateDiscountSchema>
): Promise<ActionResponse<{ valid: boolean; discount: DiscountRow; basePrice: number; finalPrice: number; deductionAmount: number }>> {
  try {
    const validated = ValidateDiscountSchema.parse(rawInput);
    const supabase = await createClient();

    // 1. Fetch the target offering record
    const { data: offering, error: offErr } = await supabase
      .from('offerings')
      .select('*')
      .eq('id', validated.offeringId)
      .eq('is_active', true)
      .single();

    if (offErr || !offering) {
      return { success: false, error: 'Target product catalog item is currently unavailable' };
    }

    // Safely typecast your dynamic prices JSONB structure
    const pricesMap = offering.prices as Record<string, number> | null;
    const basePrice = pricesMap?.[validated.currency];

    if (basePrice === undefined || basePrice === null) {
      return { success: false, error: `Pricing parameter for currency '${validated.currency}' is not configured on this item` };
    }

    // 2. Locate the coupon code row by code string globally
    const { data: discount, error: discErr } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', validated.code)
      .single();

    if (discErr || !discount) {
      return { success: false, error: 'Invalid or non-existent promotional coupon code' };
    }

    // 3. Temporal, status, and currency availability validation guards
    if (!discount.is_active) {
      return { success: false, error: 'This coupon code campaign has been disabled' };
    }

    if (discount.max_uses !== null && discount.uses_count >= discount.max_uses) {
      return { success: false, error: 'This promotional voucher code limit has been exhausted' };
    }

    if (new Date(discount.starts_at).getTime() > Date.now()) {
      return { success: false, error: 'This coupon campaign is not yet active' };
    }

    if (discount.expires_at && new Date(discount.expires_at).getTime() < Date.now()) {
      return { success: false, error: 'This promotional code has expired' };
    }

    // Enforce multi-currency scoping limits using your real applicable_currencies array field
    if (discount.applicable_currencies && !discount.applicable_currencies.includes(validated.currency)) {
      return { success: false, error: `This coupon code is not authorized for use with ${validated.currency} transactions` };
    }

    // 4. Compute Deduction Mathematics using the actual schema layout fields
    let deductionAmount = 0;

    // Fixed typo: matching 'fixed' option from your native database schema types enum setup
    if (discount.type === 'percentage') {
      deductionAmount = basePrice * (discount.value / 100);
    } else {
      deductionAmount = discount.value;
    }

    const finalPrice = Math.max(0, basePrice - deductionAmount);

    return {
      success: true,
      data: {
        valid: true,
        discount,
        basePrice,
        finalPrice: Math.round(finalPrice * 100) / 100,
        deductionAmount: Math.round(deductionAmount * 100) / 100
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'System exception verifying coupon parameters' };
  }
}

/**
 * POST Equivalent: Pre-registers a placeholder tracking row inside your transactions ledger.
 */
export async function initializeCheckoutTransaction(
  rawInput: z.infer<typeof InitializeCheckoutSchema>
): Promise<ActionResponse<{ transaction: TransactionRow; gatewayPayload: any }>> {
  try {
    const validated = InitializeCheckoutSchema.parse(rawInput);
    const supabase = await createClient();

    // Enforce session presence barriers
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication signature required to execute checkout routing loops' };
    }

    // 1. Fetch target offering parameters
    const { data: offering, error: offErr } = await supabase
      .from('offerings')
      .select('*')
      .eq('id', validated.offeringId)
      .eq('is_active', true)
      .single();

    if (offErr || !offering) {
      return { success: false, error: 'Target item catalog configuration is missing or inactive' };
    }

    const pricesMap = offering.prices as Record<string, number> | null;
    let finalPayableAmount = pricesMap?.[validated.currency];

    if (finalPayableAmount === undefined || finalPayableAmount === null) {
      return { success: false, error: `Selected product is not priced in currency: ${validated.currency}` };
    }

    let appliedDiscountId: string | null = null;

    // 2. Server Side Voucher Evaluation Checks
    if (validated.couponCode) {
      const voucherCheck = await verifyDiscountCode({
        code: validated.couponCode,
        offeringId: offering.id,
        currency: validated.currency
      });

      if (voucherCheck.success) {
        finalPayableAmount = voucherCheck.data.finalPrice;
        appliedDiscountId = voucherCheck.data.discount.id;
      } else {
        return { success: false, error: voucherCheck.error };
      }
    }

    // 3. Mock Payment Intent Trace Generation Identifier String
    const trackingGatewayOrderId = `order_track_${Math.random().toString(36).substring(2, 15)}`;

    // 4. Save tracking transaction record map row
    const newTransactionRecord: TransactionInsert = {
      user_id: user.id,
      offering_id: offering.id,
      discount_id: appliedDiscountId,
      amount_paid: finalPayableAmount,
      currency: validated.currency,
      provider: validated.provider,
      provider_order_id: trackingGatewayOrderId,
      provider_payment_id: null,
      status: 'pending',
      raw_webhook_payload: {},
      updated_at: new Date().toISOString()
    };

    const { data: transaction, error: txErr } = await supabase
      .from('transactions')
      .insert(newTransactionRecord)
      .select()
      .single();

    if (txErr || !transaction) throw txErr;

    return {
      success: true,
      data: {
        transaction,
        gatewayPayload: {
          gatewayOrderId: trackingGatewayOrderId,
          amountToCharge: finalPayableAmount,
          currency: validated.currency
        }
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to initialize payment trace tokens' };
  }
}

/**
 * POST Equivalent: Fulfills a transaction, updates permission roles safely, 
 * provisions database side entitlements, and routes users to the dashboard.
 */
export async function completeCheckout(
  rawInput: z.infer<typeof CompleteCheckoutSchema>
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    // ⚡ FIX 1: Parse input to safely expose the validated schema parameters
    const validated = CompleteCheckoutSchema.parse(rawInput);
    const supabase = await createClient();

    // 1. Resolve Auth User Session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Authentication signature missing.' };

    // 2. Fetch the target pending transaction record using parsed params
    const { data: transaction, error: txErr } = await supabase
      .from('transactions')
      .select('*, offerings(*)')
      .eq('id', validated.transactionId)
      .eq('user_id', user.id)
      .single();

    if (txErr || !transaction) {
      return { success: false, error: 'Target checkout tracking session was not found.' };
    }

    // Idempotency: If already completed, just skip gracefully
    if (transaction.status === 'completed') {
      redirect('/program');
    }

    // 3. Mark the transaction record itself as completed first
    await supabase
      .from('transactions')
      .update({
        status: 'completed',
        provider_payment_id: `pay_${crypto.randomUUID().substring(0, 12)}`,
        raw_webhook_payload: { handshakedAt: new Date().toISOString() },
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    // 4. Provision Product Entitlements
    const offeringData = transaction.offerings as any;
    
    if (offeringData?.type === 'program' || offeringData?.slug === 'full-access-membership') {
      
      // STEP A: Insert into network_memberships FIRST.
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      const { error: networkMembershipErr } = await supabase
        .from('network_memberships')
        .insert({
          user_id: user.id,
          status: 'active',
          expires_at: expirationDate.toISOString()
        });

      if (networkMembershipErr) {
        throw new Error(`Failed to provision network membership access: ${networkMembershipErr.message}`);
      }

      // STEP B: Fetch and cleanly append roles ONLY after subscription succeeds.
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', user.id)
        .single();

      const currentRoles = currentProfile?.roles || ['base'];
      
      // ⚡ FIX 2: Cast the compiled unique values array explicitly back to your schema type contract
      const updatedRoles = Array.from(
        new Set([...currentRoles, 'enrolled', 'member'])
      ) as Database["public"]["Enums"]["user_platform_role"][];

      const { error: profileUpdateErr } = await supabase
        .from('profiles')
        .update({ 
          roles: updatedRoles,
          onboarding_step: 2
        })
        .eq('id', user.id);

      if (profileUpdateErr) {
        throw new Error(`Critical: Membership created but profile sync failed: ${profileUpdateErr.message}`);
      }
    }

    revalidatePath('/', 'layout');
  } catch (err: any) {
    return { success: false, error: err.message || 'Error occurred finalizing checkout.' };
  }

  // 5. Finalize by routing directly to the program dashboard
  redirect('/program');
}