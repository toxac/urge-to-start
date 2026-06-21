import { atom } from 'nanostores';
import { Database } from '@/types/supabase';

export interface TaskProgressPayload {
  userDraft?: string;
  selectedScenario?: string;
  aiFeedback?: {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    suggestedRewrite: string;
    realWorldExecutionAdvice: string[];
  };
  hasSharedWithCircle?: boolean;
  hasClaimedVoice?: boolean;
}

// Intersect the raw database Row with our explicit payload definition
export type ProgressRow = Database['public']['Tables']['user_progress']['Row'] & {
  saved_payload: TaskProgressPayload;
};

// The progress map store dictionary [task_id]: ProgressRow
export const $progressStore = atom<Record<string, ProgressRow>>({});

/**
 * 1. Hydrates the progress map store from a raw list array
 */
export function hydrateProgressStore(rows: ProgressRow[]) {
  const initialMap = rows.reduce((acc, row) => {
    // Check if task_id exists and cast it to a string to satisfy object key constraints
    if (row.task_id) {
      acc[row.task_id as string] = row;
    }
    return acc;
  }, {} as Record<string, ProgressRow>);
  
  $progressStore.set(initialMap);
}

/**
 * 2. Simple, generic upsert helper that handles both updates and inserts automatically
 */
export function setProgressStoreRow(row: ProgressRow) {
  if (!row.task_id) {
    console.warn("⚠️ Cannot update progress store: row is missing a valid task_id.");
    return;
  }

  const current = $progressStore.get();
  $progressStore.set({
    ...current,
    [row.task_id as string]: row
  });
}

/**
 * 3. Simple generic deletion helper
 */
export function removeProgressStoreRow(taskId: string) {
  const current = $progressStore.get();
  const updated = { ...current };
  delete updated[taskId];
  $progressStore.set(updated);
}