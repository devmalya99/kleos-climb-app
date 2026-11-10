import type { Href } from "expo-router";

function appPath(from: string | string[] | undefined): string | null {
  const value = Array.isArray(from) ? from[0] : from;
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) return null;
  if (value.startsWith("/(auth)")) return null;
  return value;
}

/** After sign-in, resume `from` when it is a safe in-app path. Otherwise open the tabs. */
export function afterSignInHref(_user: unknown, from?: string | string[]): Href {
  const path = appPath(from);
  return (path ?? "/(tabs)") as Href;
}
