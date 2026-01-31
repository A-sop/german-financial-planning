"use server"

import { readFile } from "fs/promises"
import path from "path"
import { testOpenAIConnection } from "@/lib/openai"
import type {
  Case,
  Task,
  Document,
  Contact,
  TimelineEvent,
} from "@/lib/mock-data"
import { comingSoonItemKeys } from "@/lib/mock-data"

export type WorkspaceData = {
  assignments: Case[]
  tasks: Task[]
  documents: Document[]
  contacts: Contact[]
  timeline: TimelineEvent[]
  comingSoonItemKeys: typeof comingSoonItemKeys
}

/** Load workspace data from JSON file. Falls back to empty arrays on error. */
export async function getWorkspaceData(): Promise<WorkspaceData> {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "workspace.json"
    )
    const raw = await readFile(filePath, "utf-8")
    const data = JSON.parse(raw) as {
      matters?: Case[]
      assignments?: Case[]
      tasks: Task[]
      documents: Document[]
      contacts: Contact[]
      timeline: TimelineEvent[]
    }
    const assignmentList = data.assignments ?? data.matters ?? []
    console.log("[getWorkspaceData] Loaded", assignmentList.length, "assignments")
    return {
      assignments: assignmentList,
      tasks: data.tasks,
      documents: data.documents,
      contacts: data.contacts,
      timeline: data.timeline,
      comingSoonItemKeys,
    }
  } catch (err) {
    console.error("[getWorkspaceData] Error:", err)
    return {
      assignments: [],
      tasks: [],
      documents: [],
      contacts: [],
      timeline: [],
      comingSoonItemKeys,
    }
  }
}

/** Test OpenAI connectivity. Returns { ok, text } or { ok: false, error }. */
export async function testOpenAI(): Promise<
  { ok: true; text: string } | { ok: false; error: string }
> {
  return testOpenAIConnection()
}
