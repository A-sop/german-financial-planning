'use server';

import { auth } from '@clerk/nextjs/server';
import { createSupabaseClientForClerk } from '@/lib/supabase-clerk';

export type SupabaseTask = {
  id: number;
  name: string;
  user_id: string;
  created_at: string;
};

export type SupabaseTasksResult =
  | { ok: true; tasks: SupabaseTask[] }
  | { ok: false; error: string; tasks: [] };

const SUPABASE_RLS_SETUP_MSG =
  'Add SUPABASE_URL and SUPABASE_ANON_KEY to .env.local (see .env.example). If already set, restart the dev server — env is loaded at startup. Placeholders (your-project.supabase.co, your_...) are not accepted.';

function hasSupabaseEnv(): boolean {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      anonKey &&
      !anonKey.startsWith('your_') &&
      url !== 'https://your-project.supabase.co'
  );
}

/** Fetch tasks for the current user (Clerk + RLS). */
export async function getSupabaseTasks(): Promise<SupabaseTasksResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: SUPABASE_RLS_SETUP_MSG, tasks: [] };
  }
  try {
    const supabase = await createSupabaseClientForClerk();
    const { data, error } = await supabase
      .from('tasks')
      .select('id, name, user_id, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[getSupabaseTasks]', error.message);
      const friendly =
        error.message.includes('suitable key') || error.message.includes('wrong key type')
          ? 'Clerk + Supabase JWT not configured. In Clerk Dashboard open Setup → Supabase and activate; in Supabase Dashboard add Clerk as a provider (Authentication → Sign In / Up → Clerk) and paste the Clerk domain. See auth-flow-prd or clerk.com/docs/integrations/databases/supabase.'
          : error.message;
      return { ok: false, error: friendly, tasks: [] };
    }
    const tasks: SupabaseTask[] = (data ?? []).map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      name: String(row.name),
      user_id: String(row.user_id),
      created_at: row.created_at instanceof Date ? (row.created_at as Date).toISOString() : String(row.created_at ?? ''),
    }));
    return { ok: true, tasks };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to load tasks';
    console.error('[getSupabaseTasks]', err);
    return { ok: false, error: message, tasks: [] };
  }
}

export type AddSupabaseTaskResult =
  | { ok: true; task: SupabaseTask }
  | { ok: false; error: string };

/** Add a task (name only). user_id is set by DB default from JWT. */
export async function addSupabaseTask(
  name: string
): Promise<AddSupabaseTaskResult> {
  // Outermost catch so we never throw — Next.js expects an RSC response (content-type text/x-component).
  // If we throw, the server may return 500 HTML/text and the client shows "unexpected response".
  try {
    const trimmed = typeof name === 'string' ? name.trim() : '';
    if (!trimmed) {
      return { ok: false, error: 'Name is required' };
    }
    if (!hasSupabaseEnv()) {
      return { ok: false, error: SUPABASE_RLS_SETUP_MSG };
    }
    const { userId } = await auth();
    if (!userId) {
      return { ok: false, error: 'Not authenticated' };
    }
    let supabase;
    try {
      supabase = await createSupabaseClientForClerk();
    } catch (clientErr) {
      const msg =
        clientErr instanceof Error ? clientErr.message : 'Supabase client failed';
      console.error('[addSupabaseTask] createSupabaseClientForClerk', clientErr);
      return { ok: false, error: String(msg) };
    }
    const { data, error } = await supabase
      .from('tasks')
      .insert({ name: trimmed, user_id: userId })
      .select('id, name, user_id, created_at')
      .single();
    if (error) {
      console.error('[addSupabaseTask]', error.message);
      const friendly =
        error.message.includes('suitable key') || error.message.includes('wrong key type')
          ? 'Clerk + Supabase JWT not configured. In Clerk Dashboard open Setup → Supabase and activate; in Supabase add Clerk as a provider (Authentication → Sign In / Up → Clerk) and paste the Clerk domain.'
          : error.message;
      return { ok: false, error: friendly };
    }
    const raw = data as Record<string, unknown> | null;
    return {
      ok: true as const,
      task: {
        id: Number(raw?.id ?? 0),
        name: String(raw?.name ?? trimmed),
        user_id: String(raw?.user_id ?? ''),
        created_at:
          raw?.created_at instanceof Date
            ? (raw.created_at as Date).toISOString()
            : String(raw?.created_at ?? new Date().toISOString()),
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to add task';
    console.error('[addSupabaseTask]', err);
    return { ok: false, error: String(message) };
  }
}
