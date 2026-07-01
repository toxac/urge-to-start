import { atom } from 'nanostores';
import { PlaybookConfig } from '@/types/playbook';

export interface CompanionFocusContext {
  pageType: 'dashboard' | 'mission' | 'quest';
  activeMissionId?: string;
  activeQuestId?: string;
  activeTaskId?: string | null; // ⚡ Explicitly allows null for macro-quest state
}

export const $companionFocus = atom<CompanionFocusContext>({ pageType: 'dashboard' });

export function setCompanionFocus(context: CompanionFocusContext) {
  $companionFocus.set(context);
}

/**
 * ⚡ NEW: Activates a specific micro-task execution bubble
 */
export function activateTaskFocus(taskId: string) {
  const current = $companionFocus.get();
  $companionFocus.set({
    ...current,
    activeTaskId: taskId
  });
}

/**
 * ⚡ NEW: Safely drops task context to step back into macro-quest planning mode
 */
export function deactivateTaskFocus() {
  const current = $companionFocus.get();
  $companionFocus.set({
    ...current,
    activeTaskId: null // Clearing activeTaskId re-triggers Quest context suites
  });
}

export const $playbookStore = atom<PlaybookConfig>({});

export function hydratePlaybookStore(config: PlaybookConfig) {
  $playbookStore.set(config);
}