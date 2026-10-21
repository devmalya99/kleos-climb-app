import type {
  ActionFailure,
  PublicQuizQuestion,
  QuizTimerConfig,
  SkillAwardResult,
} from "@/shared/types/quiz.types";

export type ColosseumRecord = {
  bestScore: number;
  bestStreak: number;
};

/** Server-owned run state. The client renders it and never recomputes elixirs or streaks. */
export type ColosseumSession = {
  elixirs: number;
  streak: number;
  totalCorrect: number;
  totalWrong: number;
  xpEarned: number;
  batchNumber: number;
  questionInBatch: number;
};

export type ColosseumStatus = {
  personalBest: ColosseumRecord;
  attemptsUsedToday: number;
  attemptsRemaining: number;
  canStart: boolean;
};

export type ColosseumStatusResponse = { status: ColosseumStatus };

/** Revealed only after the answer was graded. */
export type ColosseumAnswerFeedback = {
  selectedOption: string | null;
  correctOption: string;
};

export type ColosseumRun = {
  attemptId: string;
  question: PublicQuizQuestion;
  session: ColosseumSession;
  timer: QuizTimerConfig;
};

export type StartColosseumResult =
  | ({ ok: true; personalBest: ColosseumRecord; attemptsRemaining: number } & ColosseumRun)
  | ActionFailure;

export type ColosseumContinued = {
  ok: true;
  ended: false;
  wasCorrect: boolean;
  elixirEarned: boolean;
  skillAward: SkillAwardResult | null;
  answerFeedback?: ColosseumAnswerFeedback;
} & ColosseumRun;

export type ColosseumRecordBreaks = {
  bestScoreBroken: boolean;
  bestStreakBroken: boolean;
  previousBest: ColosseumRecord;
};

export type ColosseumEndReason = "incorrect" | "timeout" | "surrender";

export type ColosseumEnded = {
  ok: true;
  ended: true;
  totalCorrect: number;
  totalWrong: number;
  xpEarned: number;
  maxStreak: number;
  personalBest: ColosseumRecord;
  recordBreaks: ColosseumRecordBreaks;
  lastSkillAward: SkillAwardResult | null;
  reason?: ColosseumEndReason;
  answerFeedback?: ColosseumAnswerFeedback;
};

export type ColosseumAnswerResult = ColosseumContinued | ColosseumEnded | ActionFailure;
