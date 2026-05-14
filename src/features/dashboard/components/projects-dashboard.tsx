import { GitBranch, Plus } from "lucide-react";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";

const projects = [
  {
    activity: "12 min ago",
    name: "buildtruth/web-app",
    status: "Active",
    tool: "GitHub",
  },
  {
    activity: "34 min ago",
    name: "buildtruth/api",
    status: "Active",
    tool: "GitHub",
  },
  {
    activity: "2 days ago",
    name: "buildtruth/marketing",
    status: "Idle",
    tool: "GitHub",
  },
  {
    activity: "1 hr ago",
    name: "buildtruth/mobile",
    status: "Active",
    tool: "GitHub + Jira",
  },
  {
    activity: "5 days ago",
    name: "buildtruth/infra",
    status: "Idle",
    tool: "GitHub",
  },
];

export function ProjectsDashboard() {
  return (
    <main className="min-w-0">
      <DashboardPageHeader
        description="Repositories connected to BuildTruth."
        title="Projects"
      />

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-[#9ca3af]">5 repositories</p>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white shadow-[0_14px_28px_rgba(79,130,246,0.2)] transition hover:bg-[#416fe1]"
            type="button"
          >
            <Plus aria-hidden size={17} />
            Add Project
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#202a3f] bg-[#111827]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead className="bg-[#141c2d] text-xs uppercase tracking-[0.14em] text-[#9ca3af]">
                <tr>
                  <th className="px-5 py-4 font-medium">Repo Name</th>
                  <th className="px-5 py-4 font-medium">Connected Tool</th>
                  <th className="px-5 py-4 font-medium">Last Activity</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202a3f]">
                {projects.map((project) => (
                  <tr className="transition hover:bg-[#151e31]" key={project.name}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#263149] bg-[#172033] text-[#9ca3af]">
                          <GitBranch aria-hidden size={17} />
                        </span>
                        <span className="font-medium text-[#f8fafc]">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#cbd5e1]">{project.tool}</td>
                    <td className="px-5 py-4 text-[#9ca3af]">{project.activity}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                          project.status === "Active"
                            ? "border-[#235a42] bg-[#10251d] text-[#9ee5be]"
                            : "border-[#3b465a] bg-[#182031] text-[#b8c0cf]"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
