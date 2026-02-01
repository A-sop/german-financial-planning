import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase admin client using the service role key.
 * Use only in Server Actions or API routes — never expose to the client.
 */
export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key);
}
