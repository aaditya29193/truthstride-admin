import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { SettingsDashboard } from "@/features/dashboard/components/settings-dashboard";

export default function DashboardSettingsPage() {
  return (
    <DashboardShell basePath="/dashboard" workspaceLabel="Workspace">
      <SettingsDashboard />
    </DashboardShell>
  );
}
