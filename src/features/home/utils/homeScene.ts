import type { ResolvedScheme } from "@/app/theme";

export const homeScenes = {
  light: require("../assets/seaside.jpg") as number,
  dark: require("../assets/campfire.jpg") as number,
};

export function homeScene(scheme: ResolvedScheme): number {
  return scheme === "dark" ? homeScenes.dark : homeScenes.light;
}

export function homeGreeting(scheme: ResolvedScheme, email: string | undefined): string {
  if (scheme === "dark") return "Good Night";
  const name = displayName(email);
  return name ? `Welcome, ${name}` : "Welcome";
}

export function homeDateLabel(now: Date): string {
  const month = now.toLocaleString("en-GB", { month: "long" }).toLowerCase();
  return `${now.getDate()} ${month}, ${now.getFullYear()}`;
}

function displayName(email: string | undefined): string | null {
  const local = email?.split("@")[0]?.replace(/[._+-]+/g, " ").trim();
  if (!local) return null;
  return local.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
