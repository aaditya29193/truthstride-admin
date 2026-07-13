import { Suspense } from "react";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { IntegrationsDashboard } from "@/features/dashboard/components/integrations-dashboard";

export default function DashboardIntegrationsPage() {
  return (
    <DashboardShell basePath="/dashboard" workspaceLabel="Workspace">
      <Suspense fallback={null}>
        <IntegrationsDashboard />
      </Suspense>
    </DashboardShell>
  );
}
