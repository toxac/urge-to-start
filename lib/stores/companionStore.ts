// lib/stores/companionStore.ts
import { atom } from 'nanostores';

export interface CompanionFocusContext {
  pageType: 'dashboard' | 'mission' | 'quest';
  activeMissionId?: string;
  activeQuestId?: string;
  activeTaskId?: string | null;
}

export const $companionFocus = atom<CompanionFocusContext>({ pageType: 'dashboard' });

export function setCompanionFocus(context: CompanionFocusContext) {
  $companionFocus.set(context);
}

export function activateTaskFocus(taskId: string) {
  const current = $companionFocus.get();
  $companionFocus.set({
    ...current,
    activeTaskId: taskId,
  });
}

export function deactivateTaskFocus() {
  const current = $companionFocus.get();
  $companionFocus.set({
    ...current,
    activeTaskId: null,
  });
}