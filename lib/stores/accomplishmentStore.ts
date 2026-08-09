// lib/stores/accomplishmentStore.ts
import { atom } from 'nanostores';
import { Database } from '@/types/supabase';

export type AccomplishmentRow = Database['public']['Tables']['user_accomplishments']['Row'];

export const $accomplishmentStore = atom<Record<string, AccomplishmentRow>>({});

/**
 * Hydrates the accomplishments dictionary
 */
export function hydrateAccomplishmentStore(rows: AccomplishmentRow[]) {
  const initialMap = (rows || []).reduce((acc, row) => {
    acc[row.id] = row;
    return acc;
  }, {} as Record<string, AccomplishmentRow>);

  $accomplishmentStore.set(initialMap);
}

/**
 * Adds or updates a single accomplishment entry
 */
export function setAccomplishmentStoreRow(row: AccomplishmentRow) {
  const current = $accomplishmentStore.get();
  $accomplishmentStore.set({
    ...current,
    [row.id]: row,
  });
}