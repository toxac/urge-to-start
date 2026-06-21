'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setProfileStore } from '@/lib/stores/profileStore';

export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch deep database table values for the authenticated profile match
    const bootstrapSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (dbProfile) {
          setProfileStore(dbProfile as any);
        }
      } else {
        setProfileStore(null);
      }
    };

    bootstrapSession();

    // 2. Clear out or sync updates if explicit sign-out anomalies trigger
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (dbProfile) setProfileStore(dbProfile as any);
      } else {
        setProfileStore(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return <>{children}</>;
}