import { apiRequest } from "@/lib/api/http-client";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import type { BootstrapResponse } from "@/features/onboarding/types/onboarding";

export function getBootstrap() {
  const accessToken = getStoredAccessToken();

  return apiRequest<BootstrapResponse>("/app/bootstrap", {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
    method: "GET",
  });
}
