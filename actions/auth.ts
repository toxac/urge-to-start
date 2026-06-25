'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// ⚡ NEW: Real-time username availability lookup function
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  if (!username || username.length < 3) return false;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle();

  // If data is null, the username is free and available
  return data === null;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Return to client component handler instead of a hard redirect crash
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/program'); // Updated to our new program dashboard path
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const username = formData.get('username') as string;
  const isNewsletterChecked = formData.get('newsletter') === 'on';

  // 1. Final server-side redundancy check for username availability
  const isAvailable = await checkUsernameAvailability(username);
  if (!isAvailable) {
    throw new Error("This username handle is already claimed.");
  }

  // 2. Execute user creation inside Supabase Auth
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Pass our profile variables straight into standard metadata tracking paths
      data: { 
        full_name: fullName,
        username: username.toLowerCase().trim(),
        // Save the newsletter preference cleanly within provider_metadata
        provider_metadata: { is_subscribed_to_newsletter: isNewsletterChecked }
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // 3. Fallback sync to ensure profiles row mirrors the username correctly
  if (authData?.user) {
    await supabase
      .from('profiles')
      .update({ 
        full_name: fullName,
        username: username.toLowerCase().trim(),
        provider_metadata: { is_subscribed_to_newsletter: isNewsletterChecked }
      })
      .eq('id', authData.user.id);
  }

  revalidatePath('/', 'layout');
  
  // Send the user directly to the new workbook alignment view step passing down their ID
  redirect(`/setup?id=${authData.user?.id}`);
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback?next=/change-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }

  redirect('/program?success=password-updated');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath('/', 'layout');
  redirect('/authenticate'); // Clear to our new unified authentication route
}