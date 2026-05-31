import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    orgId: string;
  }>;
};

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { orgId } = await params;

  return (
    <DashboardShell basePath={`/${orgId}/dashboard`} workspaceLabel={orgId}>
      {children}
    </DashboardShell>
  );
}
