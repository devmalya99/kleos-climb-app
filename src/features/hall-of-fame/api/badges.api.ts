import type { PublicLevelBadge } from "@/features/level-analyser";
import { api } from "@/services/api";

type BadgesResponse = { badges: PublicLevelBadge[] };

/** 403 until the Hall of Fame is unlocked. */
export async function getBadgesApi(): Promise<PublicLevelBadge[]> {
  const data = await api.get<BadgesResponse>("/api/user/badges");
  return data.badges;
}
