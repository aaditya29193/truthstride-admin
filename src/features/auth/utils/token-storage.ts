"use client";

const accessTokenKey = "truthstride_access_token";
const legacyAccessTokenKey = "buildtruth_admin_token";

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(accessTokenKey) ?? localStorage.getItem(legacyAccessTokenKey) ?? "";
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(accessTokenKey, accessToken);
  localStorage.setItem(legacyAccessTokenKey, accessToken);
}

export function clearAccessToken() {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(legacyAccessTokenKey);
}
