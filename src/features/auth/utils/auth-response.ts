import type { AuthResponse } from "@/features/auth/api/auth-api";

export function getAuthToken(response: AuthResponse) {
  return response.accessToken ?? "";
}
