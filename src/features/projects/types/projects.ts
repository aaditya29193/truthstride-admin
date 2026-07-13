export type Project = {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationRepository = {
  id: string;
  name: string;
  fullName: string | null;
  owner: string | null;
  provider: string;
  isPrivate: boolean | null;
  assignedProjectIds: string[];
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
};
