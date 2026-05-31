import { redirect } from "next/navigation";

type DashboardPageProps = {
  params: Promise<{
    orgId: string;
  }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { orgId } = await params;

  redirect(`/${orgId}/dashboard/overview`);
}
