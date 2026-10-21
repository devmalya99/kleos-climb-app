/** A question as sent by the server. `correctIndex` is never part of this shape. */
export type PublicQuizQuestion = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
};

export type QuizAnswer = {
  questionId: string;
  selectedIndex: number;
};

export type QuizTimerConfig =
  | { enabled: false }
  | { enabled: true; mode: "overall"; totalSeconds: number }
  | {
      enabled: true;
      mode: "per-question";
      secondsByQuestionId: Record<string, number>;
    };

/** Revealed by the server only after an attempt has been submitted and failed. */
export type MissedQuestion = {
  prompt: string;
  selectedOption: string | null;
  correctOption: string;
};

/** Returned when the user's Arsenal skill XP changes. */
export type SkillAwardResult = {
  skillId: string;
  skillName: string;
  xpAwarded: number;
  totalXp: number;
  previousRank: string;
  newRank: string;
  rankUp: boolean;
  /** True only the first time Arsenal unlocks for this account. */
  arsenalUnlocked: boolean;
};

export type ResolvedQuestSkill = {
  skillId: string;
  skillName: string;
  xp: number;
  rank: string;
  rankLabel: string;
  isNewSkill: boolean;
};

/** Action-shaped failure the quiz endpoints return with HTTP 200. */
export type ActionFailure = { ok: false; error: string; retryAt?: string };
