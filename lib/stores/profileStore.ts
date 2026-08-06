// lib/stores/profileStore.ts
import { atom } from 'nanostores';
import { ProfileRow } from '@/types/profiles';

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