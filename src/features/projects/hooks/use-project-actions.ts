import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignRepositoryToProject,
  createProject,
  unassignRepositoryFromProject,
} from "@/features/projects/api/projects-api";
import { projectsQueryKey } from "@/features/projects/hooks/use-projects";
import { organizationRepositoriesQueryKey } from "@/features/projects/hooks/use-organization-repositories";
import type { CreateProjectPayload } from "@/features/projects/types/projects";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  });
}

export function useAssignRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, repositoryId }: { projectId: string; repositoryId: string }) =>
      assignRepositoryToProject(projectId, repositoryId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: organizationRepositoriesQueryKey }),
  });
}

export function useUnassignRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, repositoryId }: { projectId: string; repositoryId: string }) =>
      unassignRepositoryFromProject(projectId, repositoryId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: organizationRepositoriesQueryKey }),
  });
}
