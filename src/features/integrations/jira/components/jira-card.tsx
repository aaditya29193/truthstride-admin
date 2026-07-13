"use client";

import { AlertTriangle, CheckCircle2, Loader2, TicketCheck } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { useBootstrap } from "@/features/app/hooks/use-bootstrap";
import { useIntegrations } from "@/features/integrations/jira/hooks/use-integrations";
import { useConnectJira } from "@/features/integrations/jira/hooks/use-jira-actions";
import type { JiraIntegration } from "@/features/integrations/jira/types/jira";

export function JiraCard() {
  const bootstrap = useBootstrap();
  const isAdmin = bootstrap.data?.user?.role === "admin";

  const integrations = useIntegrations();
  const connect = useConnectJira();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const jiraIntegration = integrations.data?.find((integration) => integration.tool === "jira");
  const isConnected = Boolean(jiraIntegration?.isActive);
  const canToggleForm = isAdmin && !integrations.isLoading && !integrations.isError;

  return (
    <article className="flex flex-col rounded-2xl border border-[#202a3f] bg-[#111827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#263149] bg-[#172033] text-[#eef3ff]">
            <TicketCheck aria-hidden size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-normal text-[#f8fafc]">Jira</h2>
            <p className="mt-2 max-w-md text-[15px] leading-6 text-[#9ca3af]">
              Sync ticket statuses and link them to Git activity.
            </p>
          </div>
        </div>

        {canToggleForm ? (
          <button
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#263149] bg-[#172033] px-4 text-sm font-medium text-[#cbd5e1] transition hover:bg-[#1c2740]"
            onClick={() => setIsFormOpen((current) => !current)}
            type="button"
          >
            {isConnected ? "Edit connection" : "Connect Jira"}
          </button>
        ) : null}
      </div>

      <div className="mt-6">
        {integrations.isLoading ? (
          <p className="text-sm text-[#9ca3af]">Loading Jira connection...</p>
        ) : integrations.isError ? (
          <ErrorBanner message={getErrorMessage(integrations.error)} />
        ) : isConnected && jiraIntegration ? (
          <ConnectedSummary integration={jiraIntegration} />
        ) : (
          <p className="text-sm leading-6 text-[#9ca3af]">
            Not connected yet.{" "}
            {isAdmin
              ? "Connect Jira so ticket activity can be matched against engineering activity."
              : "Ask an organization admin to connect Jira."}
          </p>
        )}

        {isFormOpen && isAdmin ? (
          <JiraForm
            connect={connect}
            defaultValues={jiraIntegration?.details}
            onSuccess={() => setIsFormOpen(false)}
          />
        ) : null}
      </div>
    </article>
  );
}

function ConnectedSummary({ integration }: { integration: JiraIntegration }) {
  return (
    <div className="rounded-xl border border-[#235a42] bg-[#10251d] p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[#9ee5be]">
        <CheckCircle2 aria-hidden size={16} />
        Connected
      </div>
      <dl className="mt-3 space-y-1.5 text-xs text-[#cbd5e1]">
        <div className="flex gap-2">
          <dt className="shrink-0 text-[#8d96a6]">Site</dt>
          <dd className="truncate">{integration.details.baseUrl}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-[#8d96a6]">Account</dt>
          <dd className="truncate">{integration.details.email}</dd>
        </div>
        {integration.details.projectKey ? (
          <div className="flex gap-2">
            <dt className="shrink-0 text-[#8d96a6]">Project</dt>
            <dd className="truncate">{integration.details.projectKey}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

function JiraForm({
  connect,
  defaultValues,
  onSuccess,
}: {
  connect: ReturnType<typeof useConnectJira>;
  defaultValues?: JiraIntegration["details"];
  onSuccess: () => void;
}) {
  const isEditing = Boolean(defaultValues);
  const [jiraUrl, setJiraUrl] = useState(defaultValues?.baseUrl ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [apiToken, setApiToken] = useState("");
  const [projectKey, setProjectKey] = useState(defaultValues?.projectKey ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUrl = jiraUrl.trim();
    const trimmedEmail = email.trim();
    const trimmedToken = apiToken.trim();

    if (!trimmedUrl || !trimmedEmail || !trimmedToken) {
      return;
    }

    connect.mutate(
      {
        apiToken: trimmedToken,
        email: trimmedEmail,
        jiraUrl: trimmedUrl,
        projectKey: projectKey.trim() || undefined,
      },
      { onSuccess },
    );
  }

  return (
    <form
      className="mt-4 space-y-4 rounded-xl border border-[#202a3f] bg-[#0d1420] p-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Jira URL"
          onChange={setJiraUrl}
          placeholder="https://company.atlassian.net"
          value={jiraUrl}
        />
        <TextField
          label="Email"
          onChange={setEmail}
          placeholder="you@company.com"
          type="email"
          value={email}
        />
        <TextField
          label="API Token"
          onChange={setApiToken}
          placeholder={isEditing ? "Re-enter to save changes" : "Paste your Jira API token"}
          type="password"
          value={apiToken}
        />
        <TextField
          label="Project Key (optional)"
          onChange={setProjectKey}
          placeholder="PROJ"
          value={projectKey}
        />
      </div>

      {connect.isError ? <ErrorBanner message={getErrorMessage(connect.error)} /> : null}

      <div className="flex justify-end">
        <button
          className="flex h-10 items-center gap-2 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white transition hover:bg-[#416fe1] disabled:cursor-not-allowed disabled:bg-[#3b5fa9]"
          disabled={connect.isPending || !jiraUrl.trim() || !email.trim() || !apiToken.trim()}
          type="submit"
        >
          {connect.isPending ? <Loader2 aria-hidden className="animate-spin" size={16} /> : null}
          Save
        </button>
      </div>
    </form>
  );
}

function TextField({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#f1f5f9]">{label}</span>
      <input
        className="h-10 w-full rounded-xl border border-[#243047] bg-[#172033] px-3 text-sm text-[#f8fafc] outline-none placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
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
