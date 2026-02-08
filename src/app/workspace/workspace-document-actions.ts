'use server';

import { auth } from '@clerk/nextjs/server';
import { createSupabaseClientForClerk } from '@/lib/supabase-clerk';

export type WorkspaceDocument = {
  id: string;
  user_id: string;
  filename: string;
  storage_path: string | null;
  file_size: number | null;
  content_type: string | null;
  created_at: string;
};

export type GetWorkspaceDocumentsResult =
  | { ok: true; documents: WorkspaceDocument[] }
  | { ok: false; error: string; documents: [] };

export type UploadWorkspaceDocumentResult =
  | { ok: true; document: WorkspaceDocument }
  | { ok: false; error: string };

function hasSupabaseEnv(): boolean {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      anonKey &&
      !anonKey.startsWith('your_') &&
      url !== 'https://your-project.supabase.co'
  );
}

const SUPABASE_ENV_MSG =
  'Add SUPABASE_URL and SUPABASE_ANON_KEY to .env.local. If already set, restart the dev server (env loads at startup). Placeholders (your-project.supabase.co, your_...) are not accepted.';

/** List current user's workspace documents (RLS: user only sees their own). */
export async function getWorkspaceDocuments(): Promise<GetWorkspaceDocumentsResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: SUPABASE_ENV_MSG, documents: [] };
  }
  try {
    const supabase = await createSupabaseClientForClerk();
    const { data, error } = await supabase
      .from('workspace_documents')
      .select('id, user_id, filename, storage_path, file_size, content_type, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[getWorkspaceDocuments]', error.message);
      const friendly =
        error.message.includes('suitable key') || error.message.includes('wrong key type')
          ? 'Clerk + Supabase JWT not configured. In Clerk Dashboard open Setup → Supabase and activate; in Supabase add Clerk as a provider (Authentication → Sign In / Up → Clerk) and paste the Clerk domain.'
          : error.message;
      return { ok: false, error: friendly, documents: [] };
    }
    return { ok: true, documents: (data ?? []) as WorkspaceDocument[] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load documents';
    console.error('[getWorkspaceDocuments]', err);
    return { ok: false, error: message, documents: [] };
  }
}

/** Upload a document (metadata + optional file). Stores metadata only for now; file stored in DB as placeholder for isolation testing. */
export async function uploadWorkspaceDocument(
  formData: FormData
): Promise<UploadWorkspaceDocumentResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: 'Not signed in.' };
  }
  if (!hasSupabaseEnv()) {
    return { ok: false, error: SUPABASE_ENV_MSG };
  }

  const file = formData.get('file') as File | null;
  const filename = file?.name?.trim() || formData.get('filename')?.toString()?.trim() || 'Untitled';
  const fileSize = file?.size ?? null;
  const contentType = file?.type || null;

  try {
    const supabase = await createSupabaseClientForClerk();
    const { data, error } = await supabase
      .from('workspace_documents')
      .insert({
        user_id: userId,
        filename,
        storage_path: null,
        file_size: fileSize,
        content_type: contentType,
      })
      .select('id, user_id, filename, storage_path, file_size, content_type, created_at')
      .single();

    if (error) {
      console.error('[uploadWorkspaceDocument]', error.message);
      const friendly =
        error.message.includes('suitable key') || error.message.includes('wrong key type')
          ? 'Clerk + Supabase JWT not configured. In Clerk Dashboard open Setup → Supabase and activate; in Supabase add Clerk as a provider (Authentication → Sign In / Up → Clerk) and paste the Clerk domain.'
          : error.message;
      return { ok: false, error: friendly };
    }
    return { ok: true, document: data as WorkspaceDocument };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('[uploadWorkspaceDocument]', err);
    return { ok: false, error: message };
  }
}
