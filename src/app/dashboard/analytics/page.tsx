import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { AnalyticsDashboard } from "@/features/analytics/components/analytics-dashboard";

export default function DashboardAnalyticsPage() {
  return (
    <DashboardShell basePath="/dashboard" workspaceLabel="Workspace">
      <AnalyticsDashboard />
    </DashboardShell>
  );
}
