export type JiraIntegration = {
  id: string;
  organizationId: string;
  tool: string;
  name: string | null;
  isActive: boolean;
  details: {
    baseUrl: string | null;
    email: string | null;
    projectKey: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type ConnectJiraPayload = {
  jiraUrl: string;
  email: string;
  apiToken: string;
  projectKey?: string;
};
