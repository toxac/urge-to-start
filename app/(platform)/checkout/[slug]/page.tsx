'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
// ⚡ IMPORT FIX: Pull the actual initialization and completion actions
import { initializeCheckoutTransaction, completeMockCheckoutHandshake } from '@/actions/payments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Tag, ShoppingBag } from 'lucide-react';

export default function StandaloneCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // Since your dynamic actions file expects an offeringId (UUID), we map standard store slugs to their UUIDs.
  // In a full production loop, you could fetch this offering details row directly via useEffect.
  const sampleOfferingIdMap: Record<string, string> = {
    'full-access-membership': '00000000-0000-0000-0000-000000000000', // Swap with your actual offering row UUID
  };

  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const inboundCoupon = searchParams.get('coupon') || searchParams.get('promo');
    if (inboundCoupon) setPromoCode(inboundCoupon.toUpperCase());
  }, [searchParams]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const targetOfferingId = sampleOfferingIdMap[slug] || slug; // Fallback directly to string if UUID is passed

    try {
      // Step 1: Pre-register the placeholder pending row in your ledger
      const initResult = await initializeCheckoutTransaction({
        offeringId: targetOfferingId,
        currency: 'INR', // Matches your default validation schema fallback
        provider: 'mock_gateway',
        couponCode: promoCode.trim() || null
      });

      if (!initResult.success) {
        setError(initResult.error);
        setLoading(false);
        return;
      }

      // Step 2: Fire the success handshake sequence to elevate privileges, provision the bundle, and redirect
      const completeResult = await completeMockCheckoutHandshake({
        transactionId: initResult.data.transaction.id
      });

      if (!completeResult.success) {
        setError(completeResult.error);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "Checkout execution error encountered.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#F9F7F4] border border-[#8C8580]/15 rounded-2xl p-8 shadow-[0_4px_24px_rgba(140,133,128,0.03)] space-y-6">
        
        <div className="space-y-1 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-[#E86A33]/5 flex items-center justify-center text-[#E86A33] mb-2">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight">Complete Your Order</h1>
          <p className="text-xs text-[#8C8580] font-medium px-4">
            Review your selection below to process your secure payment checkout.
          </p>
        </div>

        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-red-500/5 border border-red-500/25 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider block">
              Have a Promo Code?
            </label>
            <div className="relative flex items-center">
              <Tag className="w-3.5 h-3.5 text-[#8C8580] absolute left-3 pointer-events-none" />
              <Input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={loading}
                placeholder="ENTER CODE"
                className="w-full h-10 bg-background border border-[#8C8580]/20 rounded-xl pl-9 pr-3 tracking-wider text-xs font-bold text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#E86A33] hover:bg-[#D35925] text-white font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-[#E86A33]/10 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? 'Processing Transaction...' : 'Confirm Order Checkout'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}