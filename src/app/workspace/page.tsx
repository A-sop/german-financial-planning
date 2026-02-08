import { getWorkspaceData } from './actions';
import { getFeaturesData, type FeaturesData } from './feature-actions';
import { getSupabaseTasks } from './supabase-task-actions';
import { getWorkspaceDocuments } from './workspace-document-actions';
import { WorkspaceClient } from './workspace-client';
import { comingSoonItemKeys } from '@/lib/mock-data';

export default async function WorkspacePage() {
  let data;
  let error: string | null = null;
  try {
    data = await getWorkspaceData();
  } catch (err) {
    console.error('[WorkspacePage] Failed to load data:', err);
    error = err instanceof Error ? err.message : 'Failed to load workspace data';
    data = {
      assignments: [],
      tasks: [],
      documents: [],
      contacts: [],
      timeline: [],
      comingSoonItemKeys,
    };
  }

  let features: FeaturesData = { plannedFeatures: [], userSuggestions: [] };
  try {
    features = await getFeaturesData();
  } catch {
    // Non-fatal
  }

  const supabaseTasksResult = await getSupabaseTasks();
  const supabaseTasks = supabaseTasksResult.ok ? supabaseTasksResult.tasks : [];
  const supabaseTasksError = supabaseTasksResult.ok ? null : supabaseTasksResult.error;

  const workspaceDocsResult = await getWorkspaceDocuments();
  const workspaceDocuments = workspaceDocsResult.ok ? workspaceDocsResult.documents : [];
  const workspaceDocumentsError = workspaceDocsResult.ok ? null : workspaceDocsResult.error;

  return (
    <WorkspaceClient
      initialData={data}
      initialFeatures={features}
      error={error}
      supabaseTasks={supabaseTasks}
      supabaseTasksError={supabaseTasksError}
      workspaceDocuments={workspaceDocuments}
      workspaceDocumentsError={workspaceDocumentsError}
    />
  );
}
