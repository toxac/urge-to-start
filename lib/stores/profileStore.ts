import { atom } from 'nanostores';
import { Database } from '@/types/supabase';

export interface ProfileConstraintsPayload {
  weekly_hours?: '2_5_hours' | '5_10_hours' | '10_20_hours' | '20_plus';
  time_slot?: 'evenings' | 'weekends' | 'scraps';
  money_budget?: number;
}

// Tie directly to your database types, explicitly defining the JSON columns
export type ProfileRow = Database['public']['Tables']['profiles']['Row'] & {
  constraints?: ProfileConstraintsPayload;
  core_driver?: Record<string, any>;
};

// Initialize the store as null until populated by layout hydration
export const $profileStore = atom<ProfileRow | null>(null);

/**
 * Replaces the profile instance completely (Hydration or Reset)
 */
export function setProfileStore(profile: ProfileRow | null) {
  $profileStore.set(profile);
}

/**
 * Optimistically merges fields into the profile state
 */
export function updateProfileStoreFields(fields: Partial<ProfileRow>) {
  const current = $profileStore.get();
  if (current) {
    $profileStore.set({
      ...current,
      ...fields
    });
  }
}