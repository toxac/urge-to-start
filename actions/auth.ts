'use server';
// actions/auth.ts
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  if (!username || username.length < 3) return false;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle();

  return data === null;
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
  redirect('/program');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const isNewsletterChecked = formData.get('newsletter') === 'on';

  const isAvailable = await checkUsernameAvailability(username);
  if (!isAvailable) {
    return { error: "This username handle is already claimed." };
  }

  // Determine site root origin safely using your environment profile contracts
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/api/auth/callback?next=/setup`,
      data: {
        username: username.toLowerCase().trim(),
        provider_metadata: { is_subscribed_to_newsletter: isNewsletterChecked },
      },
    },
  });

  if (signUpError) return { error: signUpError.message };

  revalidatePath('/', 'layout');
  // ⚡ The DB trigger guarantees the initial profile exists with roles: ['base']
  return { userId: authData.user?.id, profileCreated: true };
}

export async function completeProfile(userId: string, username: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error('Unauthorized access token verification frame.');
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: username.toLowerCase().trim() })
      .eq('id', userId);
    if (updateError) throw new Error(updateError.message);
  } else {
    // Client-side fallback insert adhering safely to RLS policies
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username.toLowerCase().trim(),
        full_name: username.toLowerCase().trim(),
        country: 'IN',
        roles: ['base'], // Array formatting fix
        onboarding_step: 1,
        accumulated_xp: 0,
        currency: 'INR',

        social_profiles: {},
        mentor_metadata: {},
        provider_metadata: {},

      });
    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required.' };
  }

  // Redirect to the reset password page after email confirmation
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  // Return success (no redirect, so the page can display a success message)
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();

  // Sign out across all active context headers
  await supabase.auth.signOut();

  // Clear tracking routes and drop them at the entry screen
  redirect('/login');
}