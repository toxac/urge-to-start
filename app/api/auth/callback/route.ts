import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Handle optional next query fallbacks safely
  const next = searchParams.get('next') || '/setup';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Append their authenticated ID directly into the parameters contract
      return NextResponse.redirect(`${origin}${next}?id=${data.user.id}`);
    }
  }

  // Fallback anchor safety path
  return NextResponse.redirect(`${origin}/authenticate?error=verification-failed`);
} 