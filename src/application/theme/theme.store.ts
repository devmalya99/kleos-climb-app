import { create } from "zustand";

import { logger } from "@/services/logging/logger";
import { getItem, setItem } from "@/services/storage/app-storage";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "pacemaker.theme.preference";

type ThemeStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  hydrate: () => Promise<void>;
};

function isPreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: "system",
  setPreference: (preference) => {
    set({ preference });
    void setItem(STORAGE_KEY, preference).catch((error: unknown) => {
      logger.warn("Could not save the theme preference", { error });
    });
  },
  hydrate: async () => {
    try {
      const stored = await getItem(STORAGE_KEY);
      if (isPreference(stored)) {
        set({ preference: stored });
      }
    } catch (error) {
      logger.warn("Could not read the theme preference", { error });
    }
  },
}));
