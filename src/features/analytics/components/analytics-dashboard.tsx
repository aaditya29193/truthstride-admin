"use client";

import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { useBootstrap } from "@/features/app/hooks/use-bootstrap";
import { useProjects } from "@/features/projects/hooks/use-projects";
import {
  CommitActivityChart,
  PullRequestThroughputChart,
  TicketFlowChart,
} from "@/features/analytics/components/analytics-charts";
import {
  useCommitAnalytics,
  usePullRequestAnalytics,
  useTicketAnalytics,
} from "@/features/analytics/hooks/use-analytics";
import { useSyncStatus, useTriggerSync } from "@/features/analytics/hooks/use-sync";
import type { SyncRun } from "@/features/analytics/types/analytics";

const RANGE_DAYS = 90;

export function AnalyticsDashboard() {
  const bootstrap = useBootstrap();
  const isAdmin = bootstrap.data?.user?.role === "admin";

  const projects = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const activeProjectId = selectedProjectId ?? projects.data?.[0]?.id;

  const commits = useCommitAnalytics(activeProjectId, RANGE_DAYS);
  const pullRequests = usePullRequestAnalytics(activeProjectId, RANGE_DAYS);
  const tickets = useTicketAnalytics(activeProjectId, RANGE_DAYS);

  const githubSync = useSyncStatus(activeProjectId, "github");
  const jiraSync = useSyncStatus(activeProjectId, "jira");
  const triggerSync = useTriggerSync(activeProjectId);

  return (
    <main className="min-w-0">
      <DashboardPageHeader
        description="Commit, pull request, and ticket activity for a project."
        title="Analytics"
      />

      <section className="space-y-6 px-5 py-8 sm:px-8 lg:px-10">
        {projects.isLoading ? (
          <p className="text-sm text-[#9ca3af]">Loading projects...</p>
        ) : projects.isError ? (
          <ErrorBanner message={getErrorMessage(projects.error)} />
        ) : !projects.data?.length ? (
          <p className="text-sm leading-6 text-[#9ca3af]">
            Create a project on the Projects page to see analytics here.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3">
                <span className="text-sm text-[#9ca3af]">Project</span>
                <select
                  className="h-10 rounded-xl border border-[#243047] bg-[#172033] px-3 text-sm text-[#f8fafc] outline-none focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
                  onChange={(event) => setSelectedProjectId(event.target.value)}
                  value={activeProjectId ?? ""}
                >
                  {projects.data.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              {isAdmin ? (
                <div className="flex flex-wrap items-center gap-3">
                  <SyncButton
                    label="Sync GitHub history"
                    onTrigger={() => triggerSync.mutate("github")}
                    pending={triggerSync.isPending && triggerSync.variables === "github"}
                    syncRun={githubSync.data}
                  />
                  <SyncButton
                    label="Sync Jira history"
                    onTrigger={() => triggerSync.mutate("jira")}
                    pending={triggerSync.isPending && triggerSync.variables === "jira"}
                    syncRun={jiraSync.data}
                  />
                </div>
              ) : null}
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <ChartPanel title="Commit activity">
                {commits.isLoading ? (
                  <ChartLoading />
                ) : commits.isError ? (
                  <ErrorBanner message={getErrorMessage(commits.error)} />
                ) : (
                  <CommitActivityChart
                    series={commits.data?.series ?? []}
                    total={commits.data?.total ?? 0}
                  />
                )}
              </ChartPanel>

              <ChartPanel title="Pull requests">
                {pullRequests.isLoading ? (
                  <ChartLoading />
                ) : pullRequests.isError ? (
                  <ErrorBanner message={getErrorMessage(pullRequests.error)} />
                ) : (
                  <PullRequestThroughputChart
                    avgTimeToMergeHours={pullRequests.data?.avgTimeToMergeHours ?? null}
                    merged={pullRequests.data?.merged ?? []}
                    opened={pullRequests.data?.opened ?? []}
                  />
                )}
              </ChartPanel>

              <ChartPanel title="Ticket flow">
                {tickets.isLoading ? (
                  <ChartLoading />
                ) : tickets.isError ? (
                  <ErrorBanner message={getErrorMessage(tickets.error)} />
                ) : (
                  <TicketFlowChart
                    avgCycleTimeHours={tickets.data?.avgCycleTimeHours ?? null}
                    byStatus={tickets.data?.byStatus ?? []}
                    created={tickets.data?.created ?? []}
                    resolved={tickets.data?.resolved ?? []}
                  />
                )}
              </ChartPanel>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function ChartPanel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <article className="rounded-2xl border border-[#202a3f] bg-[#111827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
      <h2 className="mb-4 text-lg font-semibold text-[#f8fafc]">{title}</h2>
      {children}
    </article>
  );
}

function ChartLoading() {
  return <p className="text-sm text-[#9ca3af]">Loading...</p>;
}

function SyncButton({
  label,
  onTrigger,
  pending,
  syncRun,
}: {
  label: string;
  onTrigger: () => void;
  pending: boolean;
  syncRun: SyncRun | null | undefined;
}) {
  const isRunning = pending || syncRun?.status === "running";

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className="flex h-10 items-center gap-2 rounded-xl border border-[#263149] bg-[#172033] px-4 text-sm font-medium text-[#cbd5e1] transition hover:bg-[#1c2740] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isRunning}
        onClick={onTrigger}
        type="button"
      >
        {isRunning ? (
          <Loader2 aria-hidden className="animate-spin" size={16} />
        ) : (
          <RefreshCw aria-hidden size={16} />
        )}
        {isRunning ? "Syncing..." : label}
      </button>
      {syncRun?.status === "completed" ? (
        <span className="text-xs text-[#9ca3af]">Synced {syncRun.itemsSynced} items</span>
      ) : null}
      {syncRun?.status === "failed" ? (
        <span className="text-xs text-[#ffb4c1]">{syncRun.errorMessage || "Sync failed"}</span>
      ) : null}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-[#71333f] bg-[#2a131a] px-4 py-3 text-sm leading-6 text-[#ffb4c1]">
      <AlertTriangle aria-hidden className="mt-0.5 shrink-0" size={16} />
      {message}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
