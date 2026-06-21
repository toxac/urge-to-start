import { atom } from 'nanostores';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  bizName: string;
  role: 'lead' | 'member_full' | 'member_network' | 'mentor' | 'provider';
  onboardingStep: number;
}

// Initialize the store as null until populated by hydration or auth events
export const $userProfile = atom<UserProfile | null>(null);

// Actions to interact cleanly with the profile state
export function setProfile(profile: UserProfile | null) {
  $userProfile.set(profile);
}

export function updateProfileFields(fields: Partial<UserProfile>) {
  const current = $userProfile.get();
  if (current) {
    $userProfile.set({ ...current, ...fields });
  }
}