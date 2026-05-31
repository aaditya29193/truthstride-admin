import { useQuery } from "@tanstack/react-query";
import { getBootstrap } from "@/features/app/api/bootstrap-api";

export const bootstrapQueryKey = ["app", "bootstrap"] as const;

export function useBootstrap(options: { enabled?: boolean } = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: getBootstrap,
    queryKey: bootstrapQueryKey,
    retry: false,
  });
}
