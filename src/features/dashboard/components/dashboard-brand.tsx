import { GitBranch } from "lucide-react";

export function DashboardBrand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-[#28457a] bg-[#172348] text-[#5f8dff]">
        <GitBranch aria-hidden size={20} strokeWidth={2.5} />
      </span>
      <span className="text-[22px] font-semibold tracking-normal text-[#eef3ff]">
        Build<span className="text-[#4f82f6]">Truth</span>
      </span>
    </div>
  );
}
