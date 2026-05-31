import { apiRequest } from "@/lib/api/http-client";
import type { BootstrapResponse } from "@/features/onboarding/types/onboarding";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import { connect } from "http2";

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
  personalAccessToken: string;
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

export function connectOnboardingJira(payload: ConnectJiraPayload): Promise<BootstrapResponse>  {
  return apiRequest(onboardingEndpoints.connectJira, {
    body: payload,
    headers: getAuthorizedHeaders(),
    method: "POST",
  });
}

export function connectOnboardingGithub(payload: ConnectGithubPayload): Promise<BootstrapResponse>  {
  return apiRequest(onboardingEndpoints.connectGithub, {
    body: payload,
    headers: getAuthorizedHeaders(),
    method: "POST",
  });
}

export function getOnboardingBootstrap() {
  return apiRequest<BootstrapResponse>("/api/v1/app/bootstrap", {
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
