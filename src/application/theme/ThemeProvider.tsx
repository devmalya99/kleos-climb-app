import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";

import { darkColors, lightColors, type AppColors } from "./tokens";
import { ThemePreference, useThemeStore } from "./theme.store";

export type ResolvedScheme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  scheme: ResolvedScheme;
  colors: AppColors;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(preference: ThemePreference, systemScheme: ResolvedScheme): ResolvedScheme {
  if (preference === "system") {
    return systemScheme;
  }
  return preference;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const hydrate = useThemeStore((state) => state.hydrate);
  const [systemScheme, setSystemScheme] = useState<ResolvedScheme>(
    Appearance.getColorScheme() === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => subscription.remove();
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme = resolveScheme(preference, systemScheme);
    return {
      preference,
      scheme,
      colors: scheme === "dark" ? darkColors : lightColors,
      setPreference,
    };
  }, [preference, setPreference, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
