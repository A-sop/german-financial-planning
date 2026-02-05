import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client that sends the Clerk session token.
 * Use in Server Components and Server Actions when you need RLS to see the
 * authenticated user (auth.jwt()->>'sub' = Clerk user ID).
 *
 * Requires Clerk Supabase integration (Clerk Dashboard + Supabase Dashboard)
 * and SUPABASE_URL + SUPABASE_ANON_KEY in env.
 *
 * @see https://clerk.com/docs/guides/development/integrations/databases/supabase
 */
export async function createSupabaseClientForClerk() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_ANON_KEY (or NEXT_PUBLIC_*). ' +
        'Required for Clerk + Supabase RLS. See .env.example.'
    );
  }
  const { getToken } = await auth();
  return createClient(url, anonKey, {
    accessToken: async () => (await getToken()) ?? null,
  });
}
