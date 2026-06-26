import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { initializeCheckoutTransaction, completeMockCheckoutHandshake } from '@/actions/payments';
import { CheckCircle2 } from 'lucide-react';

export default async function PaywallPage() {
  const supabase = await createClient();

  // 1. Fetch your dynamic core program membership item from your offerings table
  const { data: standardOffering } = await supabase
    .from('offerings')
    .select('*')
    .eq('slug', 'full-access-membership')
    .eq('is_active', true)
    .maybeSingle();

  // Guard track if data configuration row is entirely missing
  if (!standardOffering) notFound();

  // 2. SERVER ACTION HANDLE: Run the real transactional sequence using our schemas
  async function executeOnboardingPaymentPipeline() {
    'use server';
    
    try {
      // Step A: Pre-register the placeholder tracking ledger entry row
      const initResult = await initializeCheckoutTransaction({
        offeringId: standardOffering!.id,
        currency: 'USD',
        provider: 'mock_stripe_sandbox',
        couponCode: null
      });

      if (!initResult.success) {
        throw new Error(initResult.error);
      }

      // Step B: Fulfill the transaction, change profile role flags, provision community bundle, and auto-redirect
      const completeResult = await completeMockCheckoutHandshake({
        transactionId: initResult.data.transaction.id
      });

      if (!completeResult.success) {
        throw new Error(completeResult.error);
      }
    } catch (err) {
      console.error("Onboarding flow validation error: ", err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased flex items-center justify-center p-6 selection:bg-[#E86A33]/20">
      
      {/* Transaction Control Container Card */}
      <div className="w-full max-w-md bg-[#F9F7F4] border border-[#8C8580]/15 rounded-2xl p-8 shadow-[0_4px_24px_rgba(140,133,128,0.03)] text-center space-y-8 animate-in fade-in duration-200">
        
        {/* Simple, Conversational Header Frame */}
        <div className="space-y-1.5">
          <h1 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            Unlock your full workspace access.
          </h1>
          <p className="text-xs text-[#8C8580] leading-relaxed max-w-xs mx-auto font-medium">
            Putting real skin in the game commits you to the work. Gain unrestricted entry to your program task stacks, the peer review boards, and direct advisor networks.
          </p>
        </div>

        {/* Pricing Layout Block */}
        <div className="p-5 border border-[#8C8580]/10 bg-[#8C8580]/5 rounded-xl text-left flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#1A1A1A]">{standardOffering.title}</span>
            <p className="text-[11px] text-[#8C8580] font-medium">Cancel your access pass at any time.</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-serif font-bold text-[#E86A33]">$49</span>
            <span className="text-[10px] text-[#8C8580] block font-bold uppercase tracking-wider">/ single month</span>
          </div>
        </div>

        {/* Transparent Values Checklist */}
        <div className="text-left space-y-3 pt-2">
          {[
            "Unrestricted entry to all upcoming mission checkpoints",
            "Full access to the peer collaboration feeds and community channels",
            "Bonus: First year of community network membership completely free",
            "Direct, no-fluff sanity checks from builders who have shipped before"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#8C8580] font-medium leading-tight">
              <CheckCircle2 className="w-4 h-4 text-[#E86A33] shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* THE MOAT: Isolation padding rules for your final action execution hook */}
        <div className="pt-4">
          <form action={executeOnboardingPaymentPipeline} className="w-full">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#E86A33] hover:bg-[#D35925] text-white font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-[#E86A33]/10 transform active:scale-95 duration-150"
            >
              Complete Onboarding & Start Building
            </Button>
          </form>
          <span className="text-[10px] text-[#8C8580] font-medium block mt-3">
            🔒 Safe & secure test checkout environment.
          </span>
        </div>

      </div>
    </div>
  );
}