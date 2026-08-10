// lib/stores/actionStore.ts
import { map } from 'nanostores';
import { Database } from '@/types/supabase';

export type UserActionRow = Database['public']['Tables']['user_actions']['Row'];

// Store map keyed by action ID
export const $actionStore = map<Record<string, UserActionRow>>({});

/**
 * Bulk initialize or update the action store
 */
export function setActionStore(actions: UserActionRow[]) {
  const current = { ...$actionStore.get() };
  actions.forEach((a) => {
    current[a.id] = a;
  });
  $actionStore.set(current);
}

/**
 * Insert or update a single action row
 */
export function setActionStoreRow(action: UserActionRow) {
  $actionStore.setKey(action.id, action);
}

/**
 * Helper to update action status in memory
 */
export function updateActionStoreStatus(actionId: string, status: UserActionRow['status'], completedAt?: string | null) {
  const existing = $actionStore.get()[actionId];
  if (existing) {
    $actionStore.setKey(actionId, {
      ...existing,
      status,
      completed_at: completedAt !== undefined ? completedAt : existing.completed_at,
    });
  }
}