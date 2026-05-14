import { Bell, Search } from "lucide-react";

type DashboardPageHeaderProps = {
  description: string;
  title: string;
};

export function DashboardPageHeader({ description, title }: DashboardPageHeaderProps) {
  return (
    <header className="border-b border-[#202a3f] px-5 py-6 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-[#f8fafc]">{title}</h1>
          <p className="mt-2 max-w-md text-[15px] leading-6 text-[#9ca3af]">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#202a3f] bg-[#111827] px-3 text-[#8d96a6] sm:w-80 sm:flex-none">
            <Search aria-hidden size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-[#f8fafc] outline-none placeholder:text-[#8d96a6]"
              placeholder="Search..."
              type="search"
            />
          </label>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#202a3f] bg-[#111827] text-[#9ca3af] transition hover:border-[#3b4c72] hover:text-[#f8fafc]"
            title="Notifications"
            type="button"
          >
            <Bell aria-hidden size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
