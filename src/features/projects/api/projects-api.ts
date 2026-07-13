import { apiRequest } from "@/lib/api/http-client";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import type {
  CreateProjectPayload,
  OrganizationRepository,
  Project,
} from "@/features/projects/types/projects";

export function listProjects() {
  return apiRequest<Project[]>("/projects", {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

export function listOrganizationRepositories() {
  return apiRequest<OrganizationRepository[]>("/projects/repositories", {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

export function createProject(payload: CreateProjectPayload) {
  return apiRequest<Project>("/projects", {
    body: payload,
    headers: getAuthorizedHeaders(),
    method: "POST",
  });
}

export function assignRepositoryToProject(projectId: string, repositoryId: string) {
  return apiRequest<{ success: boolean }>(`/projects/${projectId}/repositories`, {
    body: { repositoryId },
    headers: getAuthorizedHeaders(),
    method: "POST",
  });
}

export function unassignRepositoryFromProject(projectId: string, repositoryId: string) {
  return apiRequest<{ success: boolean }>(
    `/projects/${projectId}/repositories/${repositoryId}`,
    {
      headers: getAuthorizedHeaders(),
      method: "DELETE",
    },
  );
}

function getAuthorizedHeaders() {
  const accessToken = getStoredAccessToken();

  return accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined;
}
