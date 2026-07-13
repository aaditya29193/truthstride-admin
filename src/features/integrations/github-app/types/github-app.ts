export type GithubAppInstallationRepository = {
  id: string;
  githubRepositoryId: string;
  name: string;
  fullName: string;
  isPrivate: boolean | null;
};

export type GithubAppInstallation = {
  id: string;
  organizationId: string;
  githubInstallationId: string;
  accountId: string;
  accountLogin: string;
  accountType: string | null;
  repositorySelection: string | null;
  status: "active" | "suspended" | "deleted" | string;
  setupAction: string | null;
  repositories: GithubAppInstallationRepository[];
  createdAt: string;
  updatedAt: string;
};

export type GithubAppInstallUrlResponse = {
  installUrl: string;
  state: string;
};
