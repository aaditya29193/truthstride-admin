import { UsersRound } from "lucide-react";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";

export function SettingsDashboard() {
  return (
    <main className="min-w-0">
      <DashboardPageHeader description="Manage your workspace." title="Settings" />

      <section className="grid gap-5 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <form className="rounded-2xl border border-[#202a3f] bg-[#111827] p-6">
          <div>
            <h2 className="text-xl font-semibold tracking-normal text-[#f8fafc]">Workspace</h2>
            <p className="mt-2 text-[15px] leading-6 text-[#9ca3af]">
              This name appears across BuildTruth.
            </p>
          </div>

          <label className="mt-6 block">
            <span className="mb-2.5 block text-sm font-medium text-[#f1f5f9]">
              Workspace name
            </span>
            <input
              className="h-11 w-full rounded-xl border border-[#243047] bg-[#172033] px-3.5 text-[15px] text-[#f8fafc] outline-none transition placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
              defaultValue="Acme Inc."
              type="text"
            />
          </label>

          <button
            className="mt-5 h-10 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white shadow-[0_14px_28px_rgba(79,130,246,0.2)] transition hover:bg-[#416fe1]"
            type="button"
          >
            Save changes
          </button>
        </form>

        <section className="rounded-2xl border border-[#202a3f] bg-[#111827] p-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#263149] bg-[#172033] text-[#9ca3af]">
            <UsersRound aria-hidden size={23} />
          </div>
          <h2 className="mt-5 text-xl font-semibold tracking-normal text-[#f8fafc]">
            Team management
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-[#9ca3af]">
            Invite teammates and manage roles.
          </p>
          <div className="mt-8 rounded-2xl border border-dashed border-[#2b374f] bg-[#0d1420] px-5 py-8 text-center text-sm leading-6 text-[#9ca3af]">
            Team management is coming soon.
          </div>
        </section>
      </section>
    </main>
  );
}
