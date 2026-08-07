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
  if (authErr || !user) throw new Error('Unauthorized session.');

  // 2. Extract form payload
  const fullName = formData.get('fullName') as string;
  const avatarUrl = formData.get('avatarUrl') as string;
  const ageGroup = formData.get('ageGroup') as AgeGroup;
  const highestEducation = formData.get('highestEducation') as EducationLevel;
  const city = formData.get('city') as string;
  const country = (formData.get('country') as string || 'IN').toLowerCase();
  const currency = formData.get('currency') as string || 'INR';

  // Read intent from cookie set on landing page or auth page
  const savedIntent = cookieStore.get('urge_signup_intent')?.value || 'free';

  // 3. Update Profile record with clean schema fields
  const updatePayload: Database['public']['Tables']['profiles']['Update'] = {
    fullname: fullName,
    avatar_url: avatarUrl || null,
    age_group: ageGroup,
    highest_education_level: highestEducation,
    city,
    country: country.toUpperCase(),
    currency,
    updated_at: new Date().toISOString(),
  };

  const { error: profileErr } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id);

  if (profileErr) throw new Error(`Setup failed: ${profileErr.message}`);

  // Clear intent cookie
  cookieStore.delete('urge_signup_intent');

  // 4. Handle intent branching
  if (savedIntent === 'free') {
    // Record ₹0 trial transaction for tracking
    const { data: trialOffering } = await supabase
      .from('offerings')
      .select('id')
      .eq('slug', 'mission-1-trial')
      .maybeSingle();

    if (trialOffering) {
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

    // Grant 'trial' role & complete onboarding
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
    // Member intent: set onboarding step to checkout & redirect to paywall
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