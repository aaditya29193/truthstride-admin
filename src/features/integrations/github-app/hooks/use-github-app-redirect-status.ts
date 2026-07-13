"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { githubAppInstallationsQueryKey } from "@/features/integrations/github-app/hooks/use-github-app-installations";

export type GithubAppRedirectStatus =
  | { status: "success"; installationId: string | null }
  | { status: "error"; message: string | null };

/**
 * After GitHub redirects the browser back through the backend's
 * /github-app/setup handler, it lands here with a `github_app=success|error`
 * query param. The result is derived straight from the URL on every render;
 * the effect only performs the side effects (cache refresh, stripping the
 * query string) once, so a refresh doesn't replay the same result.
 */
export function useGithubAppRedirectStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);
  const hasCleanedUrl = useRef(false);

  const rawStatus = searchParams.get("github_app");

  const result: GithubAppRedirectStatus | null = dismissed
    ? null
    : rawStatus === "success"
      ? { installationId: searchParams.get("installationId"), status: "success" }
      : rawStatus === "error"
        ? { message: searchParams.get("message"), status: "error" }
        : null;

  useEffect(() => {
    if (!rawStatus || hasCleanedUrl.current) {
      return;
    }

    hasCleanedUrl.current = true;

    if (rawStatus === "success") {
      void queryClient.invalidateQueries({ queryKey: githubAppInstallationsQueryKey });
    }

    router.replace(pathname, { scroll: false });
  }, [pathname, queryClient, rawStatus, router]);

  return { dismiss: () => setDismissed(true), result };
}
