import type {
  ActionFailure,
  MissedQuestion,
  PublicQuizQuestion,
  QuizAnswer,
  QuizTimerConfig,
  ResolvedQuestSkill,
  SkillAwardResult,
} from "@/shared/types/quiz.types";

export type QuestQuizSession = {
  attemptId: string;
  questions: PublicQuizQuestion[];
  timer: QuizTimerConfig;
  questSkill: ResolvedQuestSkill;
};

export type StartQuestQuizResult = ({ ok: true } & QuestQuizSession) | ActionFailure;

export type SubmitQuestQuizInput = {
  attemptId: string;
  answers: QuizAnswer[];
};

export type QuestQuizPassed = {
  ok: true;
  passed: true;
  score: number;
  xpAwarded: number;
  skillAward: SkillAwardResult | null;
  battleStatsUnlocked: boolean;
};

export type QuestQuizFailed = {
  ok: true;
  passed: false;
  score: number;
  retryAt: string;
  missed: MissedQuestion[];
  reason?: "incorrect" | "timeout";
};

export type QuestQuizOutcome = QuestQuizPassed | QuestQuizFailed;
export type SubmitQuestQuizResult = QuestQuizOutcome | ActionFailure;
