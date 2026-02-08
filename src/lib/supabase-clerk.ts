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
    accessToken: async () => {
      // Fresh token so Supabase integration claims are present; skipCache avoids stale JWT
      const token = await getToken({ skipCache: true });
      if (process.env.NODE_ENV === 'development' && token) {
        try {
          const payload = JSON.parse(
            Buffer.from(token.split('.')[1] ?? '', 'base64url').toString()
          ) as { iss?: string };
          if (payload.iss) console.log('[Supabase+Clerk] JWT iss:', payload.iss);
        } catch {
          // ignore decode errors
        }
      }
      return token ?? null;
    },
  });
}
