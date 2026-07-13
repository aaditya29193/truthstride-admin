import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/features/projects/api/projects-api";

export const projectsQueryKey = ["projects"] as const;

export function useProjects(options: { enabled?: boolean } = {}) {
  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: listProjects,
    queryKey: projectsQueryKey,
    retry: false,
  });
}
