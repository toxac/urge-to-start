import { atom } from 'nanostores';
import { PlaybookConfig } from '@/types/playbook';

// 1. FOCUS ATOM (Where is the user looking right now?)
export interface CompanionFocusContext {
  pageType: 'dashboard' | 'mission' | 'quest';
  activeMissionId?: string;
  activeQuestId?: string;
  activeTaskId?: string;
}

export const $companionFocus = atom<CompanionFocusContext>({ pageType: 'dashboard' });

export function setCompanionFocus(context: CompanionFocusContext) {
  $companionFocus.set(context);
}

// 2. PLAYBOOK ATOM (Static structural rules cached in memory)
export const $playbookStore = atom<PlaybookConfig>({});

export function hydratePlaybookStore(config: PlaybookConfig) {
  $playbookStore.set(config);
}