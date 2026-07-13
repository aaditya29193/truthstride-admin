"use client";

import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { ProjectsPanel } from "@/features/projects/components/projects-panel";

export function ProjectsDashboard() {
  return (
    <main className="min-w-0">
      <DashboardPageHeader
        description="Projects and the repositories that feed them."
        title="Projects"
      />

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <ProjectsPanel />
      </section>
    </main>
  );
}
