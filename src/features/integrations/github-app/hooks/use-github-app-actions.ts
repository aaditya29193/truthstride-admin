import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGithubAppInstallUrl,
  syncGithubAppInstallation,
} from "@/features/integrations/github-app/api/github-app-api";
import { githubAppInstallationsQueryKey } from "@/features/integrations/github-app/hooks/use-github-app-installations";

export function useGithubAppConnect() {
  return useMutation({
    mutationFn: async () => {
      const { installUrl } = await getGithubAppInstallUrl();

      window.location.href = installUrl;
    },
  });
}

export function useGithubAppSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (installationId: string) => syncGithubAppInstallation(installationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: githubAppInstallationsQueryKey }),
  });
}
