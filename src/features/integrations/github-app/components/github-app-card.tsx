"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GitBranch,
  Loader2,
  Lock,
  RefreshCw,
  X,
} from "lucide-react";
import { useState } from "react";
import { useBootstrap } from "@/features/app/hooks/use-bootstrap";
import { useGithubAppConnect, useGithubAppSync } from "@/features/integrations/github-app/hooks/use-github-app-actions";
import { useGithubAppInstallations } from "@/features/integrations/github-app/hooks/use-github-app-installations";
import {
  useGithubAppRedirectStatus,
  type GithubAppRedirectStatus,
} from "@/features/integrations/github-app/hooks/use-github-app-redirect-status";
import type { GithubAppInstallation } from "@/features/integrations/github-app/types/github-app";

export function GithubAppCard() {
  const bootstrap = useBootstrap();
  const isAdmin = bootstrap.data?.user?.role === "admin";

  const installations = useGithubAppInstallations();
  const connect = useGithubAppConnect();
  const redirectStatus = useGithubAppRedirectStatus();

  const hasInstallations = (installations.data?.length ?? 0) > 0;

  return (
    <article className="flex flex-col rounded-2xl border border-[#202a3f] bg-[#111827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)] xl:col-span-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#263149] bg-[#172033] text-[#eef3ff]">
            <GitBranch aria-hidden size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-normal text-[#f8fafc]">GitHub App</h2>
            <p className="mt-2 max-w-md text-[15px] leading-6 text-[#9ca3af]">
              Install the TruthStride GitHub App to sync branches, pull requests, and merges from the
              repositories you choose.
            </p>
          </div>
        </div>

        {hasInstallations && isAdmin ? (
          <button
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#263149] bg-[#172033] px-4 text-sm font-medium text-[#cbd5e1] transition hover:bg-[#1c2740] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={connect.isPending}
            onClick={() => connect.mutate(undefined)}
            type="button"
          >
            {connect.isPending ? <Loader2 aria-hidden className="animate-spin" size={16} /> : null}
            Add account
          </button>
        ) : null}
      </div>

      {redirectStatus.result ? (
        <RedirectBanner onDismiss={redirectStatus.dismiss} result={redirectStatus.result} />
      ) : null}

      {connect.isError ? <ErrorBanner message={getErrorMessage(connect.error)} /> : null}

      <div className="mt-6">
        {installations.isLoading ? (
          <p className="text-sm text-[#9ca3af]">Loading installations...</p>
        ) : installations.isError ? (
          <ErrorBanner message={getErrorMessage(installations.error)} />
        ) : hasInstallations && installations.data ? (
          <div className="space-y-4">
            {installations.data.map((installation) => (
              <InstallationRow installation={installation} isAdmin={isAdmin} key={installation.id} />
            ))}
          </div>
        ) : (
          <EmptyState isAdmin={isAdmin} isPending={connect.isPending} onConnect={() => connect.mutate(undefined)} />
        )}
      </div>
    </article>
  );
}

function EmptyState({
  isAdmin,
  isPending,
  onConnect,
}: {
  isAdmin: boolean;
  isPending: boolean;
  onConnect: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#263149] bg-[#0d1420] p-6 text-center">
      <p className="text-sm leading-6 text-[#9ca3af]">
        No GitHub accounts connected yet.{" "}
        {isAdmin
          ? "Install the app and pick the repositories TruthStride should track."
          : "Ask an organization admin to connect GitHub."}
      </p>
      {isAdmin ? (
        <button
          className="mx-auto mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4f82f6] px-5 text-sm font-medium text-white transition hover:bg-[#416fe1] disabled:cursor-not-allowed disabled:bg-[#3b5fa9]"
          disabled={isPending}
          onClick={onConnect}
          type="button"
        >
          {isPending ? <Loader2 aria-hidden className="animate-spin" size={16} /> : null}
          Connect GitHub
        </button>
      ) : null}
    </div>
  );
}

function InstallationRow({
  installation,
  isAdmin,
}: {
  installation: GithubAppInstallation;
  isAdmin: boolean;
}) {
  const [showAllRepos, setShowAllRepos] = useState(false);
  const sync = useGithubAppSync();

  const repositories = installation.repositories ?? [];
  const visibleRepositories = showAllRepos ? repositories : repositories.slice(0, 4);
  const remainingCount = repositories.length - visibleRepositories.length;

  return (
    <div className="rounded-xl border border-[#202a3f] bg-[#0d1420] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-[#27406f] bg-[#172348] text-sm font-semibold text-[#82a8ff]">
            {installation.accountLogin.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[15px] font-medium text-[#f8fafc]">{installation.accountLogin}</p>
            <p className="text-xs text-[#8d96a6]">
              {installation.accountType ?? "Account"} - {repositories.length}{" "}
              {repositories.length === 1 ? "repository" : "repositories"}
            </p>
          </div>
          <StatusBadge status={installation.status} />
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[#263149] px-3 text-xs font-medium text-[#cbd5e1] transition hover:bg-[#172033] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={sync.isPending}
              onClick={() => sync.mutate(installation.id)}
              type="button"
            >
              {sync.isPending ? (
                <Loader2 aria-hidden className="animate-spin" size={14} />
              ) : (
                <RefreshCw aria-hidden size={14} />
              )}
              Sync
            </button>
          ) : null}
          <a
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#263149] px-3 text-xs font-medium text-[#cbd5e1] transition hover:bg-[#172033]"
            href={`https://github.com/settings/installations/${installation.githubInstallationId}`}
            rel="noreferrer"
            target="_blank"
          >
            Manage on GitHub
            <ExternalLink aria-hidden size={13} />
          </a>
        </div>
      </div>

      {sync.isError ? <ErrorBanner message={getErrorMessage(sync.error)} /> : null}

      {repositories.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleRepositories.map((repository) => (
            <span
              className="flex items-center gap-1.5 rounded-lg border border-[#263149] bg-[#111827] px-2.5 py-1 text-xs text-[#cbd5e1]"
              key={repository.id}
            >
              {repository.isPrivate ? <Lock aria-hidden size={11} /> : null}
              {repository.fullName}
            </span>
          ))}
          {remainingCount > 0 ? (
            <button
              className="flex items-center gap-1 rounded-lg border border-[#263149] bg-[#111827] px-2.5 py-1 text-xs text-[#8d96a6] transition hover:text-[#f8fafc]"
              onClick={() => setShowAllRepos(true)}
              type="button"
            >
              +{remainingCount} more
              <ChevronDown aria-hidden size={12} />
            </button>
          ) : null}
          {showAllRepos && repositories.length > 4 ? (
            <button
              className="flex items-center gap-1 rounded-lg border border-[#263149] bg-[#111827] px-2.5 py-1 text-xs text-[#8d96a6] transition hover:text-[#f8fafc]"
              onClick={() => setShowAllRepos(false)}
              type="button"
            >
              Show less
              <ChevronUp aria-hidden size={12} />
            </button>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-xs text-[#8d96a6]">
          No repositories granted yet. Use &quot;Manage on GitHub&quot; to select repositories.
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "border-[#235a42] bg-[#10251d] text-[#9ee5be]",
    deleted: "border-[#71333f] bg-[#2a131a] text-[#ffb4c1]",
    suspended: "border-[#5a4a23] bg-[#251d10] text-[#e5c99e]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
        styles[status] ?? "border-[#3b465a] bg-[#182031] text-[#9ca3af]"
      }`}
    >
      {status}
    </span>
  );
}

function RedirectBanner({
  onDismiss,
  result,
}: {
  onDismiss: () => void;
  result: GithubAppRedirectStatus;
}) {
  const isSuccess = result.status === "success";

  return (
    <div
      className={`mt-5 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${
        isSuccess
          ? "border-[#235a42] bg-[#10251d] text-[#9ee5be]"
          : "border-[#71333f] bg-[#2a131a] text-[#ffb4c1]"
      }`}
    >
      <div className="flex items-start gap-2">
        {isSuccess ? (
          <CheckCircle2 aria-hidden className="mt-0.5 shrink-0" size={16} />
        ) : (
          <AlertTriangle aria-hidden className="mt-0.5 shrink-0" size={16} />
        )}
        <span>
          {isSuccess
            ? "GitHub App installation saved. Repositories are synced below."
            : result.message || "GitHub App installation could not be completed."}
        </span>
      </div>
      <button
        className="shrink-0 text-current opacity-70 transition hover:opacity-100"
        onClick={onDismiss}
        type="button"
      >
        <X aria-hidden size={16} />
      </button>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#71333f] bg-[#2a131a] px-4 py-3 text-sm leading-6 text-[#ffb4c1]">
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
