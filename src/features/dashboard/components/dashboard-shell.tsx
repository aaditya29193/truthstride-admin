import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

type DashboardShellProps = {
  basePath?: string;
  children: React.ReactNode;
  workspaceLabel: string;
};

export function DashboardShell({ basePath, children, workspaceLabel }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#080d14] text-[#f8fafc] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <DashboardSidebar basePath={basePath} workspaceLabel={workspaceLabel} />
      {children}
    </div>
  );
}
