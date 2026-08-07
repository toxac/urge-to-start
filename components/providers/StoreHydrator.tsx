// components/providers/StoreHydrator.tsx
'use client';

import { useEffect } from 'react';
import { hydrateProgressStore, ProgressRow } from '@/lib/stores/progressStore';
import { setProfileStore} from '@/lib/stores/profileStore';
import { ProfileRow } from '@/types/profiles';
import { setPlaybookStore } from '@/lib/stores/playbookStore';
import { urgePlaybook } from '@/lib/playbook';
import { PlaybookConfig } from '@/types/playbook';

interface StoreHydratorProps {
  initialProgress: ProgressRow[];
  initialProfile?: ProfileRow | null;
  initialPlaybook?: PlaybookConfig;
}

export function StoreHydrator({ initialProgress, initialProfile, initialPlaybook }: StoreHydratorProps) {
  useEffect(() => {
    hydrateProgressStore(initialProgress);
    setPlaybookStore(initialPlaybook || urgePlaybook);
    
    if (initialProfile) {
      setProfileStore(initialProfile);
    }
  }, [initialProgress, initialProfile, initialPlaybook]);

  return null;
}