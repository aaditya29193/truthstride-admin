import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
  companySlug: string;
};

export function DashboardShell({ children, companySlug }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#080d14] text-[#f8fafc] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <DashboardSidebar companySlug={companySlug} />
      {children}
    </div>
  );
}
