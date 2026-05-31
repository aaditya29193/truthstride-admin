"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "@/features/auth/utils/token-storage";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearAccessToken();
    router.replace("/login");
  }

  return (
    <button
      className="grid h-10 w-10 place-items-center rounded-xl border border-[#263149] text-[#9ca3af] transition hover:border-[#3b4c72] hover:bg-[#172033] hover:text-[#f8fafc]"
      onClick={handleLogout}
      title="Logout"
      type="button"
    >
      <LogOut aria-hidden size={18} />
      <span className="sr-only">Logout</span>
    </button>
  );
}
