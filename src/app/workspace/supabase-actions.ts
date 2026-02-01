'use server';

import { createSupabaseAdmin } from '@/lib/supabase-server';

export type SupabaseTestResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Test Supabase connection: insert a row into uploads and return its id.
 * Requires uploads table and env vars SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
export async function testSupabaseConnection(): Promise<SupabaseTestResult> {
  try {
    const supabase = createSupabaseAdmin();
    const sessionId = crypto.randomUUID();
    const { data, error } = await supabase
      .from('uploads')
      .insert({
        session_id: sessionId,
        filename: 'connection-test.txt',
        extracted_text: 'Test row from Next.js',
        language: 'en',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[testSupabaseConnection] Supabase error:', error);
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id ?? 'unknown' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[testSupabaseConnection] Error:', err);
    return { ok: false, error: msg };
  }
}
