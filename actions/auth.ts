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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Register Auth User
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

  const userId = authData.user?.id;

  // 2. Create Profile row manually if user ID was returned
  if (userId) {
    const cleanUsername = username.toLowerCase().trim();

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        user_id: userId,
        username: cleanUsername,
        fullname: cleanUsername,
        roles: ['trial' as any],
        onboarding_step: '1',
        accumulated_xp: 0,
        currency: 'INR',
        country: 'IN',
      });

    if (profileError && profileError.code !== '23505') { // Ignore if row already created
      console.error('Failed to create initial profile row:', profileError.message);
    }
  }

  revalidatePath('/', 'layout');
  return { userId, profileCreated: true };
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
        user_id: userId, // ⚡ Added required user_id field
        username: username.toLowerCase().trim(),
        fullname: username.toLowerCase().trim(),
        country: 'IN',
        roles: ['trial' as any],
        onboarding_step: '1',
        accumulated_xp: 0,
        currency: 'INR',
        social_footprint: {},
        mentor_profile: {},
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect('/login');
}