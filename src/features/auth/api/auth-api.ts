import { apiRequest } from "@/lib/api/http-client";

const authEndpoints = {
  login: "/auth/login",
  signup: "/auth/signup",
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  name: string;
  organizationName: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresAt?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  company?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  tenant?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  slug?: string;
};

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>(authEndpoints.login, {
    body: payload,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export function signup(payload: SignupPayload) {
  return apiRequest<AuthResponse>(authEndpoints.signup, {
    body: payload,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}
