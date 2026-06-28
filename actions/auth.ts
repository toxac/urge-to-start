'use server';
// actions/auth.ts
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
  const username = formData.get('username') as string;
  const isNewsletterChecked = formData.get('newsletter') === 'on';

  const isAvailable = await checkUsernameAvailability(username);
  if (!isAvailable) {
    return { error: "This username handle is already claimed." };
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.toLowerCase().trim(),
        provider_metadata: { is_subscribed_to_newsletter: isNewsletterChecked },
      },
    },
  });

  if (signUpError) return { error: signUpError.message };
  
  // The trigger has already gracefully created the profile row!
  return { userId: authData.user?.id, profileCreated: true };
}

// New action: complete the profile (when initial insertion failed)
export async function completeProfile(userId: string, username: string) {
  const supabase = await createClient();

  // Verify the authenticated user matches the provided userId
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error('Unauthorized: you can only complete your own profile.');
  }

  // Check if profile already exists (might have been created in the meantime)
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    // Profile exists – just update the username
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: username.toLowerCase().trim() })
      .eq('id', userId);
    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    // Insert the missing profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username.toLowerCase().trim(),
        full_name: username.toLowerCase().trim(),
        country: 'IN',
        role: 'user',
        onboarding_step: 1,
        accumulated_xp: 0,
        currency: 'INR',
        capital_available_local: 0.00,
        social_profiles: {},
        mentor_metadata: {},
        provider_metadata: {},
        constraints: {},
      });
    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  // Success – trigger a revalidation and return success
  revalidatePath('/', 'layout');
  return { success: true };
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