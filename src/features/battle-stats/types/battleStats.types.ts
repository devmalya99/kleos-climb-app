import type { PacingResult, QuestPacingResult } from "@/shared/types/pacing.types";

export type XpProgressPoint = {
  date: string;
  label: string;
  dailyXp: number;
  cumulativeXp: number;
};

export type XpProgressSummary = {
  totalXpEarned: number;
  totalXpAvailable: number;
  questsCompleted: number;
  totalQuests: number;
  currentStreakDays: number;
  bestStreakDays: number;
  todayXpEarned: number;
};

export type ProgressVelocity = {
  windowDays: number;
  xpEarnedInWindow: number;
  avgXpPerDay: number;
  questsCompletedInWindow: number;
  avgQuestsPerDay: number;
};

export type VelocityForecastStatus = "NO_DATA" | "BEHIND" | "ON_PACE" | "AHEAD" | "COMPLETE";

export type VelocityForecast = {
  status: VelocityForecastStatus;
  willFinishOnTime: boolean;
  paceRatioPercent: number;
  questPaceRatioPercent: number;
  projectedDaysToFinish: number | null;
  projectedQuestDaysToFinish: number | null;
};

export type CampaignPacingBreakdown = {
  examId: string;
  examName: string;
  targetDate: string;
  requiredDailyXp: number;
  xpRemaining: number;
  remainingDays: number;
  percentComplete: number;
  questsPending: number;
  questsCompletedToday: number;
  questsCompletedThisWeek: number;
  requiredDailyQuests: number;
  suggestedDailyQuests: number;
};

/** `GET /api/analytics` */
export type UserProgressAnalytics = {
  series: XpProgressPoint[];
  summary: XpProgressSummary;
  rangeDays: number;
  pacing: PacingResult;
  questPacing: QuestPacingResult;
  campaignBreakdown: CampaignPacingBreakdown[];
  velocity: ProgressVelocity;
  velocityForecast: VelocityForecast;
};

export type RealmBreakdown = {
  categoryName: string;
  themeKey: string | null;
  xpEarned: number;
  xpRemaining: number;
  xpTotal: number;
  completed: number;
  remaining: number;
  total: number;
};

/** `GET /api/exams/[examId]/analytics` → `{ analytics }` */
export type ExamAnalytics = {
  examId: string;
  examName: string;
  targetDate: string;
  pacing: PacingResult;
  questPacing: QuestPacingResult;
  topicCount: number;
  completedTopicCount: number;
  questsPending: number;
  xpEarned: number;
  xpTotal: number;
  xpRemaining: number;
  percentComplete: number;
  categoryBreakdown: RealmBreakdown[];
};

export type ExamAnalyticsResponse = { analytics: ExamAnalytics };
