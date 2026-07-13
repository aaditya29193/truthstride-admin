import { useQuery } from "@tanstack/react-query";
import { listOrganizationRepositories } from "@/features/projects/api/projects-api";

export const organizationRepositoriesQueryKey = ["organization-repositories"] as const;

export function useOrganizationRepositories(options: { enabled?: boolean } = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: listOrganizationRepositories,
    queryKey: organizationRepositoriesQueryKey,
    retry: false,
  });
}
