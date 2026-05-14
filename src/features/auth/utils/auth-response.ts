import type { AuthResponse } from "@/features/auth/api/auth-api";

export function getCompanySlug(response: AuthResponse, fallbackName?: string) {
  return (
    response.company?.slug ??
    response.organization?.slug ??
    response.tenant?.slug ??
    response.slug ??
    (fallbackName ? slugify(fallbackName) : "")
  );
}

export function getAuthToken(response: AuthResponse) {
  return response.accessToken ?? response.token ?? "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
