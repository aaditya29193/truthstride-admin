import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSyncStatus, triggerSync } from "@/features/analytics/api/analytics-api";
import type { SyncSource } from "@/features/analytics/types/analytics";

export const syncStatusQueryKey = (projectId: string, source: SyncSource) =>
  ["sync-status", projectId, source] as const;

export function useSyncStatus(projectId: string | undefined, source: SyncSource) {
  return useQuery({
    enabled: Boolean(projectId),
    queryFn: () => getSyncStatus(projectId as string, source),
    queryKey: syncStatusQueryKey(projectId ?? "", source),
    refetchInterval: (query) => (query.state.data?.status === "running" ? 2000 : false),
    retry: false,
  });
}

export function useTriggerSync(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (source: SyncSource) => triggerSync(projectId as string, source),
    onSuccess: async (_data, source) => {
      if (!projectId) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: syncStatusQueryKey(projectId, source) });
    },
  });
}
