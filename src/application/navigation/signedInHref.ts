import type { Href } from "expo-router";

type OnboardingUser = {
  onboardedAt?: string | null;
};

/** Explicit null is a new account. A missing field is an older session that already has data. */
export function needsOnboarding(user: OnboardingUser | null | undefined): boolean {
  return user?.onboardedAt === null;
}

function appPath(from: string | string[] | undefined): string | null {
  const value = Array.isArray(from) ? from[0] : from;
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) return null;
  if (value.startsWith("/onboarding") || value.startsWith("/(auth)")) return null;
  return value;
}

/** Onboarded login can resume `from`. A null timestamp goes to onboarding. */
export function afterSignInHref(user: OnboardingUser, from?: string | string[]): Href {
  if (needsOnboarding(user)) return "/onboarding" as Href;
  const path = appPath(from);
  return (path ?? "/(tabs)") as Href;
}
