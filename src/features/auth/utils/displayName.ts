type NamedUser = {
  displayName?: string | null;
  email?: string | null;
};

/** Onboarding name, or the email local-part when that name is empty. */
export function resolveDisplayName(user: NamedUser | null | undefined): string {
  const named = user?.displayName?.trim();
  if (named) return named;
  const local = user?.email?.split("@")[0]?.trim();
  return local ?? "";
}
