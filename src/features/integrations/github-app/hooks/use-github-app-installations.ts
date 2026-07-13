import { useQuery } from "@tanstack/react-query";
import { listGithubAppInstallations } from "@/features/integrations/github-app/api/github-app-api";

export const githubAppInstallationsQueryKey = ["integrations", "github-app", "installations"] as const;

export function useGithubAppInstallations(options: { enabled?: boolean } = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: listGithubAppInstallations,
    queryKey: githubAppInstallationsQueryKey,
    retry: false,
  });
}
