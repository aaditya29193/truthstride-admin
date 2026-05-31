import { useQuery } from "@tanstack/react-query";
import { getSetupStatus } from "@/features/dashboard/api/setup-status-api";

export function useSetupStatus() {
  return useQuery({
    queryFn: getSetupStatus,
    queryKey: ["dashboard", "setup-status"],
    retry: false,
  });
}
