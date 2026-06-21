'use client';

import { hydrateProgressStore, ProgressRow } from '@/lib/stores/progressStore';
import { setProfileStore, ProfileRow } from '@/lib/stores/profileStore';

interface StoreHydratorProps {
  initialProgress: ProgressRow[];
  initialProfile?: ProfileRow | null;
}

export function StoreHydrator({ initialProgress, initialProfile }: StoreHydratorProps) {
  // Synchronously hydrate both atomic global stores instantly on the client layout thread
  hydrateProgressStore(initialProgress);
  
  if (initialProfile) {
    setProfileStore(initialProfile);
  }

  return null;
}