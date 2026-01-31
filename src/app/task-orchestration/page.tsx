"use client"

import { useState, Fragment, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  mockCases,
  mockTasks,
  mockDocuments,
  mockContacts,
  mockTimeline,
  comingSoonItems,
  type Case,
  type Task,
  type Document,
  type Contact,
  type TimelineEvent,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  FolderOpen,
  ListTodo,
  FileText,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react"

// --- Spacing tokens (aligned with shadcn) ---
const SPACE = {
  section: "space-y-8",
}

// --- Tab navigation (simple button-based) ---
const MAIN_TABS = ["Cases", "Tasks", "Coming Soon"] as const

// --- Case workspace sub-tabs ---
const CASE_TABS = [
  { id: "overview", label: "Overview", icon: FolderOpen },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "timeline", label: "Timeline", icon: Clock },
] as const

function statusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "active" || status === "approved" || status === "done")
    return "default"
  if (status === "pending" || status === "in_progress" || status === "waiting")
    return "secondary"
  if (status === "rejected") return "destructive"
  return "outline"
}

function CaseCard({
  c,
  onSelect,
}: {
  c: Case
  onSelect: () => void
}) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onSelect()
      }
    },
    [onSelect]
  )
  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors duration-200",
        "hover:bg-muted/50 hover:border-border/80",
        "active:scale-[0.99] active:bg-muted/70",
        "focus-ring focus:outline-none rounded-xl"
      )}
      tabIndex={0}
      role="button"
      aria-label={`Open case: ${c.client}, ${c.serviceType}. ${c.taskCount} tasks, ${c.documentCount} documents.`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base leading-tight">{c.client}</CardTitle>
            <CardDescription className="mt-0.5">{c.serviceType}</CardDescription>
          </div>
          <Badge variant={statusBadgeVariant(c.status)} className="shrink-0 capitalize">
            {c.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>
          {c.taskCount} tasks · {c.documentCount} documents
        </p>
        <p className="text-xs">Last activity: {c.lastActivity}</p>
      </CardContent>
    </Card>
  )
}

function TaskRow({ t }: { t: Task }) {
  return (
    <tr className="border-b transition-colors duration-150 hover:bg-muted/50">
      <td className="p-4">
        <div className="font-medium">{t.title}</div>
        {t.caseClient && (
          <div className="text-xs text-muted-foreground">{t.caseClient}</div>
        )}
      </td>
      <td className="p-4">
        <Badge variant={statusBadgeVariant(t.status)} className="capitalize">
          {t.status.replace("_", " ")}
        </Badge>
      </td>
      <td className="p-4">
        <Badge
          variant={t.priority === "urgent" ? "destructive" : "secondary"}
          className="capitalize"
        >
          {t.priority}
        </Badge>
      </td>
      <td className="p-4 text-sm">{t.dueDate}</td>
      <td className="p-4 text-sm text-muted-foreground">{t.owner}</td>
      <td className="p-4 text-sm text-muted-foreground">
        {t.waitingOn ?? "—"}
      </td>
    </tr>
  )
}

function DocumentRow({ d }: { d: Document }) {
  return (
    <tr className="border-b transition-colors duration-150 hover:bg-muted/50">
      <td className="p-4 font-medium">{d.name}</td>
      <td className="p-4">
        <Badge variant="outline">{d.type}</Badge>
      </td>
      <td className="p-4">
        <Badge variant={statusBadgeVariant(d.status)} className="capitalize">
          {d.status.replace("_", " ")}
        </Badge>
      </td>
      <td className="p-4">
        {d.approvalStatus && (
          <Badge
            variant={statusBadgeVariant(d.approvalStatus)}
            className="capitalize"
          >
            {d.approvalStatus}
          </Badge>
        )}
      </td>
      <td className="p-4 text-sm text-muted-foreground">{d.uploadedAt}</td>
    </tr>
  )
}

function ContactRow({ c }: { c: Contact }) {
  return (
    <tr className="border-b transition-colors duration-150 hover:bg-muted/50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-foreground"
            aria-hidden
          >
            {c.initials}
          </div>
          <div>
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-muted-foreground">{c.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <Badge variant="outline" className="capitalize">
          {c.role}
        </Badge>
      </td>
    </tr>
  )
}

function TimelineItem({ e }: { e: TimelineEvent }) {
  return (
    <article className="flex gap-4 py-4 first:pt-0" aria-label={e.title}>
      <div
        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
        aria-hidden
      />
      <div>
        <p className="font-medium">{e.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{e.description}</p>
        <span className="mt-1 block text-xs text-muted-foreground">
          {e.timestamp}
        </span>
      </div>
    </article>
  )
}

export default function TaskOrchestrationPage() {
  const [mainTab, setMainTab] = useState<(typeof MAIN_TABS)[number]>("Cases")
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [caseTab, setCaseTab] = useState<(typeof CASE_TABS)[number]["id"]>(
    "overview"
  )
  const [taskFilter, setTaskFilter] = useState<"all" | "byCase">("all")

  const tasksByCase = mockTasks.reduce<Record<string, Task[]>>((acc, t) => {
    const key = t.caseId ?? "unassigned"
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const mainTabId = (tab: string) => `main-tab-${tab.toLowerCase().replace(" ", "-")}`
  const mainPanelId = (tab: string) => `main-panel-${tab.toLowerCase().replace(" ", "-")}`

  const handleMainTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = MAIN_TABS.indexOf(mainTab)
      let nextTab: (typeof MAIN_TABS)[number] | null = null
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        nextTab = MAIN_TABS[(idx + 1) % MAIN_TABS.length]
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        nextTab = MAIN_TABS[(idx - 1 + MAIN_TABS.length) % MAIN_TABS.length]
      } else if (e.key === "Home") {
        e.preventDefault()
        nextTab = "Cases"
      } else if (e.key === "End") {
        e.preventDefault()
        nextTab = "Coming Soon"
      }
      if (nextTab) {
        setMainTab(nextTab)
        if (nextTab !== "Cases") setSelectedCase(null)
        requestAnimationFrame(() => {
          document.getElementById(mainTabId(nextTab!))?.focus()
        })
      }
    },
    [mainTab]
  )

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Task Orchestration
          </h1>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">
            Cases, tasks, and documents — Executive Concierge workspace
          </p>

          <nav
            className="mt-6"
            role="tablist"
            aria-label="Main navigation"
            onKeyDown={handleMainTabKeyDown}
          >
            <div className="flex flex-wrap gap-2">
              {MAIN_TABS.map((tab) => (
                <Button
                  key={tab}
                  id={mainTabId(tab)}
                  variant={mainTab === tab ? "default" : "outline"}
                  size="sm"
                  role="tab"
                  aria-selected={mainTab === tab}
                  aria-controls={mainPanelId(tab)}
                  tabIndex={mainTab === tab ? 0 : -1}
                  onClick={() => {
                    setMainTab(tab)
                    if (tab !== "Cases") setSelectedCase(null)
                  }}
                  className="transition-colors duration-150"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
        role="main"
      >
        {mainTab === "Cases" && (
          <section
            id={mainPanelId("Cases")}
            role="tabpanel"
            aria-labelledby={mainTabId("Cases")}
            className={SPACE.section}
          >
            {selectedCase ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCase(null)}
                    aria-label="Return to all cases"
                    className="transition-colors duration-150"
                  >
                    ← All cases
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {selectedCase.client}
                  </span>
                </div>

                <div
                  className="flex flex-wrap gap-2 border-b border-border pb-4"
                  role="tablist"
                  aria-label="Case sections"
                >
                  {CASE_TABS.map(({ id, label, icon: Icon }) => (
                    <Button
                      key={id}
                      variant={caseTab === id ? "secondary" : "ghost"}
                      size="sm"
                      role="tab"
                      aria-selected={caseTab === id}
                      aria-controls={`case-panel-${id}`}
                      id={`case-tab-${id}`}
                      tabIndex={caseTab === id ? 0 : -1}
                      onClick={() => setCaseTab(id)}
                      className="transition-colors duration-150"
                    >
                      <Icon className="mr-1.5 h-4 w-4" aria-hidden />
                      {label}
                    </Button>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCase.client}</CardTitle>
                    <CardDescription>
                      {selectedCase.serviceType} · {selectedCase.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {caseTab === "overview" && (
                      <div
                        id="case-panel-overview"
                        role="tabpanel"
                        aria-labelledby="case-tab-overview"
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                      >
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                            {selectedCase.taskCount}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            Documents
                          </p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                            {selectedCase.documentCount}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            Last activity
                          </p>
                          <p className="mt-1 text-lg font-medium text-foreground">
                            {selectedCase.lastActivity}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            Status
                          </p>
                          <div className="mt-1">
                          <Badge variant={statusBadgeVariant(selectedCase.status)}>
                            {selectedCase.status}
                          </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    {caseTab === "contacts" && (
                      <div
                        id="case-panel-contacts"
                        role="tabpanel"
                        aria-labelledby="case-tab-contacts"
                        aria-label="Contacts table"
                        className="overflow-x-auto rounded-lg border border-border"
                      >
                        <table className="w-full min-w-[320px]" cellPadding={0} cellSpacing={0}>
                          <thead>
                            <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                              <th scope="col" className="p-4 font-medium">Contact</th>
                              <th scope="col" className="p-4 font-medium">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockContacts.map((c) => (
                              <ContactRow key={c.id} c={c} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {caseTab === "documents" && (
                      <div
                        id="case-panel-documents"
                        role="tabpanel"
                        aria-labelledby="case-tab-documents"
                        aria-label="Documents table"
                        className="overflow-x-auto rounded-lg border border-border"
                      >
                        <table className="w-full min-w-[520px]" cellPadding={0} cellSpacing={0}>
                          <thead>
                            <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                              <th scope="col" className="p-4 font-medium">Document</th>
                              <th scope="col" className="p-4 font-medium">Type</th>
                              <th scope="col" className="p-4 font-medium">Status</th>
                              <th scope="col" className="p-4 font-medium">Approval</th>
                              <th scope="col" className="p-4 font-medium">Uploaded</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockDocuments.map((d) => (
                              <DocumentRow key={d.id} d={d} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {caseTab === "tasks" && (
                      <div
                        id="case-panel-tasks"
                        role="tabpanel"
                        aria-labelledby="case-tab-tasks"
                        aria-label="Case tasks table"
                        className="overflow-x-auto rounded-lg border border-border"
                      >
                        <table className="w-full min-w-[600px]" cellPadding={0} cellSpacing={0}>
                          <thead>
                            <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                              <th scope="col" className="p-4 font-medium">Task</th>
                              <th scope="col" className="p-4 font-medium">Status</th>
                              <th scope="col" className="p-4 font-medium">Priority</th>
                              <th scope="col" className="p-4 font-medium">Due</th>
                              <th scope="col" className="p-4 font-medium">Owner</th>
                              <th scope="col" className="p-4 font-medium">Waiting on</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockTasks
                              .filter((t) => t.caseId === selectedCase.id)
                              .map((t) => (
                                <TaskRow key={t.id} t={t} />
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {caseTab === "timeline" && (
                      <div
                        id="case-panel-timeline"
                        role="tabpanel"
                        aria-labelledby="case-tab-timeline"
                        className="space-y-0"
                      >
                        {mockTimeline.map((e) => (
                          <TimelineItem key={e.id} e={e} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {mockCases.map((c) => (
                  <CaseCard
                    key={c.id}
                    c={c}
                    onSelect={() => {
                      setSelectedCase(c)
                      setCaseTab("overview")
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {mainTab === "Tasks" && (
          <section
            id={mainPanelId("Tasks")}
            role="tabpanel"
            aria-labelledby={mainTabId("Tasks")}
            className={SPACE.section}
          >
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Task view filter"
            >
              <Button
                variant={taskFilter === "all" ? "secondary" : "outline"}
                size="sm"
                aria-pressed={taskFilter === "all"}
                onClick={() => setTaskFilter("all")}
                className="transition-colors duration-150"
              >
                All tasks
              </Button>
              <Button
                variant={taskFilter === "byCase" ? "secondary" : "outline"}
                size="sm"
                aria-pressed={taskFilter === "byCase"}
                onClick={() => setTaskFilter("byCase")}
                className="transition-colors duration-150"
              >
                By case
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Global and case-specific tasks. Waiting-on tracking shown.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border" role="region" aria-label="Tasks table">
                  <table className="w-full min-w-[600px]" cellPadding={0} cellSpacing={0}>
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                        <th scope="col" className="p-4 font-medium">Task</th>
                        <th scope="col" className="p-4 font-medium">Status</th>
                        <th scope="col" className="p-4 font-medium">Priority</th>
                        <th scope="col" className="p-4 font-medium">Due</th>
                        <th scope="col" className="p-4 font-medium">Owner</th>
                        <th scope="col" className="p-4 font-medium">Waiting on</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskFilter === "all"
                        ? mockTasks.map((t) => (
                            <TaskRow key={t.id} t={t} />
                          ))
                        : Object.entries(tasksByCase).map(([caseKey, tasks]) => (
                            <Fragment key={caseKey}>
                              <tr>
                                <td
                                  colSpan={6}
                                  className="bg-muted/50 p-3 font-medium"
                                >
                                  {caseKey === "unassigned"
                                    ? "Unassigned"
                                    : mockCases.find((c) => c.id === caseKey)
                                        ?.client ?? caseKey}
                                </td>
                              </tr>
                              {tasks.map((t) => (
                                <TaskRow key={t.id} t={t} />
                              ))}
                            </Fragment>
                          ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {mainTab === "Coming Soon" && (
          <section
            id={mainPanelId("Coming Soon")}
            role="tabpanel"
            aria-labelledby={mainTabId("Coming Soon")}
            className={SPACE.section}
          >
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                These features are on the roadmap. UI clearly marks them to set
                expectations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {comingSoonItems.map((item) => (
                  <div
                    key={item}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border p-4",
                      "bg-muted/30 transition-colors duration-150",
                      "hover:bg-muted/50"
                    )}
                  >
                    <Badge variant="secondary">Coming Soon</Badge>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </section>
        )}
      </main>
    </div>
  )
}
