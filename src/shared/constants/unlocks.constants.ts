export type UnlockKind = "arsenal" | "battleStats" | "hallOfFame";

export const UNLOCK_COPY: Record<UnlockKind, { title: string; body: string; href: string }> = {
  arsenal: {
    title: "Arsenal unlocked",
    body: "You earned your first skill XP. Track every skill and rank in the Arsenal.",
    href: "/more/arsenal",
  },
  battleStats: {
    title: "Battle Stats unlocked",
    body: "You completed your first quest. See your progress and pacing in Battle Stats.",
    href: "/more/battle-stats",
  },
  hallOfFame: {
    title: "Hall of Fame unlocked",
    body: "You earned your first Level Analyser badge. It now lives in the Hall of Fame.",
    href: "/more/hall-of-fame",
  },
};
