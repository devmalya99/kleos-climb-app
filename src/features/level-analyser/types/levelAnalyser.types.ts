import type {
  ActionFailure,
  PublicQuizQuestion,
  QuizAnswer,
} from "@/shared/types/quiz.types";

export type MasteryTier = "NOVICE" | "WARRIOR" | "MASTER" | "CONQUEROR";

export type PublicLevelBadge = {
  id: string;
  categoryId: string;
  tier: MasteryTier;
  tierLabel: string;
  score: number;
  maxScore: number;
  realmName: string;
  campaignName: string;
  earnedAt: string;
};

export type PublicProgressReport = {
  categoryId: string;
  reportText: string;
  masteryTier: MasteryTier;
  tierLabel: string;
  score: number;
  maxScore: number;
  compiledAt: string;
};

export type LevelAnalyserSession = {
  attemptId: string;
  questions: PublicQuizQuestion[];
};

export type StartLevelAnalyserResult = ({ ok: true } & LevelAnalyserSession) | ActionFailure;

export type SubmitLevelAnalyserInput = {
  attemptId: string;
  answers: QuizAnswer[];
};

export type LevelAnalyserOutcome = {
  ok: true;
  tierLabel: string;
  score: number;
  maxScore: number;
  badge: PublicLevelBadge;
  report: PublicProgressReport | null;
  hallOfFameUnlocked: boolean;
};

export type SubmitLevelAnalyserResult = LevelAnalyserOutcome | ActionFailure;

export type ProgressReportResponse = { report: PublicProgressReport | null };

export type EnsureProgressReportResult =
  | { ok: true; report: PublicProgressReport; fromCache: boolean }
  | ActionFailure;

export type RegenerateProgressReportResult =
  | { ok: true; report: PublicProgressReport }
  | ActionFailure;
