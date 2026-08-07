// lib/stores/playbookStore.ts
import { atom } from 'nanostores';
import { PlaybookConfig, MissionSchema } from '@/types/playbook';

export const $playbookStore = atom<PlaybookConfig>({});

/**
 * Hydrates the playbook store with static config
 */
export function setPlaybookStore(config: PlaybookConfig) {
  $playbookStore.set(config);
}

// Alias export for backward compatibility
export const hydratePlaybookStore = setPlaybookStore;

/**
 * Helper getter to retrieve a mission by its string ID (e.g., 'mission-1')
 */
export function getMissionFromStore(missionId: string): MissionSchema | undefined {
  const store = $playbookStore.get();
  return store[missionId] || Object.values(store).find((m) => m.id === missionId);
}