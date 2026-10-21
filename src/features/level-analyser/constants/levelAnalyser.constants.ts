export const LEVEL_ANALYSER_QUERY_KEYS = {
  progressReport: (categoryId: string) => ["progress-report", categoryId] as const,
  /** Badges are produced here; Hall of Fame reads and the analyser invalidates this key. */
  badges: ["user", "badges"] as const,
};

/** 10 basic + 5 deeper + 5 advanced, 5 marks each (max 100). Scoring is server-side. */
export const LEVEL_ANALYSER_QUESTION_COUNT = 20;
export const LEVEL_ANALYSER_MAX_SCORE = 100;

/** `examId` placeholder: the progress-report routes scope by `categoryId` only (server ignores `examId`). */
export const ANY_EXAM_ID = "any";
