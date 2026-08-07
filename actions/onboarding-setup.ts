// actions/onboarding-setup.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Database, Constants } from '@/types/supabase';

type EducationLevel = Database['public']['Enums']['education_level'];
type AgeGroup = Database['public']['Enums']['user_age_group'];

export async function submitProfileSetup(formData: FormData) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // 1. Authenticate user session
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    throw new Error('Unauthorized identity validation session.');
  }

  // 2. Parse form inputs
  const fullName = formData.get('fullName') as string;
  const ageGroup = formData.get('ageGroup') as AgeGroup;
  const highestEducation = formData.get('highestEducation') as EducationLevel;
  const city = formData.get('city') as string;
  const country = formData.get('country') as string;
  const currency = (formData.get('currency') as string) || 'INR';

  // Read intent flag from cookie ('free' vs 'member')
  const savedIntent = cookieStore.get('urge_signup_intent')?.value || 'free';

  // 3. Update Profile row with onboarding coordinates
  const updatePayload: Database['public']['Tables']['profiles']['Update'] = {
    fullname: fullName,
    age_group: ageGroup,
    highest_education_level: highestEducation,
    city,
    country,
    currency,
    updated_at: new Date().toISOString(),
  };

  const { error: profileErr } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id);

  if (profileErr) {
    throw new Error(`Profile setup failed: ${profileErr.message}`);
  }

  // Clear intent token cookie
  cookieStore.delete('urge_signup_intent');

  // 4. ROUTING BRANCH: Trial vs. Paid Checkout
  if (savedIntent === 'free') {
    // Fetch Free Trial Offering
    const { data: trialOffering } = await supabase
      .from('offerings')
      .select('id')
      .eq('slug', 'mission-1-trial')
      .single();

    if (trialOffering) {
      // Record ₹0 transaction for trial
      await supabase.from('transactions').insert({
        user_id: user.id,
        offering_id: trialOffering.id,
        amount_paid: 0,
        currency,
        provider: 'internal_free_trial',
        provider_order_id: `trial_${crypto.randomUUID().substring(0, 12)}`,
        status: Constants.public.Enums.transaction_status[1], // 'completed'
        raw_webhook_payload: { convertedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      });
    }

    // Set role to 'trial' and complete onboarding step
    await supabase
      .from('profiles')
      .update({
        roles: ['trial' as any],
        onboarding_step: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    redirect('/program');
  } else {
    // Paid Member route: set step to checkout and route to /payment
    await supabase
      .from('profiles')
      .update({
        onboarding_step: 'checkout',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    redirect('/payment');
  }
}