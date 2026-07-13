"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, GitBranch, Loader2, TicketCheck, X } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { bootstrapQueryKey } from "@/features/app/hooks/use-bootstrap";
import { getBootstrap } from "@/features/app/api/bootstrap-api";
import {
  connectOnboardingGithub,
  connectOnboardingJira,
  createOnboardingProject,
} from "@/features/onboarding/api/onboarding-api";
import type { OnboardingState } from "@/features/onboarding/types/onboarding";

type OnboardingModalProps = {
  onboarding: OnboardingState;
  onClose: () => void;
  onComplete?: () => void;
};

const stepLabels = {
  "connect-github": "Connect GitHub",
  "connect_github": "Connect GitHub",
  "connect-jira": "Connect Jira",
  "connect_jira": "Connect Jira",
  "connectGithub": "Connect GitHub",
  "connectJira": "Connect Jira",
  "create-project": "Create Project",
  "create_project": "Create Project",
  "createProject": "Create Project",
  "github": "Connect GitHub",
  "jira": "Connect Jira",
  "project": "Create Project",
} as const;

const stepAliases = {
  github: ["connect-github", "connect_github", "connectGithub", "github"],
  jira: ["connect-jira", "connect_jira", "connectJira", "jira"],
  project: ["create-project", "create_project", "createProject", "project"],
} as const;

export function OnboardingModal({ onboarding, onClose, onComplete }: OnboardingModalProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [mutationOnboarding, setMutationOnboarding] = useState<OnboardingState | null>(null);
  const activeOnboarding = mutationOnboarding ?? onboarding;

  const projectMutation = useMutation({
    mutationFn: createOnboardingProject,
    onSuccess: refreshOnboardingState,
  });

  const jiraMutation = useMutation({
    mutationFn: connectOnboardingJira,
    onSuccess: refreshOnboardingState,
  });

  const githubMutation = useMutation({
    mutationFn: connectOnboardingGithub,
    onSuccess: refreshOnboardingState,
  });

  async function refreshOnboardingState() {
    const response = await getBootstrap();
    queryClient.setQueryData(bootstrapQueryKey, response);
    setMutationOnboarding(response.onboarding);
    await queryClient.invalidateQueries({ queryKey: bootstrapQueryKey });
    await queryClient.invalidateQueries({ queryKey: ["dashboard", "setup-status"] });
    handlePossibleCompletion(response.onboarding);
  }

  const isPending = projectMutation.isPending || jiraMutation.isPending || githubMutation.isPending;

  function handlePossibleCompletion(nextOnboarding: OnboardingState) {
    if (nextOnboarding.completed) {
      onComplete?.();
      onClose();
    }
  }

  async function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("projectName") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!name) {
      setError("Project name is required.");
      return;
    }

    projectMutation.mutate({ description, name }, { onError: (caught) => setError(getErrorMessage(caught)) });
  }

  async function handleJiraSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const jiraUrl = String(formData.get("jiraUrl") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const apiToken = String(formData.get("apiToken") ?? "").trim();

    if (!jiraUrl || !email || !apiToken) {
      setError("Jira URL, email, and API token are required.");
      return;
    }

    jiraMutation.mutate(
      { apiToken, email, jiraUrl },
      { onError: (caught) => setError(getErrorMessage(caught)) },
    );
  }

  async function handleGithubSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const personalAccessToken = String(formData.get("personalAccessToken") ?? "").trim();

    if (!personalAccessToken) {
      setError("GitHub personal access token is required.");
      return;
    }

    githubMutation.mutate(
      { accessToken: personalAccessToken },
      { onError: (caught) => setError(getErrorMessage(caught)) },
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#03070d]/80 px-4 py-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#202b42] bg-[#0f1624] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#202b42] px-6 py-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#7f8ca3]">
              Quick setup
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#f8fafc]">
              {stepLabels[activeOnboarding.currentStep as keyof typeof stepLabels] ?? "Finish setup"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#9ca3af]">
              Skip any step. The dashboard remains available and reminders will stay visible.
            </p>
          </div>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#263149] text-[#9ca3af] transition hover:bg-[#172033] hover:text-[#f8fafc]"
            onClick={onClose}
            title="Skip onboarding"
            type="button"
          >
            <X aria-hidden size={18} />
          </button>
        </header>

        <div className="grid gap-6 p-6 lg:grid-cols-[170px_minmax(0,1fr)]">
          <ProgressRail onboarding={activeOnboarding} />

          <div>
            {isCurrentStep(activeOnboarding.currentStep, "project") ? (
              <ProjectStep isPending={isPending} onSubmit={handleProjectSubmit} onSkip={onClose} />
            ) : null}

            {isCurrentStep(activeOnboarding.currentStep, "jira") ? (
              <JiraStep isPending={isPending} onSubmit={handleJiraSubmit} onSkip={onClose} />
            ) : null}

            {isCurrentStep(activeOnboarding.currentStep, "github") ? (
              <GithubStep isPending={isPending} onSubmit={handleGithubSubmit} onSkip={onClose} />
            ) : null}

            {!isKnownStep(activeOnboarding.currentStep) ? (
              <div className="rounded-2xl border border-[#202b42] bg-[#111827] p-5">
                <CheckCircle2 aria-hidden className="text-[#9ee5be]" size={28} />
                <h3 className="mt-4 text-lg font-semibold text-[#f8fafc]">Setup status loaded</h3>
                <p className="mt-2 text-sm leading-6 text-[#9ca3af]">
                  Backend returned step &quot;{activeOnboarding.currentStep}&quot;. Add a UI handler when this step is ready.
                </p>
                <button
                  className="mt-5 h-10 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white transition hover:bg-[#416fe1]"
                  onClick={onClose}
                  type="button"
                >
                  Continue to dashboard
                </button>
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-xl border border-[#71333f] bg-[#2a131a] px-4 py-3 text-sm text-[#ffb4c1]">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgressRail({ onboarding }: { onboarding: OnboardingState }) {
  const items = [
    { complete: onboarding.steps.projectCreated, label: "Project" },
    { complete: onboarding.steps.jiraConnected, label: "Jira" },
    { complete: onboarding.steps.githubConnected, label: "GitHub" },
  ];

  return (
    <aside className="rounded-2xl border border-[#202b42] bg-[#111827] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#7f8ca3]">Progress</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div className="flex items-center gap-3 text-sm" key={item.label}>
            <span
              className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${
                item.complete
                  ? "border-[#235a42] bg-[#10251d] text-[#9ee5be]"
                  : "border-[#3b465a] bg-[#182031] text-[#9ca3af]"
              }`}
            >
              {item.complete ? "✓" : ""}
            </span>
            <span className={item.complete ? "text-[#f8fafc]" : "text-[#9ca3af]"}>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ProjectStep({
  isPending,
  onSkip,
  onSubmit,
}: {
  isPending: boolean;
  onSkip: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <StepIntro
        description="Start with the first product, app, or repository group you want TruthStride to track."
        title="Create Project"
      />
      <TextField label="Project Name" name="projectName" placeholder="Customer portal" />
      <TextArea label="Description" name="description" placeholder="Track delivery work for the customer portal." />
      <StepActions isPending={isPending} primaryLabel="Continue" onSkip={onSkip} />
    </form>
  );
}

function JiraStep({
  isPending,
  onSkip,
  onSubmit,
}: {
  isPending: boolean;
  onSkip: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <StepIntro
        description="Connect Jira so ticket activity can be matched against engineering activity."
        icon={<TicketCheck aria-hidden size={22} />}
        title="Connect Jira"
      />
      <TextField label="Jira URL" name="jiraUrl" placeholder="https://company.atlassian.net" />
      <TextField label="Email" name="email" placeholder="you@company.com" type="email" />
      <TextField label="API Token" name="apiToken" placeholder="Paste Jira API token" type="password" />
      <StepActions isPending={isPending} primaryLabel="Connect" onSkip={onSkip} />
    </form>
  );
}

function GithubStep({
  isPending,
  onSkip,
  onSubmit,
}: {
  isPending: boolean;
  onSkip: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <StepIntro
        description="Connect GitHub so TruthStride can track branches, pull requests, reviews, and merges."
        icon={<GitBranch aria-hidden size={22} />}
        title="Connect GitHub"
      />
      <TextField
        label="GitHub Personal Access Token"
        name="personalAccessToken"
        placeholder="Paste GitHub token"
        type="password"
      />
      <StepActions isPending={isPending} primaryLabel="Connect" onSkip={onSkip} />
    </form>
  );
}

function StepIntro({
  description,
  icon,
  title,
}: {
  description: string;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <div>
      {icon ? (
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl border border-[#263149] bg-[#172033] text-[#82a8ff]">
          {icon}
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-[#f8fafc]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#9ca3af]">{description}</p>
    </div>
  );
}

function TextField({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-medium text-[#f1f5f9]">{label}</span>
      <input
        className="h-11 w-full rounded-xl border border-[#243047] bg-[#172033] px-3.5 text-[15px] text-[#f8fafc] outline-none placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function TextArea({ label, name, placeholder }: { label: string; name: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-medium text-[#f1f5f9]">{label}</span>
      <textarea
        className="min-h-24 w-full resize-none rounded-xl border border-[#243047] bg-[#172033] px-3.5 py-3 text-[15px] text-[#f8fafc] outline-none placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
        name={name}
        placeholder={placeholder}
      />
    </label>
  );
}

function StepActions({
  isPending,
  onSkip,
  primaryLabel,
}: {
  isPending: boolean;
  onSkip: () => void;
  primaryLabel: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
      <button
        className="h-10 rounded-xl border border-[#263149] px-4 text-sm font-medium text-[#cbd5e1] transition hover:bg-[#172033]"
        onClick={onSkip}
        type="button"
      >
        Skip
      </button>
      <button
        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white transition hover:bg-[#416fe1] disabled:cursor-not-allowed disabled:bg-[#3b5fa9] disabled:text-white/70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? <Loader2 aria-hidden className="animate-spin" size={17} /> : null}
        {primaryLabel}
        {!isPending ? <ArrowRight aria-hidden size={17} /> : null}
      </button>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Setup failed. Please try again.";
}

function isCurrentStep(currentStep: string, step: keyof typeof stepAliases) {
  return (stepAliases[step] as readonly string[]).includes(currentStep);
}

function isKnownStep(currentStep: string) {
  return Object.values(stepAliases).some((aliases) =>
    (aliases as readonly string[]).includes(currentStep),
  );
}
