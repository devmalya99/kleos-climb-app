export type QuestPacingResult = {
  questsPending: number;
  questsCompleted: number;
  questsTotal: number;
  remainingDays: number;
  requiredDailyQuests: number;
  suggestedDailyQuests: number;
};

export type PacingStatus =
  | "ON_TRACK"
  | "PICK_UP_PACE"
  | "AHEAD_OF_SCHEDULE"
  | "IMPOSSIBLE_DEADLINE";

export type PacingResult = {
  status: PacingStatus;
  suggestedDailyXp: number;
  remainingDays: number;
  xpRemaining: number;
  xpEarned: number;
  xpTotal: number;
  percentComplete: number;
  requiredDailyXp: number;
  maxDailyXpGoal: number;
};
