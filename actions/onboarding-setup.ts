'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { UserAgeGroup, EducationTier } from '@/constants/enums';

export async function submitProfileSetup(formData: FormData) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // 1. Authenticate user identity session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized identity validation session.");

  // 2. Safely parse and cast the new clean form parameters
  const fullName = formData.get('fullName') as string;
  const ageGroup = formData.get('ageGroup') as UserAgeGroup;
  const highestEducation = formData.get('highestEducation') as EducationTier;
  const city = formData.get('city') as string;
  const country = formData.get('country') as string;

  // 3. Build a type-safe object payload mapped perfectly to your Database schema
  const updatePayload: Database['public']['Tables']['profiles']['Update'] = {
    full_name: fullName,
    age_group: ageGroup,
    highest_education: highestEducation,
    city: city,
    country: country,
    onboarding_step: 2 // Complete step milestone sequence
  };

  const { error } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id);

  if (error) throw new Error(`Profile synchronization failed: ${error.message}`);

  // 4. Retrieve their signup intent flag cookie to determine routing
  const savedIntent = cookieStore.get('urge_signup_intent')?.value;

  // Clear cookie token state cleanly
  cookieStore.delete('urge_signup_intent');

  // 5. Intelligent redirection branching loop
  if (savedIntent === 'free') {
    redirect('/program');
  } else {
    redirect('/payment');
  }
}