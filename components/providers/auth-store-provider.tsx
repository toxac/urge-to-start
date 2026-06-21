'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setProfile } from '@/lib/stores/profileStore';

export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch current profile values on mount
    const bootstrapSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || 'Founder',
          bizName: user.user_metadata?.biz_name || '',
          role: (user.app_metadata?.platform_role as any) || 'lead',
          onboardingStep: user.user_metadata?.onboarding_step || 1,
        });
      } else {
        setProfile(null);
      }
    };

    bootstrapSession();

    // 2. Listen continuously for login/logout events across browser contexts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setProfile({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name || 'Founder',
          bizName: session.user.user_metadata?.biz_name || '',
          role: (session.user.app_metadata?.platform_role as any) || 'lead',
          onboardingStep: session.user.user_metadata?.onboarding_step || 1,
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return <>{children}</>;
}