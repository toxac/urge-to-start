// constants/enums.ts
import { Database } from '@/types/supabase';

// Strict Type Aliases extracted directly from your Supabase type contract
export type UserRole = Database['public']['Enums']['user_role'];
export type UserAgeGroup = Database['public']['Enums']['user_age_group'];
export type EducationTier = Database['public']['Enums']['education_tier'];
export type TransactionStatus = Database['public']['Enums']['transaction_status'];
export type OfferingType = Database['public']['Enums']['offering_type'];
export type ProgressStatus = Database['public']['Enums']['progress_status'];

// =========================================================================
// RUNTIME OPTIONS ARRAYS (For mapping inside UI forms and dropdowns)
// =========================================================================

export const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'trial', label: 'Trial Builder' },
  { value: 'member', label: 'Program Member' },
  { value: 'squad', label: 'Squad Supporter' },
  { value: 'mentor', label: 'Advisor Mentor' },
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'admin_marketing', label: 'Marketing Admin' },
  { value: 'admin_accounts', label: 'Accounts Admin' },
];

export const USER_AGE_GROUP_OPTIONS: { value: UserAgeGroup; label: string }[] = [
  { value: 'under_18', label: 'Under 18' },
  { value: '18_24', label: '18 - 24' },
  { value: '25_34', label: '25 - 34' },
  { value: '35_44', label: '35 - 44' },
  { value: '45_54', label: '45 - 54' },
  { value: '55_plus', label: '55 Plus' },
];

export const EDUCATION_TIER_OPTIONS: { value: EducationTier; label: string }[] = [
  { value: 'high_school', label: 'High School' },
  { value: 'undergraduate_degree', label: 'Undergraduate Degree' },
  { value: 'postgraduate_degree', label: 'Postgraduate Degree' },
  { value: 'self_taught', label: 'Self Taught Operator' },
];

export const OFFERING_TYPE_OPTIONS: { value: OfferingType; label: string }[] = [
  { value: 'program', label: 'Program Track' },
  { value: 'membership', label: 'Network Membership' },
  { value: 'merch', label: 'Physical Gear' },
  { value: 'digital_asset', label: 'Digital Resource' },
  { value: 'service', label: 'Specialized Service' },
];

export const TRANSACTION_STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: 'pending', label: 'Pending Verification' },
  { value: 'completed', label: 'Fulfilled Success' },
  { value: 'failed', label: 'Transaction Failed' },
  { value: 'refunded', label: 'Amount Refunded' },
];