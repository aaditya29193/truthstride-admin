import { redirect } from "next/navigation";

type DashboardPageProps = {
  params: Promise<{
    companySlug: string;
  }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { companySlug } = await params;

  redirect(`/${companySlug}/dashboard/overview`);
}
