import type { ResolvedScheme } from "@/app/theme";

export const homeScenes = {
  light: require("../assets/seaside.jpg") as number,
  dark: require("../assets/campfire.jpg") as number,
};

export function homeScene(scheme: ResolvedScheme): number {
  return scheme === "dark" ? homeScenes.dark : homeScenes.light;
}

export function homeGreeting(scheme: ResolvedScheme, name: string | null | undefined): string {
  if (scheme === "dark") return "Good Night";
  const trimmed = name?.trim();
  return trimmed ? `Welcome, ${trimmed}` : "Welcome";
}

export function homeDateLabel(now: Date): string {
  const month = now.toLocaleString("en-GB", { month: "long" }).toLowerCase();
  return `${now.getDate()} ${month}, ${now.getFullYear()}`;
}

