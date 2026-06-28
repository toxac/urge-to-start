'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase'; // Explicitly pull your type contract

export async function submitProfileSetup(formData: FormData) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized identity validation session.");

  const fullName = formData.get('fullName') as string;
  const city = formData.get('city') as string;
  const country = formData.get('country') as string;
  const description = formData.get('description') as string;

  // ⚡ FIX: Cast the update payload to the explicitly generated Profile Update type contract
  const updatePayload: Database['public']['Tables']['profiles']['Update'] = {
    full_name: fullName,
    city: city,
    country: country,
    description: description,
    onboarding_step: 2
  };

  const { error } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id);

  if (error) throw new Error(error.message);

  // Read the signup intent cookie we saved earlier to determine branching
  const savedIntent = cookieStore.get('urge_signup_intent')?.value;

  // Clear intent cookie to keep things clean
  cookieStore.delete('urge_signup_intent');

  // Run your conditional intent check loop logic
  if (savedIntent === 'free') {
    redirect('/program');
  } else {
    redirect('/payment');
  }
}