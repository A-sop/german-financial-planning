'use server';

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

/** Fetch tasks for the current user (Clerk + RLS). */
export async function getSupabaseTasks(): Promise<SupabaseTasksResult> {
  try {
    const supabase = await createSupabaseClientForClerk();
    const { data, error } = await supabase
      .from('tasks')
      .select('id, name, user_id, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[getSupabaseTasks]', error.message);
      return { ok: false, error: error.message, tasks: [] };
    }
    return { ok: true, tasks: (data ?? []) as SupabaseTask[] };
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
  const trimmed = name?.trim();
  if (!trimmed) return { ok: false, error: 'Name is required' };
  try {
    const supabase = await createSupabaseClientForClerk();
    const { data, error } = await supabase
      .from('tasks')
      .insert({ name: trimmed })
      .select('id, name, user_id, created_at')
      .single();
    if (error) {
      console.error('[addSupabaseTask]', error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, task: data as SupabaseTask };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to add task';
    console.error('[addSupabaseTask]', err);
    return { ok: false, error: message };
  }
}
