import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Safely get the active token state from Supabase Auth
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Extract the verified database role from the secure JWT App Metadata container
  const userRole = user?.app_metadata?.platform_role as string | undefined;

  // ==========================================================
  // 🧭 STRICT ROLE-BASED REDIRECT MATRIX
  // ==========================================================

  // 1. Block unauthenticated users attempting to access platform, setup, or paywall
  if (!user && (path.startsWith('/platform') || path.startsWith('/setup') || path.startsWith('/paywall'))) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Manage Logged-in Users in Limbo ('lead' role)
  if (userRole === 'lead') {
    // If they attempt to access forbidden parts of the platform, push them back to onboarding
    if (path.startsWith('/platform')) {
      url.pathname = '/setup';
      return NextResponse.redirect(url);
    }
  }

  // 3. Handle Authenticated Users with valid access levels
  if (userRole && userRole !== 'lead') {
    // Prevent active members/mentors from wandering into onboarding forms or auth screens
    if (path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/setup') || path.startsWith('/paywall')) {
      url.pathname = '/platform/dashboard';
      return NextResponse.redirect(url);
    }

    // --- Granular Platform Area Gating ---
    if (path.startsWith('/platform/program')) {
      const hasProgramAccess = ['member_full'].includes(userRole);
      if (!hasProgramAccess) {
        url.pathname = '/platform/dashboard'; // Fallback to safe zone
        return NextResponse.redirect(url);
      }
    }

    if (path.startsWith('/platform/marketplace')) {
      const hasMarketplaceAccess = ['member_full', 'member_network', 'provider'].includes(userRole);
      if (!hasMarketplaceAccess) {
        url.pathname = '/platform/dashboard';
        return NextResponse.redirect(url);
      }
    }

    if (path.startsWith('/platform/mentors')) {
      const hasMentorAccess = ['member_full', 'mentor'].includes(userRole);
      if (!hasMentorAccess) {
        url.pathname = '/platform/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
};