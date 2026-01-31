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
import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"
import {
  FolderOpen,
  ListTodo,
  FileText,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react"
import type { WorkspaceData } from "./actions"
import type { Case, Task, Document, Contact, TimelineEvent } from "@/lib/mock-data"

const SPACE = { section: "space-y-8" }

const MAIN_TABS = [
  { id: "assignments" as const, labelKey: "assignments" },
  { id: "tasks" as const, labelKey: "tasks" },
  { id: "coming-soon" as const, labelKey: "comingSoonTab" },
]

const CASE_TABS = [
  { id: "overview" as const, labelKey: "overview", icon: FolderOpen },
  { id: "contacts" as const, labelKey: "contacts", icon: Users },
  { id: "documents" as const, labelKey: "documents", icon: FileText },
  { id: "tasks" as const, labelKey: "tasks", icon: ListTodo },
  { id: "timeline" as const, labelKey: "timeline", icon: Clock },
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
  t,
  tasksLabel,
  documentsLabel,
  lastActivityLabel,
}: {
  c: Case
  onSelect: () => void
  t: (key: string, params?: Record<string, string>) => string
  tasksLabel: string
  documentsLabel: string
  lastActivityLabel: string
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
      aria-label={t("openAssignment", {
        client: c.client,
        serviceType: c.serviceType,
        taskCount: String(c.taskCount),
        documentCount: String(c.documentCount),
      })}
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
          {c.taskCount} {tasksLabel} · {c.documentCount} {documentsLabel}
        </p>
        <p className="text-xs">{lastActivityLabel}: {c.lastActivity}</p>
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

type Props = {
  initialData: WorkspaceData
  error?: string | null
}

export function WorkspaceClient({ initialData, error }: Props) {
  const { t } = useLocale()
  const [mainTab, setMainTab] = useState<(typeof MAIN_TABS)[number]["id"]>("assignments")
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [caseTab, setCaseTab] = useState<(typeof CASE_TABS)[number]["id"]>("overview")
  const [taskFilter, setTaskFilter] = useState<"all" | "byCase">("all")

  const { assignments, tasks, documents, contacts, timeline, comingSoonItemKeys } =
    initialData

  const tasksByCase = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.caseId ?? "unassigned"
    if (!acc[key]) acc[key] = []
    acc[key].push(task)
    return acc
  }, {})

  const mainTabId = (tab: string) => `main-tab-${tab.toLowerCase().replace(" ", "-")}`
  const mainPanelId = (tab: string) => `main-panel-${tab.toLowerCase().replace(" ", "-")}`

  const handleMainTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = MAIN_TABS.findIndex((tab) => tab.id === mainTab)
      let nextTab: (typeof MAIN_TABS)[number] | null = null
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        nextTab = MAIN_TABS[(idx + 1) % MAIN_TABS.length]
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        nextTab = MAIN_TABS[(idx - 1 + MAIN_TABS.length) % MAIN_TABS.length]
      } else if (e.key === "Home") {
        e.preventDefault()
        nextTab = MAIN_TABS[0]
      } else if (e.key === "End") {
        e.preventDefault()
        nextTab = MAIN_TABS[MAIN_TABS.length - 1]
      }
      if (nextTab) {
        setMainTab(nextTab.id)
        if (nextTab.id !== "assignments") setSelectedCase(null)
        requestAnimationFrame(() => {
          document.getElementById(mainTabId(nextTab!.id))?.focus()
        })
      }
    },
    [mainTab]
  )

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error loading workspace</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {t("skipToContent")}
      </a>

      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("workspace")}
          </h1>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">
            {t("workspaceDesc")}
          </p>

          <nav
            className="mt-6"
            role="tablist"
            aria-label={t("mainNav")}
            onKeyDown={handleMainTabKeyDown}
          >
            <div className="flex flex-wrap gap-2">
              {MAIN_TABS.map((tab) => (
                <Button
                  key={tab.id}
                  id={mainTabId(tab.id)}
                  variant={mainTab === tab.id ? "default" : "outline"}
                  size="sm"
                  role="tab"
                  aria-selected={mainTab === tab.id}
                  aria-controls={mainPanelId(tab.id)}
                  tabIndex={mainTab === tab.id ? 0 : -1}
                  onClick={() => {
                    setMainTab(tab.id)
                    if (tab.id !== "assignments") setSelectedCase(null)
                  }}
                  className="transition-colors duration-150"
                >
                  {t(tab.labelKey)}
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
        {mainTab === "assignments" && (
          <section
            id={mainPanelId("assignments")}
            role="tabpanel"
            aria-labelledby={mainTabId("assignments")}
            className={SPACE.section}
          >
            {selectedCase ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCase(null)}
                    aria-label={t("returnToAssignments")}
                    className="transition-colors duration-150"
                  >
                    ← {t("allAssignments")}
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {selectedCase.client}
                  </span>
                </div>

                <div
                  className="flex flex-wrap gap-2 border-b border-border pb-4"
                  role="tablist"
                  aria-label={t("assignmentSections")}
                >
                  {CASE_TABS.map(({ id, labelKey, icon: Icon }) => (
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
                      {t(labelKey)}
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
                          <p className="text-sm font-medium text-muted-foreground">{t("tasks")}</p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                            {selectedCase.taskCount}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t("documents")}
                          </p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                            {selectedCase.documentCount}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t("lastActivity")}
                          </p>
                          <p className="mt-1 text-lg font-medium text-foreground">
                            {selectedCase.lastActivity}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t("status")}
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
                              <th scope="col" className="p-4 font-medium">{t("contact")}</th>
                              <th scope="col" className="p-4 font-medium">{t("role")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contacts.map((c) => (
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
                              <th scope="col" className="p-4 font-medium">{t("document")}</th>
                              <th scope="col" className="p-4 font-medium">{t("type")}</th>
                              <th scope="col" className="p-4 font-medium">{t("status")}</th>
                              <th scope="col" className="p-4 font-medium">{t("approval")}</th>
                              <th scope="col" className="p-4 font-medium">{t("uploaded")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.map((d) => (
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
                        aria-label={t("tasks")}
                        className="overflow-x-auto rounded-lg border border-border"
                      >
                        <table className="w-full min-w-[600px]" cellPadding={0} cellSpacing={0}>
                          <thead>
                            <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                              <th scope="col" className="p-4 font-medium">{t("task")}</th>
                              <th scope="col" className="p-4 font-medium">{t("status")}</th>
                              <th scope="col" className="p-4 font-medium">{t("priority")}</th>
                              <th scope="col" className="p-4 font-medium">{t("due")}</th>
                              <th scope="col" className="p-4 font-medium">{t("owner")}</th>
                              <th scope="col" className="p-4 font-medium">{t("waitingOn")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasks
                              .filter((task) => task.caseId === selectedCase.id)
                              .map((task) => (
                                <TaskRow key={task.id} t={task} />
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
                        {timeline.map((e) => (
                          <TimelineItem key={e.id} e={e} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {assignments.map((c) => (
                  <CaseCard
                    key={c.id}
                    c={c}
                    onSelect={() => {
                      setSelectedCase(c)
                      setCaseTab("overview")
                    }}
                    t={t}
                    tasksLabel={t("tasksCount")}
                    documentsLabel={t("documentsCount")}
                    lastActivityLabel={t("lastActivity")}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {mainTab === "tasks" && (
          <section
            id={mainPanelId("tasks")}
            role="tabpanel"
            aria-labelledby={mainTabId("tasks")}
            className={SPACE.section}
          >
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label={t("taskViewFilter")}
            >
              <Button
                variant={taskFilter === "all" ? "secondary" : "outline"}
                size="sm"
                aria-pressed={taskFilter === "all"}
                onClick={() => setTaskFilter("all")}
                className="transition-colors duration-150"
              >
                {t("allTasks")}
              </Button>
              <Button
                variant={taskFilter === "byCase" ? "secondary" : "outline"}
                size="sm"
                aria-pressed={taskFilter === "byCase"}
                onClick={() => setTaskFilter("byCase")}
                className="transition-colors duration-150"
              >
                {t("byAssignment")}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("tasks")}</CardTitle>
                <CardDescription>
                  {t("tasksDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border" role="region" aria-label="Tasks table">
                  <table className="w-full min-w-[600px]" cellPadding={0} cellSpacing={0}>
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                        <th scope="col" className="p-4 font-medium">{t("task")}</th>
                        <th scope="col" className="p-4 font-medium">{t("status")}</th>
                        <th scope="col" className="p-4 font-medium">{t("priority")}</th>
                        <th scope="col" className="p-4 font-medium">{t("due")}</th>
                        <th scope="col" className="p-4 font-medium">{t("owner")}</th>
                        <th scope="col" className="p-4 font-medium">{t("waitingOn")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskFilter === "all"
                        ? tasks.map((task) => (
                            <TaskRow key={task.id} t={task} />
                          ))
                        : Object.entries(tasksByCase).map(([caseKey, taskList]) => (
                            <Fragment key={caseKey}>
                              <tr>
                                <td
                                  colSpan={6}
                                  className="bg-muted/50 p-3 font-medium"
                                >
                                  {caseKey === "unassigned"
                                    ? t("unassigned")
                                    : assignments.find((c) => c.id === caseKey)
                                        ?.client ?? caseKey}
                                </td>
                              </tr>
                              {taskList.map((task) => (
                                <TaskRow key={task.id} t={task} />
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

        {mainTab === "coming-soon" && (
          <section
            id={mainPanelId("coming-soon")}
            role="tabpanel"
            aria-labelledby={mainTabId("coming-soon")}
            className={SPACE.section}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("comingSoonTitle")}</CardTitle>
                <CardDescription>
                  {t("comingSoonDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {comingSoonItemKeys.map((key) => (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border border-border p-4",
                        "bg-muted/30 transition-colors duration-150",
                        "hover:bg-muted/50"
                      )}
                    >
                      <Badge variant="secondary">{t("comingSoon")}</Badge>
                      <span className="font-medium">{t(key)}</span>
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
