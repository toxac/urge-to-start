// lib/stores/progressStore.ts
import { atom } from 'nanostores';
import { Database } from '@/types/supabase';

export interface ProgressPayload {
  formData?: Record<string, any>;
  aiFeedback?: {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    suggestedRewrite?: string;
    realWorldExecutionAdvice?: string[];
  };
  counterTracking?: {
    currentCount: number;
    targetCount: number;
    logHistory: Array<{
      timestamp: string;
      meta?: Record<string, any>;
    }>;
  };
  verification?: {
    externalLinkVerified?: boolean;
    communityPostId?: string;
    timestampVerified?: string;
  };
  retrospective?: {
    questionPrompt: string;
    userResponseText?: string;
    aiValidationText?: string;
    isLoggedToJournal: boolean;
  };
  [customKey: string]: any;
}

export type ProgressRow = Database['public']['Tables']['user_progress']['Row'] & {
  saved_payload: ProgressPayload;
};

export const $progressStore = atom<Record<string, ProgressRow>>({});

/**
 * Universally hydrates the progress state map dictionary from array records.
 */
export function hydrateProgressStore(rows: ProgressRow[]) {
  const initialMap = (rows || []).reduce((acc, row) => {
    const trackingKey = row.task_id || row.quest_id || row.mission_id;
    if (trackingKey) {
      acc[trackingKey] = row;
    }
    return acc;
  }, {} as Record<string, ProgressRow>);
  
  $progressStore.set(initialMap);
}

// Alias export for backward compatibility
export const setProgressStore = hydrateProgressStore;

/**
 * Multi-tier safe upsert engine.
 */
export function setProgressStoreRow(row: ProgressRow) {
  const trackingKey = row.task_id || row.quest_id || row.mission_id;
  
  if (!trackingKey) {
    console.warn("⚠️ Cannot commit row update to store: missing target task_id, quest_id, or mission_id identifier.");
    return;
  }

  const current = $progressStore.get();
  $progressStore.set({
    ...current,
    [trackingKey]: row
  });
}

/**
 * Scope removal helper
 */
export function removeProgressStoreRow(lookupKey: string) {
  const current = $progressStore.get();
  const updated = { ...current };
  delete updated[lookupKey];
  $progressStore.set(updated);
}