import type { PublicTopic } from "@/shared/types/study.types";

/** Quests that belong to one realm, in server-defined order. */
export function filterQuestsByRealm(
  quests: PublicTopic[],
  categoryId: string,
): PublicTopic[] {
  return quests
    .filter((quest) => quest.categoryId === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Returns the new id order after moving one item, or null when the move is out of range. */
export function moveQuestId(
  ids: string[],
  index: number,
  direction: "up" | "down",
): string[] | null {
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || index >= ids.length || target < 0 || target >= ids.length) {
    return null;
  }
  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
