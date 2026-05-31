"use client";

import { useRouter } from "next/navigation";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { OverviewDashboard } from "@/features/dashboard/components/overview-dashboard";
import { SetupReminderCard } from "@/features/dashboard/components/setup-reminder-card";
import { OnboardingModal } from "@/features/onboarding/components/onboarding-modal";
import { useBootstrap } from "@/features/app/hooks/use-bootstrap";
import { useSetupStatus } from "@/features/dashboard/hooks/use-setup-status";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";

export function DashboardApp() {
  const router = useRouter();
  const bootstrap = useBootstrap();
  const setupStatus = useSetupStatus();
  const onboardingState = bootstrap.data?.onboarding;
  const onboarding = useOnboarding(onboardingState);
  const workspaceLabel =
    bootstrap.data?.organization?.name ??
    bootstrap.data?.organization?.orgId ??
    "Workspace";

  return (
    <DashboardShell basePath="/dashboard" workspaceLabel={workspaceLabel}>
      <OverviewDashboard
        setupReminder={
          setupStatus.data ? (
            <SetupReminderCard setupStatus={setupStatus.data} onResume={onboarding.open} />
          ) : bootstrap.isError ? (
            <BootstrapWarning />
          ) : null
        }
      />

      {bootstrap.isLoading ? <BootstrapLoading /> : null}

      {onboarding.isOpen && onboardingState ? (
        <OnboardingModal
          onboarding={onboardingState}
          onClose={onboarding.close}
          onComplete={() => {
            onboarding.close();
            router.replace(onboardingState.redirectTo || "/dashboard");
          }}
        />
      ) : null}
    </DashboardShell>
  );
}

function BootstrapLoading() {
  return (
    <div className="fixed bottom-4 right-4 rounded-xl border border-[#202a3f] bg-[#111827] px-4 py-3 text-sm text-[#9ca3af] shadow-lg">
      Loading workspace status...
    </div>
  );
}

function BootstrapWarning() {
  return (
    <section className="rounded-2xl border border-[#71333f] bg-[#2a131a] p-5 text-sm leading-6 text-[#ffb4c1]">
      Unable to load setup status from bootstrap. Dashboard is available, but onboarding reminders cannot be shown until the API responds.
    </section>
  );
}
