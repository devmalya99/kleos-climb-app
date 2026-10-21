import type { PublicUser } from "@/features/auth";
import type { QuestPacingResult } from "@/shared/types/pacing.types";

export type UserResponse = { user: PublicUser };

export type AvailabilityInput = {
  weekdayXpPerDay: number;
  weekendXpPerDay: number;
  timezone?: string;
};

export type CampaignQuestPacing = {
  examId: string;
  examName: string;
  questsPending: number;
  questsCompletedToday: number;
  questsCompletedThisWeek: number;
  requiredDailyQuests: number;
  suggestedDailyQuests: number;
};

export type UserQuestPacing = {
  questPacing: QuestPacingResult;
  campaigns: CampaignQuestPacing[];
  questsCompletedToday: number;
};
