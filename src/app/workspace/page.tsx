import { getWorkspaceData } from "./actions"
import { WorkspaceClient } from "./workspace-client"
import { comingSoonItemKeys } from "@/lib/mock-data"

export default async function WorkspacePage() {
  let data
  let error: string | null = null
  try {
    data = await getWorkspaceData()
  } catch (err) {
    console.error("[WorkspacePage] Failed to load data:", err)
    error = err instanceof Error ? err.message : "Failed to load workspace data"
    data = {
      assignments: [],
      tasks: [],
      documents: [],
      contacts: [],
      timeline: [],
      comingSoonItemKeys,
    }
  }

  return <WorkspaceClient initialData={data} error={error} />
}
