import { apiRequest } from "@/lib/api/http-client";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";

export type CreateProjectPayload = {
  description: string;
  name: string;
};

export type ConnectJiraPayload = {
  apiToken: string;
  email: string;
  jiraUrl: string;
};

export type ConnectGithubPayload = {
  accessToken: string;
};

export type IntegrationConnectionResponse = {
  id: string;
  organizationId: string;
  tool: string;
  name: string | null;
  isActive: boolean;
  details: Record<string, string | null>;
  createdAt: string;
  updatedAt: string;
};

const onboardingEndpoints = {
  createProject: "/projects",
  connectJira: "/integrations/jira",
  connectGithub: "/integrations/github",
};

export function createOnboardingProject(payload: CreateProjectPayload) {
  return apiRequest(onboardingEndpoints.createProject, {
    body: payload,
    headers: getAuthorizedHeaders(),
    method: "POST",
  });
}

export function connectOnboardingJira(payload: ConnectJiraPayload): Promise<IntegrationConnectionResponse> {
  return apiRequest(onboardingEndpoints.connectJira, {
    body: payload,
    headers: getAuthorizedHeaders(),
    method: "POST",
  });
}

export function connectOnboardingGithub(payload: ConnectGithubPayload): Promise<IntegrationConnectionResponse> {
  return apiRequest(onboardingEndpoints.connectGithub, {
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
