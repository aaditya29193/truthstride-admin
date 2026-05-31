import { apiRequest } from "@/lib/api/http-client";
import { getStoredAccessToken } from "@/features/auth/utils/token-storage";
import type { OnboardingSteps } from "@/features/onboarding/types/onboarding";

export type SetupStatusResponse = {
  completed: boolean;
  remainingSteps: string[];
  steps: OnboardingSteps;
};

export function getSetupStatus() {
  const accessToken = getStoredAccessToken();

  return apiRequest<SetupStatusResponse>("/api/v1/dashboard/setup-status", {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
    method: "GET",
  });
}
