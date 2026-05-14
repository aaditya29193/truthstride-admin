import { GitBranch, MessageSquare, Plug } from "lucide-react";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";

const integrations = [
  {
    action: "Connected",
    description: "Stream branches, PRs, and merges into BuildTruth.",
    icon: GitBranch,
    state: "connected",
    title: "GitHub",
  },
  {
    action: "Connect",
    description: "Sync ticket statuses and link them to Git activity.",
    icon: Plug,
    state: "available",
    title: "Jira",
  },
  {
    action: "Coming soon",
    description: "Surface alerts and team chatter alongside Git events.",
    icon: MessageSquare,
    state: "soon",
    title: "Slack",
  },
];

export function IntegrationsDashboard() {
  return (
    <main className="min-w-0">
      <DashboardPageHeader
        description="Connect the tools where your team works."
        title="Integrations"
      />

      <section className="grid gap-5 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-3">
        {integrations.map((integration) => {
          const Icon = integration.icon;

          return (
            <article
              className="flex min-h-48 flex-col justify-between rounded-2xl border border-[#202a3f] bg-[#111827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)]"
              key={integration.title}
            >
              <div>
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-[#263149] bg-[#172033] text-[#eef3ff]">
                  <Icon aria-hidden size={24} />
                </div>
                <h2 className="text-xl font-semibold tracking-normal text-[#f8fafc]">
                  {integration.title}
                </h2>
                <p className="mt-2 text-[15px] leading-6 text-[#9ca3af]">
                  {integration.description}
                </p>
              </div>

              <button
                className={`mt-6 h-10 rounded-xl px-4 text-sm font-medium transition ${
                  integration.state === "connected"
                    ? "border border-[#235a42] bg-[#10251d] text-[#9ee5be]"
                    : integration.state === "soon"
                      ? "cursor-not-allowed border border-[#3b465a] bg-[#182031] text-[#9ca3af]"
                      : "bg-[#4f82f6] text-white hover:bg-[#416fe1]"
                }`}
                disabled={integration.state === "soon"}
                type="button"
              >
                {integration.action}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
