'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initializeCheckoutTransaction, completeCheckout } from '@/actions/payments';

interface OfferingData {
  id: string;
  title: string;
  prices: any;
}

export default function PaywallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [programOffering, setProgramOffering] = useState<OfferingData | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  // 1. Fetch the offering parameters on mount safely from the client side
  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('offerings')
          .select('id, title, prices')
          .eq('slug', 'program-enrollment')
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          // If the database row isn't there, fall back gracefully
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

  // 2. EXPECTED BEHAVIOR HANDLER
  const handlePaymentSubmit = () => {
    if (!programOffering) return;

    // useTransition captures the async lifecycle and gives us an active loading state instantly
    startTransition(async () => {
      try {
        // Step A: Create the tracking transaction entry row
        const initResult = await initializeCheckoutTransaction({
          offeringId: programOffering.id,
          currency: 'INR',
          provider: 'mock_stripe_sandbox',
          couponCode: null
        });

        if (!initResult.success) {
          alert(initResult.error);
          return;
        }

        // Step B: Fulfill the transaction rules, memberships, and user roles
        const completeResult = await completeCheckout({
          transactionId: initResult.data.transaction.id
        });

        if (!completeResult.success) {
          alert(completeResult.error);
          return;
        }

        // Expected Behavior: Push the user smoothly into their newly initialized workspace dashboard
        router.push('/program');
        router.refresh();
        
      } catch (err) {
        console.error("Payment routing loop break context: ", err);
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
        ⚠️ Offering catalog item not found. Please verify your Supabase database row seeds.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Friendly, Simple Headers */}
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Ready to jump in?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
          Once you complete your payment, you&rsquo;ll get instant access to the Urge Start dashboard so you can start working on your first quest right away.
        </p>
      </div>

      {/* Main Payment Card */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
        
        {/* Simple Pricing Layout */}
        <div className="p-5 border border-border bg-muted/40 rounded-xl flex items-center justify-between text-xs">
          <div className="space-y-0.5 text-left">
            <span className="font-bold text-foreground block">Urge Start Enrollment</span>
            <p className="text-[11px] text-muted-foreground font-medium">Includes 1 year of community membership</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-serif font-black text-primary">₹8,000</span>
            <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">One-time payment</span>
          </div>
        </div>

        {/* Clear, straightforward bullet points */}
        <div className="text-left space-y-3 pt-1">
          {[
            "Full access to all program sprints and milestones",
            "A dedicated place to share your work and get feedback from other builders",
            "1 year of our annual network membership included for free (usually ₹4,000/yr)",
            "No boring video lectures—just action-oriented tasks to help you ship"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium leading-normal">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Unified Button & Feedback Container */}
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
                <span>Initializing secure payment...</span>
              </>
            ) : (
              <span>Pay Now & Start Your Journey</span>
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