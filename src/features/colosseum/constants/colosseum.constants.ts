export const COLOSSEUM_QUERY_KEYS = {
  status: (examId: string, categoryId: string) =>
    ["colosseum", "status", examId, categoryId] as const,
};

/** Display-only copies of the server rules, used for the rules screen and HUD labels. */
export const COLOSSEUM_STARTING_ELIXIRS = 3;
export const COLOSSEUM_MAX_ELIXIRS = 10;
export const COLOSSEUM_ELIXIR_RECOVERY_STREAK = 6;
export const COLOSSEUM_XP_PER_CORRECT = 30;
export const COLOSSEUM_DAILY_ATTEMPTS = 3;

export const COLOSSEUM_END_REASON_LABEL = {
  incorrect: "Your last strike missed and the elixirs ran out.",
  timeout: "Time ran out on a strike.",
  surrender: "You surrendered the run.",
} as const;
