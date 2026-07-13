"use client";

import { AlertTriangle, Loader2, Lock, Plus, X } from "lucide-react";
import { useState } from "react";
import { useBootstrap } from "@/features/app/hooks/use-bootstrap";
import { useOrganizationRepositories } from "@/features/projects/hooks/use-organization-repositories";
import { useProjects } from "@/features/projects/hooks/use-projects";
import {
  useAssignRepository,
  useCreateProject,
  useUnassignRepository,
} from "@/features/projects/hooks/use-project-actions";
import type { OrganizationRepository, Project } from "@/features/projects/types/projects";

export function ProjectsPanel() {
  const bootstrap = useBootstrap();
  const isAdmin = bootstrap.data?.user?.role === "admin";

  const projects = useProjects();
  const repositories = useOrganizationRepositories();
  const createProject = useCreateProject();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const hasProjects = (projects.data?.length ?? 0) > 0;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] text-[#9ca3af]">
          {projects.data?.length ?? 0} {projects.data?.length === 1 ? "project" : "projects"}
        </p>
        {isAdmin ? (
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white shadow-[0_14px_28px_rgba(79,130,246,0.2)] transition hover:bg-[#416fe1]"
            onClick={() => setIsCreateOpen((current) => !current)}
            type="button"
          >
            <Plus aria-hidden size={17} />
            Add Project
          </button>
        ) : null}
      </div>

      {isCreateOpen ? (
        <CreateProjectForm
          createProject={createProject}
          onClose={() => setIsCreateOpen(false)}
        />
      ) : null}

      <div className="mt-6">
        {projects.isLoading ? (
          <p className="text-sm text-[#9ca3af]">Loading projects...</p>
        ) : projects.isError ? (
          <ErrorBanner message={getErrorMessage(projects.error)} />
        ) : hasProjects && projects.data ? (
          <div className="space-y-4">
            {projects.data.map((project) => (
              <ProjectCard
                isAdmin={isAdmin}
                key={project.id}
                project={project}
                repositories={repositories.data ?? []}
                repositoriesError={repositories.isError}
                repositoriesLoading={repositories.isLoading}
              />
            ))}
          </div>
        ) : (
          <EmptyState isAdmin={isAdmin} onCreate={() => setIsCreateOpen(true)} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ isAdmin, onCreate }: { isAdmin: boolean; onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#263149] bg-[#0d1420] p-8 text-center">
      <p className="text-sm leading-6 text-[#9ca3af]">
        No projects yet.{" "}
        {isAdmin
          ? "Create one and assign repositories to start tracking activity."
          : "Ask an organization admin to create one."}
      </p>
      {isAdmin ? (
        <button
          className="mx-auto mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4f82f6] px-5 text-sm font-medium text-white transition hover:bg-[#416fe1]"
          onClick={onCreate}
          type="button"
        >
          <Plus aria-hidden size={16} />
          Add Project
        </button>
      ) : null}
    </div>
  );
}

function CreateProjectForm({
  createProject,
  onClose,
}: {
  createProject: ReturnType<typeof useCreateProject>;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    createProject.mutate(
      { description: description.trim() || undefined, name: trimmedName },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          onClose();
        },
      },
    );
  }

  return (
    <form
      className="mb-6 rounded-2xl border border-[#202a3f] bg-[#111827] p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#f8fafc]">New project</h3>
        <button
          className="grid h-8 w-8 place-items-center rounded-lg text-[#8d96a6] transition hover:bg-[#172033] hover:text-[#f8fafc]"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden size={16} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#f1f5f9]">Project name</span>
          <input
            className="h-10 w-full rounded-xl border border-[#243047] bg-[#172033] px-3 text-sm text-[#f8fafc] outline-none placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
            onChange={(event) => setName(event.target.value)}
            placeholder="Customer portal"
            value={name}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#f1f5f9]">
            Description (optional)
          </span>
          <input
            className="h-10 w-full rounded-xl border border-[#243047] bg-[#172033] px-3 text-sm text-[#f8fafc] outline-none placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Track delivery work for the customer portal."
            value={description}
          />
        </label>
      </div>

      {createProject.isError ? (
        <ErrorBanner message={getErrorMessage(createProject.error)} />
      ) : null}

      <div className="mt-4 flex justify-end gap-3">
        <button
          className="h-9 rounded-xl border border-[#263149] px-4 text-sm font-medium text-[#cbd5e1] transition hover:bg-[#172033]"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
        <button
          className="flex h-9 items-center gap-2 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white transition hover:bg-[#416fe1] disabled:cursor-not-allowed disabled:bg-[#3b5fa9]"
          disabled={createProject.isPending || !name.trim()}
          type="submit"
        >
          {createProject.isPending ? (
            <Loader2 aria-hidden className="animate-spin" size={14} />
          ) : null}
          Create
        </button>
      </div>
    </form>
  );
}

function ProjectCard({
  isAdmin,
  project,
  repositories,
  repositoriesError,
  repositoriesLoading,
}: {
  isAdmin: boolean;
  project: Project;
  repositories: OrganizationRepository[];
  repositoriesError: boolean;
  repositoriesLoading: boolean;
}) {
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const assign = useAssignRepository();
  const unassign = useUnassignRepository();

  const assigned = repositories.filter((repo) => repo.assignedProjectIds.includes(project.id));
  const available = repositories.filter((repo) => !repo.assignedProjectIds.includes(project.id));

  function handleAssign() {
    if (!selectedRepoId) {
      return;
    }

    assign.mutate(
      { projectId: project.id, repositoryId: selectedRepoId },
      { onSuccess: () => setSelectedRepoId("") },
    );
  }

  return (
    <div className="rounded-xl border border-[#202a3f] bg-[#0d1420] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[15px] font-medium text-[#f8fafc]">{project.name}</p>
          {project.description ? (
            <p className="mt-1 text-xs text-[#8d96a6]">{project.description}</p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full border border-[#3b465a] bg-[#182031] px-2.5 py-1 text-xs font-medium text-[#b8c0cf]">
          {assigned.length} {assigned.length === 1 ? "repository" : "repositories"}
        </span>
      </div>

      {assign.isError ? <ErrorBanner message={getErrorMessage(assign.error)} /> : null}
      {unassign.isError ? <ErrorBanner message={getErrorMessage(unassign.error)} /> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {assigned.map((repo) => (
          <span
            className="flex items-center gap-1.5 rounded-lg border border-[#263149] bg-[#111827] px-2.5 py-1 text-xs text-[#cbd5e1]"
            key={repo.id}
          >
            {repo.isPrivate ? <Lock aria-hidden size={11} /> : null}
            {repo.fullName ?? repo.name}
            {isAdmin ? (
              <button
                className="text-[#8d96a6] transition hover:text-[#f8fafc]"
                disabled={unassign.isPending}
                onClick={() =>
                  unassign.mutate({ projectId: project.id, repositoryId: repo.id })
                }
                type="button"
              >
                <X aria-hidden size={12} />
              </button>
            ) : null}
          </span>
        ))}
        {repositoriesLoading ? (
          <p className="text-xs text-[#8d96a6]">Loading repositories...</p>
        ) : repositoriesError ? null : !assigned.length ? (
          <p className="text-xs text-[#8d96a6]">No repositories assigned yet.</p>
        ) : null}
      </div>

      {isAdmin && !repositoriesLoading && available.length > 0 ? (
        <div className="mt-3 flex items-center gap-2">
          <select
            className="h-9 min-w-0 flex-1 rounded-lg border border-[#263149] bg-[#111827] px-2.5 text-xs text-[#cbd5e1] outline-none focus:border-[#4f82f6] sm:max-w-xs"
            onChange={(event) => setSelectedRepoId(event.target.value)}
            value={selectedRepoId}
          >
            <option value="">Select a repository...</option>
            {available.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.fullName ?? repo.name}
              </option>
            ))}
          </select>
          <button
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#263149] px-3 text-xs font-medium text-[#cbd5e1] transition hover:bg-[#172033] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedRepoId || assign.isPending}
            onClick={handleAssign}
            type="button"
          >
            {assign.isPending ? (
              <Loader2 aria-hidden className="animate-spin" size={13} />
            ) : (
              <Plus aria-hidden size={13} />
            )}
            Assign
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#71333f] bg-[#2a131a] px-4 py-3 text-sm leading-6 text-[#ffb4c1]">
      <AlertTriangle aria-hidden className="mt-0.5 shrink-0" size={16} />
      {message}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
