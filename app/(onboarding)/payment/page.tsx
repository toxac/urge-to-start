import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default async function PaywallPage() {
  const supabase = await createClient();

  // 1. Fetch our standardized offering row entry from our database configuration
  const { data: standardOffering } = await supabase
    .from('offerings')
    .select('*')
    .eq('slug', 'full-access-membership')
    .eq('is_active', true)
    .maybeSingle();

  // 2. SERVER ACTION HANDLE: Multi-tier payment generation simulation loop
  async function executeMockCheckoutHandshake() {
    'use server';
    const serverSupabase = await createClient();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return;

    // Resolve or fallback standard target configurations
    const targetOfferingId = standardOffering?.id || '00000000-0000-0000-0000-000000000000';
    const finalAmountPaid = 49.00;

    // A: Record the itemized transaction entry into your permanent ledger table rows
    await serverSupabase.from('transactions').insert({
      user_id: user.id,
      offering_id: targetOfferingId,
      amount_paid: finalAmountPaid,
      currency: 'USD',
      provider: 'mock_stripe_sandbox',
      provider_order_id: `m_ord_${crypto.randomUUID().substring(0, 8)}`,
      provider_payment_id: `m_pay_${crypto.randomUUID().substring(0, 12)}`,
      status: 'completed', // Hardens status row entry cleanly
      raw_webhook_payload: { completedSimulatedAt: new Date().toISOString() }
    });

    // B: Elevate user profile status directly inside database fields
    await serverSupabase
      .from('profiles')
      .update({ 
        role: 'member_full',
        onboarding_step: 2
      })
      .eq('id', user.id);

    redirect('/program');
  }

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased flex items-center justify-center p-6 selection:bg-[#E86A33]/20">
      
      {/* Transaction Control Blueprint Card */}
      <div className="w-full max-w-md bg-[#F9F7F4] border border-[#8C8580]/15 rounded-2xl p-8 shadow-[0_4px_24px_rgba(140,133,128,0.03)] text-center space-y-8">
        
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E86A33]">
            Step 02 / Financial Commitment
          </span>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            Lock In Your Access
          </h1>
          <p className="text-xs text-[#8C8580] leading-relaxed max-w-xs mx-auto font-medium">
            Gain full entry to our validated problem maps, strategic milestone quests, and the global peer developer network.
          </p>
        </div>

        {/* Pricing Layout Container Block */}
        <div className="p-5 border border-[#8C8580]/10 bg-[#8C8580]/5 rounded-xl text-left flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#1A1A1A]">Ecosystem Membership</span>
            <p className="text-[11px] text-[#8C8580] font-medium">Cancel tracking loops at any moment.</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-serif font-bold text-[#E86A33]">$49</span>
            <span className="text-[10px] text-[#8C8580] block font-bold uppercase tracking-wider">/ Month</span>
          </div>
        </div>

        {/* Bullet Manifestos Checklist */}
        <div className="text-left space-y-3 pt-2">
          {[
            "Unrestricted access to all Quest Control Center pipelines",
            "Comprehensive diagnostic checks from the Kip Sidebar Companion",
            "Direct publishing clearance to the Rejection Club Feed boards"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#8C8580] font-medium leading-tight">
              <CheckCircle2 className="w-4 h-4 text-[#E86A33] shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* THE MOAT: Enforce strict safety boundary surrounding the activation handler */}
        <div className="pt-4">
          <form action={executeMockCheckoutHandshake} className="w-full">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#E86A33] hover:bg-[#D35925] text-white font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-[#E86A33]/10 transform active:scale-95"
            >
              Initialize Sandbox Checkout Handshake
            </Button>
          </form>
          <span className="text-[10px] text-[#8C8580] font-medium block mt-3">
            🔒 Secure Transaction Environment // 100% Refundable Guarantee
          </span>
        </div>

      </div>
    </div>
  );
}