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

  // Check availability
  const isAvailable = await checkUsernameAvailability(username);
  if (!isAvailable) {
    throw new Error("This username handle is already claimed.");
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.toLowerCase().trim(),
        full_name: username.toLowerCase().trim(), // or any default
        country: 'IN', // optional – you can let the trigger set default if not provided
        provider_metadata: { is_subscribed_to_newsletter: isNewsletterChecked }
      },
    },
  });

  if (error) {
    console.error('Signup error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
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