/** The setup wizard asks for exactly this many tasks. */
export const KEY_STEP_COUNT = 3;

export const DEFAULT_DEADLINE_DAYS = 90;

export const GOAL_MIN_LENGTH = 3;
export const GOAL_MAX_LENGTH = 160;
export const LEVEL_TITLE_MAX_LENGTH = 120;
export const LEVEL_DESCRIPTION_MAX_LENGTH = 500;
export const MAX_LEVELS = 50;
export const MAX_SUMMITS = 20;

/** Cosmetic: progress is mapped onto this altitude. */
export const SUMMIT_ALTITUDE_METERS = 8849;

export const CLIMB_PATH = "/api/mountain-climber/climb";

/** This device only. The web uses the same key in localStorage; the value does not sync. */
export const SELECTED_SUMMIT_KEY = "mountain-climber-summit";

export const CLIMB_QUERY_KEY = ["mountain-climber", "climb"] as const;

export const SUMMIT_CAP_MESSAGE = `You can keep up to ${MAX_SUMMITS} summits.`;
export const LEVEL_CAP_MESSAGE = `A trail can hold up to ${MAX_LEVELS} levels.`;

export const STEP_PLACEHOLDERS = [
  "e.g. Solve 150 DSA problems",
  "e.g. Master system design basics",
  "e.g. Do 10 mock interviews",
] as const;
