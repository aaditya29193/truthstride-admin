import { apiRequest } from "@/lib/api/http-client";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import type {
  GithubAppInstallUrlResponse,
  GithubAppInstallation,
  GithubAppInstallationRepository,
} from "@/features/integrations/github-app/types/github-app";

export function getGithubAppInstallUrl(returnTo?: string) {
  const path = returnTo
    ? `/github-app/install-url?returnTo=${encodeURIComponent(returnTo)}`
    : "/github-app/install-url";

  return apiRequest<GithubAppInstallUrlResponse>(path, {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

export function listGithubAppInstallations() {
  return apiRequest<GithubAppInstallation[]>("/github-app/installations", {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

export function listGithubAppInstallationRepositories(installationId: string) {
  return apiRequest<GithubAppInstallationRepository[]>(
    `/github-app/installations/${installationId}/repositories`,
    {
      headers: getAuthorizedHeaders(),
      method: "GET",
    },
  );
}

export function syncGithubAppInstallation(installationId: string) {
  return apiRequest<GithubAppInstallation>(
    `/github-app/installations/${installationId}/sync`,
    {
      headers: getAuthorizedHeaders(),
      method: "POST",
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
