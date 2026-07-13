'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';
import { Constants } from '@/types/supabase'; // ⚡ Your real runtime enums object
import { createClient } from '@/lib/supabase/server'; 
import { 
  ValidateDiscountSchema, 
  InitializeCheckoutSchema, 
  CompleteCheckoutSchema 
} from '@/types/payments';

// Extract strict database interfaces from your schema definition contract
type DiscountRow = Database['public']['Tables']['discounts']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// 1. VERIFY DISCOUNT CODE ACTION
// =========================================================================
export async function verifyDiscountCode(
  rawInput: z.infer<typeof ValidateDiscountSchema>
): Promise<ActionResponse<{ valid: boolean; discount: DiscountRow; basePrice: number; finalPrice: number; deductionAmount: number }>> {
  try {
    const validated = ValidateDiscountSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: offering, error: offErr } = await supabase
      .from('offerings')
      .select('*')
      .eq('id', validated.offeringId)
      .eq('is_active', true)
      .single();

    if (offErr || !offering) {
      return { success: false, error: 'Target product catalog item is currently unavailable' };
    }

    const pricesMap = offering.prices as Record<string, number> | null;
    const basePrice = pricesMap?.[validated.currency];

    if (basePrice === undefined || basePrice === null) {
      return { success: false, error: `Pricing parameter for currency '${validated.currency}' is not configured on this item` };
    }

    const { data: discount, error: discErr } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', validated.code)
      .single();

    if (discErr || !discount) {
      return { success: false, error: 'Invalid or non-existent promotional coupon code' };
    }

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

    if (discount.applicable_currencies && !discount.applicable_currencies.includes(validated.currency)) {
      return { success: false, error: `This coupon code is not authorized for use with ${validated.currency} transactions` };
    }

    let deductionAmount = 0;
    if (discount.type === Constants.public.Enums.discount_type[0]) { // 'percentage'
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

// =========================================================================
// 2. INITIALIZE CHECKOUT TRANSACTION ACTION
// =========================================================================
export async function initializeCheckoutTransaction(
  rawInput: z.infer<typeof InitializeCheckoutSchema>
): Promise<ActionResponse<{ transaction: TransactionRow; gatewayPayload: any }>> {
  try {
    const validated = InitializeCheckoutSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication signature required to execute checkout routing loops' };
    }

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

    const trackingGatewayOrderId = `order_track_${Math.random().toString(36).substring(2, 15)}`;

    const newTransactionRecord: TransactionInsert = {
      user_id: user.id,
      offering_id: offering.id,
      discount_id: appliedDiscountId,
      amount_paid: finalPayableAmount,
      currency: validated.currency,
      provider: validated.provider,
      provider_order_id: trackingGatewayOrderId,
      provider_payment_id: null,
      status: Constants.public.Enums.transaction_status[0], // 'pending'
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

// =========================================================================
// 3. COMPLETE CHECKOUT ACTION
// =========================================================================
export async function completeCheckout(
  rawInput: z.infer<typeof CompleteCheckoutSchema>
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const validated = CompleteCheckoutSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Authentication signature missing.' };

    const { data: transaction, error: txErr } = await supabase
      .from('transactions')
      .select('*, offerings(*)')
      .eq('id', validated.transactionId)
      .eq('user_id', user.id)
      .single();

    if (txErr || !transaction) {
      return { success: false, error: 'Target checkout tracking session was not found.' };
    }

    if (transaction.status === Constants.public.Enums.transaction_status[1]) { // 'completed'
      redirect('/program');
    }

    await supabase
      .from('transactions')
      .update({
        status: Constants.public.Enums.transaction_status[1], // 'completed'
        provider_payment_id: `pay_${crypto.randomUUID().substring(0, 12)}`,
        raw_webhook_payload: { handshakedAt: new Date().toISOString() },
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    const offeringData = transaction.offerings as any;
    
    if (
      offeringData?.type === Constants.public.Enums.offering_type[0] || // 'program'
      offeringData?.slug === 'program-enrollment'
    ) {
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
        throw new Error(`Failed to provision bundled membership: ${networkMembershipErr.message}`);
      }

      const { data: annualMembershipOffering } = await supabase
        .from('offerings')
        .select('id')
        .eq('slug', 'annual-membership')
        .maybeSingle();

      if (annualMembershipOffering) {
        const { data: bundledDiscount } = await supabase
          .from('discounts')
          .select('id')
          .eq('code', 'PROGRAM_BUNDLED_MEMBERSHIP')
          .maybeSingle();

        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            offering_id: annualMembershipOffering.id,
            discount_id: bundledDiscount?.id || null,
            amount_paid: 0.00,
            currency: transaction.currency,
            provider: 'internal_bundle',
            provider_order_id: `bundle_${transaction.provider_order_id}`,
            status: Constants.public.Enums.transaction_status[1], // 'completed'
            updated_at: new Date().toISOString()
          });
      }

      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', user.id)
        .single();

      const currentRoles = currentProfile?.roles || ['base'];
      
      const targetRolesToGrant = [
        Constants.public.Enums.user_platform_role[1], // 'enrolled'
        Constants.public.Enums.user_platform_role[2]  // 'member'
      ];

      const updatedRoles = Array.from(
        new Set([...currentRoles, ...targetRolesToGrant])
      ) as Database["public"]["Enums"]["user_platform_role"][];

      const { error: profileUpdateErr } = await supabase
        .from('profiles')
        .update({ 
          roles: updatedRoles,
          onboarding_step: 2
        })
        .eq('id', user.id);

      if (profileUpdateErr) {
        throw new Error(`Profile role sync broke: ${profileUpdateErr.message}`);
      }
    }

    revalidatePath('/', 'layout');
  } catch (err: any) {
    return { success: false, error: err.message || 'Error occurred finalizing checkout.' };
  }

  redirect('/program');
}