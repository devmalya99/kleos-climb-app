import type { PacingStatus } from "@/shared/types/pacing.types";

import type { VelocityForecastStatus } from "../types/battleStats.types";

export const ANALYTICS_QUERY_KEYS = {
  all: ["analytics"] as const,
  global: ["analytics", "global"] as const,
  exam: (examId: string) => ["analytics", "exam", examId] as const,
};

/** Most recent days drawn in the XP chart. */
export const CHART_DAYS = 14;

export const PACING_STATUS_LABEL: Record<PacingStatus, string> = {
  ON_TRACK: "On track",
  PICK_UP_PACE: "Pick up the pace",
  AHEAD_OF_SCHEDULE: "Ahead of schedule",
  IMPOSSIBLE_DEADLINE: "Deadline out of reach at your current goal",
};

export const FORECAST_STATUS_LABEL: Record<VelocityForecastStatus, string> = {
  NO_DATA: "Not enough recent activity to forecast",
  BEHIND: "Behind your required pace",
  ON_PACE: "On pace",
  AHEAD: "Ahead of pace",
  COMPLETE: "All quests complete",
};
