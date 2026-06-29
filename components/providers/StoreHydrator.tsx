// components/providers/StoreHydrator.tsx
'use client';

import { useEffect } from 'react';
import { hydrateProgressStore, ProgressRow } from '@/lib/stores/progressStore';
import { setProfileStore, ProfileRow } from '@/lib/stores/profileStore';
import { hydratePlaybookStore } from '@/lib/stores/companionStore';
import { urgePlaybook } from '@/lib/playbook'; // ⚡ Import static blueprint directly

interface StoreHydratorProps {
  initialProgress: ProgressRow[];
  initialProfile?: ProfileRow | null;
}

export function StoreHydrator({ initialProgress, initialProfile }: StoreHydratorProps) {
  // 1. Run immediate client-side store hydration on mount
  useEffect(() => {
    hydrateProgressStore(initialProgress);
    hydratePlaybookStore(urgePlaybook); // ⚡ Load the static playbook file directly into the store atom
    
    if (initialProfile) {
      setProfileStore(initialProfile);
    }
  }, [initialProgress, initialProfile]);

  return null;
}