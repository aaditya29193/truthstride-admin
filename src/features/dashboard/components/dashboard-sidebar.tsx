"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Plug, Settings } from "lucide-react";
import { DashboardBrand } from "@/features/dashboard/components/dashboard-brand";
import { LogoutButton } from "@/features/dashboard/components/logout-button";

type DashboardSidebarProps = {
  companySlug: string;
};

const navItems = [
  {
    href: "overview",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    href: "projects",
    icon: Boxes,
    label: "Projects",
  },
  {
    href: "integrations",
    icon: Plug,
    label: "Integrations",
  },
  {
    href: "settings",
    icon: Settings,
    label: "Settings",
  },
];

export function DashboardSidebar({ companySlug }: DashboardSidebarProps) {
  const pathname = usePathname();
  const basePath = `/${companySlug}/dashboard`;

  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-[#202a3f] bg-[#0b1018] lg:sticky lg:top-0 lg:w-60">
      <div className="border-b border-[#202a3f] px-5 py-6">
        <DashboardBrand />
      </div>

      <nav className="flex-1 space-y-2 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = `${basePath}/${item.href}`;
          const isActive = pathname === href;

          return (
            <Link
              className={`flex h-10 items-center gap-3 rounded-xl px-3 text-[15px] transition ${
                isActive
                  ? "border border-[#22375f] bg-[#111c30] text-[#5f8dff]"
                  : "text-[#9ca3af] hover:bg-[#111827] hover:text-[#eef3ff]"
              }`}
              href={href}
              key={item.href}
            >
              <Icon aria-hidden size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#202a3f] p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-[#111827] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-[#27406f] bg-[#172348] text-sm font-semibold text-[#82a8ff]">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#f8fafc]">Admin User</p>
            <p className="truncate text-xs text-[#9ca3af]">{companySlug}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
