import { GitBranch } from "lucide-react";

export function BuildtruthLogo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-[#28457a] bg-[#172348] text-[#5f8dff] shadow-[0_0_28px_rgba(78,124,246,0.18)]">
        <GitBranch aria-hidden size={20} strokeWidth={2.5} />
      </span>
      <span className="text-[25px] font-semibold leading-none tracking-normal text-[#eef3ff]">
        Build<span className="text-[#4f82f6]">Truth</span>
      </span>
    </div>
  );
}
