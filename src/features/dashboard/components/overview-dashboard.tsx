import { ChevronRight } from "lucide-react";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { alerts, overviewStats, recentActivity } from "@/features/dashboard/data/overview";

const statTone = {
  amber: "border-[#4a3821] bg-[#171d2b] text-[#f2b24d]",
  blue: "border-[#243b67] bg-[#111827] text-[#5f8dff]",
  emerald: "border-[#214d3a] bg-[#111827] text-[#46d39a]",
  rose: "border-[#572536] bg-[#111827] text-[#ff7d95]",
};

export function OverviewDashboard() {
  return (
    <main className="min-w-0">
      <DashboardPageHeader
        description="What your team is actually building, right now."
        title="Overview"
      />

      <div className="grid gap-6 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewStats.map((stat) => (
              <article
                className="rounded-2xl border border-[#202a3f] bg-[#111827] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
                key={stat.label}
              >
                <div
                  className={`mb-4 grid h-9 w-9 place-items-center rounded-xl border ${
                    statTone[stat.tone as keyof typeof statTone]
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                </div>
                <p className="text-sm leading-5 text-[#9ca3af]">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-normal text-[#f8fafc]">
                  {stat.value}
                </p>
                <p className="mt-4 text-sm leading-5 text-[#9ca3af]">{stat.note}</p>
              </article>
            ))}
          </div>

          <section className="rounded-2xl border border-[#202a3f] bg-[#111827]">
            <div className="flex items-center justify-between border-b border-[#202a3f] px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold tracking-normal text-[#f8fafc]">Alerts</h2>
                <p className="mt-1 text-sm text-[#9ca3af]">Items that need attention.</p>
              </div>
              <span className="rounded-full border border-[#4a3821] bg-[#261d12] px-3 py-1 text-xs font-medium text-[#f2b24d]">
                3 active
              </span>
            </div>

            <div className="divide-y divide-[#202a3f]">
              {alerts.map((alert) => {
                const Icon = alert.icon;

                return (
                  <article className="flex gap-4 px-5 py-4" key={alert.title}>
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#4a3821] bg-[#201916] text-[#f2b24d]">
                      <Icon aria-hidden size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#f8fafc]">{alert.title}</p>
                      <p className="mt-1 text-sm leading-5 text-[#9ca3af]">{alert.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="min-w-0 rounded-2xl border border-[#202a3f] bg-[#111827]">
          <div className="flex items-center justify-between border-b border-[#202a3f] px-5 py-4">
            <h2 className="text-xl font-semibold tracking-normal text-[#f8fafc]">Recent activity</h2>
            <button
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[#5f8dff] transition hover:bg-[#172033] hover:text-[#82a8ff]"
              type="button"
            >
              View all
              <ChevronRight aria-hidden size={16} />
            </button>
          </div>

          <ul className="divide-y divide-[#202a3f]">
            {recentActivity.map((item) => {
              const Icon = item.icon;

              return (
                <li className="flex gap-3 px-5 py-4" key={`${item.title}-${item.time}`}>
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#243b67] bg-[#172033] text-[#5f8dff]">
                    <Icon aria-hidden size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#f8fafc]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#9ca3af]">
                      {item.meta} · {item.actor}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[#7f8ca3]">{item.time}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </main>
  );
}
