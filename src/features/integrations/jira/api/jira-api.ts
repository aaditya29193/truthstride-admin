import { apiRequest } from "@/lib/api/http-client";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import type { ConnectJiraPayload, JiraIntegration } from "@/features/integrations/jira/types/jira";

export function listIntegrations() {
  return apiRequest<JiraIntegration[]>("/integrations", {
    headers: getAuthorizedHeaders(),
    method: "GET",
  });
}

export function connectJira(payload: ConnectJiraPayload) {
  return apiRequest<JiraIntegration>("/integrations/jira", {
    body: payload,
    headers: getAuthorizedHeaders(),
    method: "POST",
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
