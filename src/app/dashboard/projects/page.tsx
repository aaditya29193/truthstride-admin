import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { ProjectsDashboard } from "@/features/dashboard/components/projects-dashboard";

export default function DashboardProjectsPage() {
  return (
    <DashboardShell basePath="/dashboard" workspaceLabel="Workspace">
      <ProjectsDashboard />
    </DashboardShell>
  );
}
