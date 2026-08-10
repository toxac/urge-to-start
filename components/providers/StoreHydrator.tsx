// components/providers/StoreHydrator.tsx
'use client';

import { useEffect } from 'react';
import { hydrateProgressStore, ProgressRow } from '@/lib/stores/progressStore';
import { setProfileStore } from '@/lib/stores/profileStore';
import { setActionStore, UserActionRow } from '@/lib/stores/actionStore';
import { ProfileRow } from '@/types/profiles';
import { setPlaybookStore } from '@/lib/stores/playbookStore';
import { urgePlaybook } from '@/lib/playbook';
import { PlaybookConfig } from '@/types/playbook';

interface StoreHydratorProps {
  initialProgress: ProgressRow[];
  initialActions?: UserActionRow[]; // ⚡ Added initialActions
  initialProfile?: ProfileRow | null;
  initialPlaybook?: PlaybookConfig;
}

export function StoreHydrator({ 
  initialProgress, 
  initialActions = [], 
  initialProfile, 
  initialPlaybook 
}: StoreHydratorProps) {
  useEffect(() => {
    hydrateProgressStore(initialProgress);
    setActionStore(initialActions); // ⚡ Hydrate action store
    setPlaybookStore(initialPlaybook || urgePlaybook);
    
    if (initialProfile) {
      setProfileStore(initialProfile);
    }
  }, [initialProgress, initialActions, initialProfile, initialPlaybook]);

  return null;
}