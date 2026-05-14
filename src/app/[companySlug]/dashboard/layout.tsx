import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    companySlug: string;
  }>;
};

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { companySlug } = await params;

  return <DashboardShell companySlug={companySlug}>{children}</DashboardShell>;
}
