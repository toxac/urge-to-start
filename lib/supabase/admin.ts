import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // Using your uploaded types file natively

/**
 * Initializes a high-privilege, server-only Supabase client using the service role key.
 * Bypasses Row Level Security (RLS) policies completely.
 * 
 * CRITICAL SECURITY NOTE: Never import or call this function within client-side code vectors.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.NEXT_SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      'Missing admin client environmental variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_SUPABASE_SECRET_KEY.'
    );
  }

  // Explicitly passing your Database types contract to ensure the admin instance is fully type-safe
  return createClient<Database>(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}