import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Task Orchestration | Executive Concierge",
  description:
    "Cases, tasks, and documents — Executive Concierge workspace for managing client cases and workflows.",
}

export default function TaskOrchestrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
