import { useQuery } from "@tanstack/react-query";
import { listIntegrations } from "@/features/integrations/jira/api/jira-api";

export const integrationsQueryKey = ["integrations"] as const;

export function useIntegrations(options: { enabled?: boolean } = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: listIntegrations,
    queryKey: integrationsQueryKey,
    retry: false,
  });
}
