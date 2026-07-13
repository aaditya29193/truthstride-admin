import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bootstrapQueryKey } from "@/features/app/hooks/use-bootstrap";
import { connectJira } from "@/features/integrations/jira/api/jira-api";
import { integrationsQueryKey } from "@/features/integrations/jira/hooks/use-integrations";
import type { ConnectJiraPayload } from "@/features/integrations/jira/types/jira";

export function useConnectJira() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConnectJiraPayload) => connectJira(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      await queryClient.invalidateQueries({ queryKey: bootstrapQueryKey });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "setup-status"] });
    },
  });
}
