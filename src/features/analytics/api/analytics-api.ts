import { apiRequest } from "@/lib/api/http-client";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import type {
  CommitAnalytics,
  PullRequestAnalytics,
  SyncRun,
  SyncSource,
  TicketAnalytics,
} from "@/features/analytics/types/analytics";

export function getCommitAnalytics(projectId: string, days: number) {
  return apiRequest<CommitAnalytics>(`/projects/${projectId}/analytics/commits?days=${days}`, {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

export function getPullRequestAnalytics(projectId: string, days: number) {
  return apiRequest<PullRequestAnalytics>(
    `/projects/${projectId}/analytics/pull-requests?days=${days}`,
    {
      headers: getAuthorizedHeaders(),
      method: "GET",
    },
  );
}

export function getTicketAnalytics(projectId: string, days: number) {
  return apiRequest<TicketAnalytics>(`/projects/${projectId}/analytics/tickets?days=${days}`, {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

export function triggerSync(projectId: string, source: SyncSource) {
  return apiRequest<{ syncRunId: string }>(`/projects/${projectId}/sync`, {
    body: { source },
    headers: getAuthorizedHeaders(),
    method: "POST",
  });
}

export function getSyncStatus(projectId: string, source: SyncSource) {
  return apiRequest<SyncRun | null>(`/projects/${projectId}/sync-status?source=${source}`, {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

function getAuthorizedHeaders() {
  const accessToken = getStoredAccessToken();

  return accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined;
}
