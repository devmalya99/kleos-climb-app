import type { RealmAnalyserStatus } from "@/shared/types/study.types";

type Availability = { enabled: boolean; label: string; hint?: string };

/** Level Analyser needs at least one quest and must not be on cooldown. */
export function getAnalyseAvailability(
  questCount: number,
  status: RealmAnalyserStatus | undefined,
): Availability {
  if (questCount === 0) {
    return { enabled: false, label: "Analyse", hint: "Add a quest to unlock the analyser." };
  }
  if (status && !status.canChallenge) {
    return { enabled: false, label: "Analyse", hint: "Analyser is cooling down. Try again soon." };
  }
  return {
    enabled: true,
    label: status?.hasBadge && status.tierLabel ? `Analyse · ${status.tierLabel}` : "Analyse",
  };
}
