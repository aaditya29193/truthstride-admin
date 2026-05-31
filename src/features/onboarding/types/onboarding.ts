export type OnboardingStep =
  | "create_project"
  | "connect_jira"
  | "connect_github"
  | "create-project"
  | "connect-jira"
  | "connect-github"
  | string;

export type OnboardingSteps = {
  projectCreated: boolean;
  jiraConnected: boolean;
  githubConnected: boolean;
};

export type OnboardingState = {
  completed: boolean;
  currentStep: OnboardingStep;
  redirectTo: string;
  steps: OnboardingSteps;
};

export type BootstrapOrganization = {
  id?: string;
  name?: string;
  orgId?: string;
  slug?: string;
};

export type BootstrapUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

export type BootstrapResponse = {
  onboarding: OnboardingState;
  organization?: BootstrapOrganization;
  user?: BootstrapUser;
};
