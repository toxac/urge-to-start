import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase"; // Bind your uploaded schema definitions natively

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Initializes an authenticated, type-safe Supabase client for Server Components,
 * Server Actions, and Route Handlers. Automatically resolves active request cookie stores.
 * 
 * Usage: const supabase = await createClient();
 */
export const createClient = async () => {
  // Await the cookie jar wrapper internally so the caller doesn't have to provide arguments
  const cookieStore = await cookies();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL or Publishable Key in environmental configurations.");
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            );
          } catch {
            // Safely swallow set exceptions if fired from within static page Server Component loops
          }
        },
      },
    },
  );
};