import { ENV } from "@/app/config/env";
import { api } from "@/services/api";

import type { AuthResponse, MeResponse, PublicUser } from "../types/auth.types";
import type { LoginInput, SignupInput } from "../utils/auth.schemas";

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/auth/login", input, { auth: false });
}

export async function signupApi(input: SignupInput): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/auth/signup", input, { auth: false });
}

export async function logoutApi(): Promise<void> {
  try {
    await api.post("/api/auth/logout");
  } catch {
    // Local clear still proceeds.
  }
}

export async function getMeApi(): Promise<PublicUser> {
  const data = await api.get<MeResponse>("/api/auth/me");
  return data.user;
}

export function getGoogleAuthUrl(): string {
  return `${ENV.apiBaseUrl}/api/auth/google?client=mobile`;
}
