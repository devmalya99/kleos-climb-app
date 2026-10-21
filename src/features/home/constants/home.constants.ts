import type { FeatureUnlocks } from "@/features/auth";

export type FeatureItem = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  /** Missing = always available. */
  unlockKey?: keyof FeatureUnlocks;
  lockedHint?: string;
};

export const MORE_ITEMS: FeatureItem[] = [
  {
    key: "settings",
    title: "Settings",
    subtitle: "XP goals, timezone, notifications",
    href: "/more/settings",
  },
  {
    key: "profile",
    title: "Profile",
    subtitle: "Account and sign out",
    href: "/more/profile",
  },
];
