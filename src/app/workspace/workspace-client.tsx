'use client';

import { useState, Fragment, useCallback, useEffect, type KeyboardEvent, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/components/providers/locale-provider';
import { cn } from '@/lib/utils';
import { FolderOpen, ListTodo, FileText, Users, Clock, ChevronRight, ChevronUp, ChevronDown, Plus, Upload } from 'lucide-react';
import type { WorkspaceData } from './actions';
import { addTask } from './actions';
import { addSupabaseTask } from './supabase-task-actions';
import type { SupabaseTask } from './supabase-task-actions';
import { uploadWorkspaceDocument } from './workspace-document-actions';
import type { WorkspaceDocument } from './workspace-document-actions';
import type { Case, Task, Document, Contact, TimelineEvent } from '@/lib/mock-data';
import type { TaskStatus, TaskPriority } from '@/lib/mock-data';
import type { PlannedFeature, FeaturesData } from './feature-actions';
import { voteFeature, submitFeatureSuggestion } from './feature-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const SPACE = { section: 'space-y-8' };

const MAIN_TABS = [
  { id: 'assignments' as const, labelKey: 'assignments' },
  { id: 'tasks' as const, labelKey: 'tasks' },
  { id: 'coming-soon' as const, labelKey: 'comingSoonTab' },
];

const CASE_TABS = [
  { id: 'overview' as const, labelKey: 'overview', icon: FolderOpen },
  { id: 'contacts' as const, labelKey: 'contacts', icon: Users },
  { id: 'documents' as const, labelKey: 'documents', icon: FileText },
  { id: 'tasks' as const, labelKey: 'tasks', icon: ListTodo },
  { id: 'timeline' as const, labelKey: 'timeline', icon: Clock },
] as const;

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'active' || status === 'approved' || status === 'done') return 'default';
  if (status === 'pending' || status === 'in_progress' || status === 'waiting') return 'secondary';
  if (status === 'rejected') return 'destructive';
  return 'outline';
}

function CaseCard({
  c,
  onSelect,
  t,
  tasksLabel,
  documentsLabel,
  lastActivityLabel,
}: {
  c: Case;
  onSelect: () => void;
  t: (_key: string, _params?: Record<string, string>) => string;
  tasksLabel: string;
  documentsLabel: string;
  lastActivityLabel: string;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect();
      }
    },
    [onSelect]
  );
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors duration-200',
        'hover:bg-muted/50 hover:border-border/80',
        'active:scale-[0.99] active:bg-muted/70',
        'focus-ring focus:outline-none rounded-xl'
      )}
      tabIndex={0}
      role="button"
      aria-label={t('openAssignment', {
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
        <p className="text-xs">
          {lastActivityLabel}: {c.lastActivity}
        </p>
      </CardContent>
    </Card>
  );
}

function TaskRow({ t }: { t: Task }) {
  return (
    <tr className="border-b transition-colors duration-150 hover:bg-muted/50">
      <td className="p-4">
        <div className="font-medium">{t.title}</div>
        {t.caseClient && <div className="text-xs text-muted-foreground">{t.caseClient}</div>}
      </td>
      <td className="p-4">
        <Badge variant={statusBadgeVariant(t.status)} className="capitalize">
          {t.status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="p-4">
        <Badge
          variant={t.priority === 'urgent' ? 'destructive' : 'secondary'}
          className="capitalize"
        >
          {t.priority}
        </Badge>
      </td>
      <td className="p-4 text-sm">{t.dueDate}</td>
      <td className="p-4 text-sm text-muted-foreground">{t.owner}</td>
      <td className="p-4 text-sm text-muted-foreground">{t.waitingOn ?? '—'}</td>
    </tr>
  );
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
          {d.status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="p-4">
        {d.approvalStatus && (
          <Badge variant={statusBadgeVariant(d.approvalStatus)} className="capitalize">
            {d.approvalStatus}
          </Badge>
        )}
      </td>
      <td className="p-4 text-sm text-muted-foreground">{d.uploadedAt}</td>
    </tr>
  );
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
  );
}

function TimelineItem({ e }: { e: TimelineEvent }) {
  return (
    <article className="flex gap-4 py-4 first:pt-0" aria-label={e.title}>
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
      <div>
        <p className="font-medium">{e.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{e.description}</p>
        <span className="mt-1 block text-xs text-muted-foreground">{e.timestamp}</span>
      </div>
    </article>
  );
}

type Props = {
  initialData: WorkspaceData;
  initialFeatures: FeaturesData;
  error?: string | null;
  supabaseTasks: SupabaseTask[];
  supabaseTasksError: string | null;
  workspaceDocuments: WorkspaceDocument[];
  workspaceDocumentsError: string | null;
};

function FeatureVoteRow({
  id,
  label,
  votes,
  onVote,
  disabled,
}: {
  id: string;
  label: string;
  votes: number;
  onVote: (_id: string, _delta: 1 | -1) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border p-4',
        'bg-muted/30 transition-colors duration-150 hover:bg-muted/50'
      )}
    >
      <div className="flex shrink-0 flex-col gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onVote(id, 1)}
          disabled={disabled}
          aria-label="Vote up"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-center text-sm font-medium tabular-nums">{votes}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onVote(id, -1)}
          disabled={disabled}
          aria-label="Vote down"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
}

export function WorkspaceClient({
  initialData,
  initialFeatures,
  error,
  supabaseTasks,
  supabaseTasksError,
  workspaceDocuments,
  workspaceDocumentsError,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();

  // Strip ?onboarding=done from URL after post-onboarding redirect (clean URL)
  useEffect(() => {
    if (searchParams.get('onboarding') === 'done') {
      router.replace('/workspace');
    }
  }, [router, searchParams]);

  const [mainTab, setMainTab] = useState<(typeof MAIN_TABS)[number]['id']>('assignments');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [caseTab, setCaseTab] = useState<(typeof CASE_TABS)[number]['id']>('overview');
  const [taskFilter, setTaskFilter] = useState<'all' | 'byCase'>('all');
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionStatus, setSuggestionStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [supabaseTaskName, setSupabaseTaskName] = useState('');
  const [addSupabaseTaskStatus, setAddSupabaseTaskStatus] = useState<
    'idle' | 'loading' | 'error'
  >('idle');
  const [addSupabaseTaskError, setAddSupabaseTaskError] = useState<string | null>(null);
  const [uploadDocStatus, setUploadDocStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [uploadDocError, setUploadDocError] = useState<string | null>(null);

  const { assignments, tasks, documents, contacts, timeline } = initialData;
  const { plannedFeatures, userSuggestions } = initialFeatures;

  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCaseId, setNewTaskCaseId] = useState<string | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskOwner, setNewTaskOwner] = useState('Assistant');
  const [addTaskStatus, setAddTaskStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [addTaskError, setAddTaskError] = useState<string | null>(null);

  const handleVote = useCallback(
    async (featureId: string, delta: 1 | -1) => {
      setVotingId(featureId);
      const result = await voteFeature(featureId, delta);
      setVotingId(null);
      if (result.success) router.refresh();
    },
    [router]
  );

  const handleSubmitSuggestion = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    setSuggestionStatus('loading');
    setSuggestionError(null);
    const result = await submitFeatureSuggestion(suggestionText);
    if (result.success) {
      setSuggestionText('');
      setSuggestionStatus('idle');
      router.refresh();
    } else {
      setSuggestionError(result.error);
      setSuggestionStatus('error');
    }
  }, [suggestionText, router]);

  const handleAddTask = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const title = newTaskTitle.trim();
      if (!title) return;
      setAddTaskStatus('loading');
      setAddTaskError(null);
      const dueDate = newTaskDueDate || new Date().toISOString().slice(0, 10);
      const result = await addTask({
        title,
        caseId: newTaskCaseId,
        status: newTaskStatus,
        priority: newTaskPriority,
        dueDate,
        owner: newTaskOwner.trim() || 'Assistant',
      });
      if (result.ok) {
        setNewTaskTitle('');
        setNewTaskDueDate('');
        setAddTaskOpen(false);
        setAddTaskStatus('idle');
        router.refresh();
      } else {
        setAddTaskError(result.error);
        setAddTaskStatus('error');
      }
    },
    [newTaskTitle, newTaskCaseId, newTaskStatus, newTaskPriority, newTaskDueDate, newTaskOwner, router]
  );

  const handleAddSupabaseTask = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const name = supabaseTaskName.trim();
      if (!name) return;
      setAddSupabaseTaskStatus('loading');
      setAddSupabaseTaskError(null);
      try {
        const result = await addSupabaseTask(name);
        if (result?.ok) {
          setSupabaseTaskName('');
          setAddSupabaseTaskStatus('idle');
          router.refresh();
        } else {
          setAddSupabaseTaskError(result?.error ?? 'Failed to add task');
          setAddSupabaseTaskStatus('error');
        }
      } catch (_err) {
        setAddSupabaseTaskError('Server error. Check terminal for details.');
        setAddSupabaseTaskStatus('error');
      }
    },
    [supabaseTaskName, router]
  );

  const handleUploadDocument = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      setUploadDocStatus('loading');
      setUploadDocError(null);
      const result = await uploadWorkspaceDocument(formData);
      if (result.ok) {
        setUploadDocStatus('idle');
        form.reset();
        router.refresh();
      } else {
        setUploadDocError(result.error);
        setUploadDocStatus('error');
      }
    },
    [router]
  );

  const bySection = (section: PlannedFeature['section']) =>
    plannedFeatures.filter((f) => f.section === section);

  const tasksByCase = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.caseId ?? 'unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  const mainTabId = (tab: string) => `main-tab-${tab.toLowerCase().replace(' ', '-')}`;
  const mainPanelId = (tab: string) => `main-panel-${tab.toLowerCase().replace(' ', '-')}`;

  const handleMainTabKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const idx = MAIN_TABS.findIndex((tab) => tab.id === mainTab);
      let nextTab: (typeof MAIN_TABS)[number] | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextTab = MAIN_TABS[(idx + 1) % MAIN_TABS.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextTab = MAIN_TABS[(idx - 1 + MAIN_TABS.length) % MAIN_TABS.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextTab = MAIN_TABS[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        nextTab = MAIN_TABS[MAIN_TABS.length - 1];
      }
      if (nextTab) {
        setMainTab(nextTab.id);
        if (nextTab.id !== 'assignments') setSelectedCase(null);
        requestAnimationFrame(() => {
          document.getElementById(mainTabId(nextTab!.id))?.focus();
        });
      }
    },
    [mainTab]
  );

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
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {t('skipToContent')}
      </a>

      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('workspace')}
            </h1>
            <p className="mt-1 text-base text-muted-foreground sm:text-lg">{t('workspaceDesc')}</p>
          </div>

          <nav
            className="mt-6"
            role="tablist"
            aria-label={t('mainNav')}
            onKeyDown={handleMainTabKeyDown}
          >
            <div className="flex flex-wrap gap-2">
              {MAIN_TABS.map((tab) => (
                <Fragment key={tab.id}>
                  {tab.id === 'coming-soon' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/sops">{t('sops')}</Link>
                    </Button>
                  )}
                  <Button
                    id={mainTabId(tab.id)}
                    variant={mainTab === tab.id ? 'default' : 'outline'}
                    size="sm"
                    role="tab"
                    aria-selected={mainTab === tab.id}
                    aria-controls={mainPanelId(tab.id)}
                    tabIndex={mainTab === tab.id ? 0 : -1}
                    onClick={() => {
                      setMainTab(tab.id);
                      if (tab.id !== 'assignments') setSelectedCase(null);
                    }}
                    className="transition-colors duration-150"
                  >
                    {t(tab.labelKey)}
                  </Button>
                </Fragment>
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
        {mainTab === 'assignments' && (
          <section
            id={mainPanelId('assignments')}
            role="tabpanel"
            aria-labelledby={mainTabId('assignments')}
            className={SPACE.section}
          >
            {selectedCase ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCase(null)}
                    aria-label={t('returnToAssignments')}
                    className="transition-colors duration-150"
                  >
                    ← {t('allAssignments')}
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium text-foreground">{selectedCase.client}</span>
                </div>

                <div
                  className="flex flex-wrap gap-2 border-b border-border pb-4"
                  role="tablist"
                  aria-label={t('assignmentSections')}
                >
                  {CASE_TABS.map(({ id, labelKey, icon: Icon }) => (
                    <Button
                      key={id}
                      variant={caseTab === id ? 'secondary' : 'ghost'}
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
                    {caseTab === 'overview' && (
                      <div
                        id="case-panel-overview"
                        role="tabpanel"
                        aria-labelledby="case-tab-overview"
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                      >
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">{t('tasks')}</p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                            {selectedCase.taskCount}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t('documents')}
                          </p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                            {selectedCase.documentCount}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t('lastActivity')}
                          </p>
                          <p className="mt-1 text-lg font-medium text-foreground">
                            {selectedCase.lastActivity}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                          <p className="text-sm font-medium text-muted-foreground">{t('status')}</p>
                          <div className="mt-1">
                            <Badge variant={statusBadgeVariant(selectedCase.status)}>
                              {selectedCase.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    {caseTab === 'contacts' && (
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
                              <th scope="col" className="p-4 font-medium">
                                {t('contact')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('role')}
                              </th>
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
                    {caseTab === 'documents' && (
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
                              <th scope="col" className="p-4 font-medium">
                                {t('document')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('type')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('status')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('approval')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('uploaded')}
                              </th>
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
                    {caseTab === 'tasks' && (
                      <div
                        id="case-panel-tasks"
                        role="tabpanel"
                        aria-labelledby="case-tab-tasks"
                        aria-label={t('tasks')}
                        className="overflow-x-auto rounded-lg border border-border"
                      >
                        <table className="w-full min-w-[600px]" cellPadding={0} cellSpacing={0}>
                          <thead>
                            <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                              <th scope="col" className="p-4 font-medium">
                                {t('task')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('status')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('priority')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('due')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('owner')}
                              </th>
                              <th scope="col" className="p-4 font-medium">
                                {t('waitingOn')}
                              </th>
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
                    {caseTab === 'timeline' && (
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
                      setSelectedCase(c);
                      setCaseTab('overview');
                    }}
                    t={t}
                    tasksLabel={t('tasksCount')}
                    documentsLabel={t('documentsCount')}
                    lastActivityLabel={t('lastActivity')}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {mainTab === 'tasks' && (
          <section
            id={mainPanelId('tasks')}
            role="tabpanel"
            aria-labelledby={mainTabId('tasks')}
            className={SPACE.section}
          >
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label={t('taskViewFilter')}
            >
              <Button
                variant={taskFilter === 'all' ? 'secondary' : 'outline'}
                size="sm"
                aria-pressed={taskFilter === 'all'}
                onClick={() => setTaskFilter('all')}
                className="transition-colors duration-150"
              >
                {t('allTasks')}
              </Button>
              <Button
                variant={taskFilter === 'byCase' ? 'secondary' : 'outline'}
                size="sm"
                aria-pressed={taskFilter === 'byCase'}
                onClick={() => setTaskFilter('byCase')}
                className="transition-colors duration-150"
              >
                {t('byAssignment')}
              </Button>
              <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 gap-1.5">
                    <Plus className="h-4 w-4" />
                    {t('addTask')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('addTask')}</DialogTitle>
                    <DialogDescription>{t('addTaskDescription')}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div>
                      <label htmlFor="new-task-title" className="mb-1.5 block text-sm font-medium">
                        {t('task')}
                      </label>
                      <Input
                        id="new-task-title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder={t('addTaskPlaceholder')}
                        disabled={addTaskStatus === 'loading'}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        {t('assignment')}
                      </label>
                      <Select
                        value={newTaskCaseId ?? 'unassigned'}
                        onValueChange={(v) => setNewTaskCaseId(v === 'unassigned' ? null : v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('unassigned')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">{t('unassigned')}</SelectItem>
                          {assignments.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.client} — {c.serviceType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">{t('status')}</label>
                        <Select
                          value={newTaskStatus}
                          onValueChange={(v) => setNewTaskStatus(v as TaskStatus)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">{t('statusTodo')}</SelectItem>
                            <SelectItem value="in_progress">{t('statusInProgress')}</SelectItem>
                            <SelectItem value="waiting">{t('statusWaiting')}</SelectItem>
                            <SelectItem value="done">{t('statusDone')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">{t('priority')}</label>
                        <Select
                          value={newTaskPriority}
                          onValueChange={(v) => setNewTaskPriority(v as TaskPriority)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">{t('priorityLow')}</SelectItem>
                            <SelectItem value="medium">{t('priorityMedium')}</SelectItem>
                            <SelectItem value="high">{t('priorityHigh')}</SelectItem>
                            <SelectItem value="urgent">{t('priorityUrgent')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">{t('due')}</label>
                        <Input
                          type="date"
                          value={newTaskDueDate}
                          onChange={(e) => setNewTaskDueDate(e.target.value)}
                          disabled={addTaskStatus === 'loading'}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">{t('owner')}</label>
                        <Input
                          value={newTaskOwner}
                          onChange={(e) => setNewTaskOwner(e.target.value)}
                          placeholder="Assistant"
                          disabled={addTaskStatus === 'loading'}
                        />
                      </div>
                    </div>
                    {addTaskError && (
                      <p className="text-sm text-destructive">{addTaskError}</p>
                    )}
                    <DialogFooter showCloseButton={false} className="sm:justify-start">
                      <Button
                        type="submit"
                        disabled={!newTaskTitle.trim() || addTaskStatus === 'loading'}
                      >
                        {addTaskStatus === 'loading' ? '…' : t('addTask')}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('tasks')}</CardTitle>
                <CardDescription>{t('tasksDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="overflow-x-auto rounded-lg border border-border"
                  role="region"
                  aria-label="Tasks table"
                >
                  <table className="w-full min-w-[600px]" cellPadding={0} cellSpacing={0}>
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
                        <th scope="col" className="p-4 font-medium">
                          {t('task')}
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          {t('status')}
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          {t('priority')}
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          {t('due')}
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          {t('owner')}
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          {t('waitingOn')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskFilter === 'all'
                        ? tasks.map((task) => <TaskRow key={task.id} t={task} />)
                        : Object.entries(tasksByCase).map(([caseKey, taskList]) => (
                            <Fragment key={caseKey}>
                              <tr>
                                <td colSpan={6} className="bg-muted/50 p-3 font-medium">
                                  {caseKey === 'unassigned'
                                    ? t('unassigned')
                                    : (assignments.find((c) => c.id === caseKey)?.client ??
                                      caseKey)}
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

        {mainTab === 'coming-soon' && (
          <section
            id={mainPanelId('coming-soon')}
            role="tabpanel"
            aria-labelledby={mainTabId('coming-soon')}
            className={SPACE.section}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('comingSoonTitle')}</CardTitle>
                <CardDescription>{t('comingSoonDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    {t('featureSectionMustHave')}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {bySection('must-have').map((f) => (
                      <FeatureVoteRow
                        key={f.id}
                        id={f.id}
                        label={t(f.labelKey)}
                        votes={f.votes}
                        onVote={handleVote}
                        disabled={votingId === f.id}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    {t('featureSectionBugsIdeas')}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {bySection('bugs-ideas').map((f) => (
                      <FeatureVoteRow
                        key={f.id}
                        id={f.id}
                        label={t(f.labelKey)}
                        votes={f.votes}
                        onVote={handleVote}
                        disabled={votingId === f.id}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    {t('featureSectionFun')}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {bySection('fun').map((f) => (
                      <FeatureVoteRow
                        key={f.id}
                        id={f.id}
                        label={t(f.labelKey)}
                        votes={f.votes}
                        onVote={handleVote}
                        disabled={votingId === f.id}
                      />
                    ))}
                  </div>
                </div>
                {userSuggestions.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      {t('featureUserSuggestion')}
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {userSuggestions.map((s) => (
                        <FeatureVoteRow
                          key={s.id}
                          id={s.id}
                          label={s.text}
                          votes={s.votes}
                          onVote={handleVote}
                          disabled={votingId === s.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-t border-border pt-6">
                  <form onSubmit={handleSubmitSuggestion} className="flex flex-col gap-3">
                    <label htmlFor="feature-suggestion" className="text-sm font-medium">
                      {t('featureSuggestLabel')}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="feature-suggestion"
                        value={suggestionText}
                        onChange={(e) => {
                          setSuggestionText(e.target.value);
                          setSuggestionStatus('idle');
                          setSuggestionError(null);
                        }}
                        placeholder={t('featureSuggestPlaceholder')}
                        maxLength={500}
                        disabled={suggestionStatus === 'loading'}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={suggestionStatus === 'loading' || !suggestionText.trim()}>
                        {suggestionStatus === 'loading' ? t('submitting') : t('featureSuggestSubmit')}
                      </Button>
                    </div>
                    {suggestionError && (
                      <p className="text-sm text-destructive">{suggestionError}</p>
                    )}
                  </form>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <section className="mt-8" aria-label={t('developerTools')}>
          <Card className="border-dashed border-muted-foreground/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('developerTools')}</CardTitle>
              <CardDescription>{t('devTestPageDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dev-test">{t('devTestPageLink')}</Link>
              </Button>

              <div className="border-t border-border pt-4" aria-label="My tasks (Supabase RLS)">
                <h3 className="text-sm font-semibold text-foreground mb-1">My tasks (Supabase RLS)</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Tasks stored in Supabase with Row Level Security — only your tasks are visible.
                </p>
                {supabaseTasksError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive mb-3">
                    {supabaseTasksError}
                  </p>
                )}
                <form onSubmit={handleAddSupabaseTask} className="flex gap-2">
                  <Input
                    type="text"
                    value={supabaseTaskName}
                    onChange={(e) => {
                      setSupabaseTaskName(e.target.value);
                      setAddSupabaseTaskError(null);
                    }}
                    placeholder="New task name"
                    disabled={addSupabaseTaskStatus === 'loading'}
                    className="max-w-xs"
                    aria-label="Task name"
                  />
                  <Button
                    type="submit"
                    disabled={!supabaseTaskName.trim() || addSupabaseTaskStatus === 'loading'}
                  >
                    {addSupabaseTaskStatus === 'loading' ? '…' : 'Add'}
                  </Button>
                </form>
                {addSupabaseTaskError && addSupabaseTaskError !== supabaseTasksError && (
                  <p className="text-sm text-destructive mt-2">{addSupabaseTaskError}</p>
                )}
                {supabaseTasks.length === 0 && !supabaseTasksError && (
                  <p className="text-sm text-muted-foreground mt-2">No tasks yet. Add one above.</p>
                )}
                {supabaseTasks.length > 0 && (
                  <ul className="divide-y divide-border rounded-lg border border-border mt-3">
                    {supabaseTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <span className="font-medium">{task.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-border pt-4" aria-label="My documents">
                <h3 className="text-sm font-semibold text-foreground mb-1">My documents</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload a document. Stored per user (RLS) — use to test data isolation.
                </p>
                {workspaceDocumentsError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive mb-3">
                    {workspaceDocumentsError}
                  </p>
                )}
                <form onSubmit={handleUploadDocument} className="flex flex-wrap items-end gap-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="workspace-doc-file" className="text-sm font-medium">
                      File (optional — name is stored)
                    </label>
                    <Input
                      id="workspace-doc-file"
                      type="file"
                      name="file"
                      accept=".pdf,.doc,.docx,.txt,image/*"
                      disabled={uploadDocStatus === 'loading'}
                      className="max-w-xs"
                      aria-label="Choose file"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={uploadDocStatus === 'loading'}
                    className="gap-1.5"
                  >
                    <Upload className="h-4 w-4" aria-hidden />
                    {uploadDocStatus === 'loading' ? '…' : 'Upload'}
                  </Button>
                </form>
                {uploadDocError && uploadDocError !== workspaceDocumentsError && (
                  <p className="text-sm text-destructive mt-2">{uploadDocError}</p>
                )}
                {workspaceDocuments.length === 0 && !workspaceDocumentsError && (
                  <p className="text-sm text-muted-foreground mt-2">No documents yet. Upload one above.</p>
                )}
                {workspaceDocuments.length > 0 && (
                  <ul className="divide-y divide-border rounded-lg border border-border mt-3">
                    {workspaceDocuments.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                      >
                        <span className="font-medium">{doc.filename}</span>
                        <span className="text-xs text-muted-foreground">
                          {doc.file_size != null ? `${(doc.file_size / 1024).toFixed(1)} KB` : ''}
                          {doc.file_size != null && doc.created_at ? ' · ' : ''}
                          {doc.created_at ? new Date(doc.created_at).toLocaleString() : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
