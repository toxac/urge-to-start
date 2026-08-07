// app/(onboarding)/payment/page.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, Loader2, Ticket, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { initializeCheckoutTransaction, completeCheckout, verifyDiscountCode } from '@/actions/payments';

interface OfferingData {
  id: string;
  title: string;
  prices: any;
}

interface AppliedDiscount {
  code: string;
  id: string;
  deductionAmount: number;
  finalPrice: number;
}

export default function PaywallPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Data State
  const [programOffering, setProgramOffering] = useState<OfferingData | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  // Discount UI States
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient();
        // ⚡ UPDATED: Fetch 'program-membership' instead of 'program-enrollment'
        const { data, error } = await supabase
          .from('offerings')
          .select('id, title, prices')
          .eq('slug', 'program-membership')
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          console.error("Product setup missing.");
          return;
        }
        setProgramOffering(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPage(false);
      }
    }
    fetchProduct();
  }, []);

  // Handle Promo Code Verification Check
  const handleApplyPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim() || !programOffering) return;

    setIsVerifyingCode(true);
    setPromoError(null);

    try {
      const response = await verifyDiscountCode({
        code: promoCodeInput.trim(),
        offeringId: programOffering.id,
        currency: 'INR'
      });

      if (response.success) {
        setAppliedDiscount({
          code: promoCodeInput.trim().toUpperCase(),
          id: response.data.discount.id,
          deductionAmount: response.data.deductionAmount,
          finalPrice: response.data.finalPrice
        });
        setPromoCodeInput('');
      } else {
        setPromoError(response.error);
      }
    } catch (err) {
      setPromoError("Could not verify code. Please try again.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setPromoError(null);
  };

  const handlePaymentSubmit = () => {
    if (!programOffering) return;

    startTransition(async () => {
      try {
        const initResult = await initializeCheckoutTransaction({
          offeringId: programOffering.id,
          currency: 'INR',
          provider: appliedDiscount?.finalPrice === 0 ? 'internal_free_tier' : 'mock_stripe_sandbox',
          couponCode: appliedDiscount ? appliedDiscount.code : null
        });

        if (!initResult.success) {
          alert(initResult.error);
          return;
        }

        const completeResult = await completeCheckout({
          transactionId: initResult.data.transaction.id
        });

        if (!completeResult.success) {
          alert(completeResult.error);
          return;
        }

        router.push('/program');
        router.refresh();

      } catch (err) {
        console.error("Payment routing pipeline failed: ", err);
      }
    });
  };

  if (loadingPage) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 animate-pulse h-64">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">Opening Checkout Portal...</span>
      </div>
    );
  }

  if (!programOffering) {
    return (
      <div className="text-center p-6 text-sm text-muted-foreground font-medium">
        ⚠️ Offering catalog item not found. Please verify database offerings table.
      </div>
    );
  }

  const basePriceINR = (programOffering.prices as any)?.INR || 8000;
  const standardDisplayPrice = appliedDiscount ? appliedDiscount.finalPrice : basePriceINR;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Ready to jump in?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
          Once you complete your payment, you&rsquo;ll get instant access to the Urge Start dashboard so you can start working on your first quest right away.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">

        {/* Pricing Summary */}
        <div className="p-5 border border-border bg-muted/40 rounded-xl flex items-center justify-between text-xs relative overflow-hidden">
          <div className="space-y-0.5 text-left">
            <span className="font-bold text-foreground block">Urge Program Membership</span>
            <p className="text-[11px] text-muted-foreground font-medium">Full access to all sprints & community</p>
          </div>
          <div className="text-right shrink-0">
            {appliedDiscount ? (
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground line-through font-medium">₹{basePriceINR}</span>
                <span className="text-2xl font-serif font-black text-primary">
                  {standardDisplayPrice === 0 ? 'Free' : `₹${standardDisplayPrice}`}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-2xl font-serif font-black text-primary">₹{basePriceINR}</span>
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">One-time</span>
              </div>
            )}
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="space-y-2 border-t border-b border-border/40 py-4 text-xs">
          {!appliedDiscount ? (
            <div className="space-y-1.5">
              <label htmlFor="promoCode" className="text-muted-foreground font-semibold text-[11px] ml-1">
                Have a promo code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                  <Input
                    id="promoCode"
                    type="text"
                    placeholder="e.g., EARLYBUILDER"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="h-9 text-xs uppercase font-medium bg-background border-input rounded-xl pl-9"
                    disabled={isVerifyingCode}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleApplyPromoCode}
                  disabled={isVerifyingCode || !promoCodeInput.trim()}
                  className="h-9 px-4 rounded-xl text-xs font-semibold shrink-0 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  {isVerifyingCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl animate-in fade-in duration-150">
              <div className="flex items-center gap-2 font-medium text-[11px]">
                <Ticket className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                <span>Code <strong>{appliedDiscount.code}</strong> applied</span>
                <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  -₹{appliedDiscount.deductionAmount} OFF
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="p-1 hover:bg-emerald-500/10 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {promoError && (
            <p className="text-[11px] text-destructive font-medium mt-1 ml-1 animate-in fade-in duration-150">
              ⚠️ {promoError}
            </p>
          )}
        </div>

        {/* Feature List */}
        <div className="text-left space-y-3 pt-1">
          {[
            "Full access to all program sprints and milestones",
            "Dedicated builder community & feedback channels",
            "Action-oriented tasks to help you validate and ship"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium leading-normal">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="pt-2 border-t border-border/40">
          <Button
            type="button"
            onClick={handlePaymentSubmit}
            disabled={isPending}
            className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-md shadow-primary/10 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing payment...</span>
              </>
            ) : (
              <span>
                {standardDisplayPrice === 0 ? 'Claim Access & Start Journey' : 'Pay Now & Start Your Journey'}
              </span>
            )}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center mt-3 font-normal leading-normal px-2">
            Payments are safe, encrypted, and processed instantly.
          </p>
        </div>
      </div>
    </div>
  );
}