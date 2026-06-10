'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/', 'layout');
  redirect('/platform/dashboard');
}

export async function signup(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/', 'layout');
  redirect('/setup');
}

export async function forgotPassword(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback?next=/change-password`,
  });

  if (error) {
    redirect('/forgot-password?error=' + encodeURIComponent(error.message));
  }

  redirect('/forgot-password?success=true');
}

export async function changePassword(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect('/change-password?error=' + encodeURIComponent(error.message));
  }

  redirect('/platform/dashboard?success=password-updated');
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  
  revalidatePath('/', 'layout');
  redirect('/login');
}