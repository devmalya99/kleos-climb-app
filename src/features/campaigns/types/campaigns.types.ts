import type { ParsedTopic, PublicExam } from "@/shared/types/study.types";

export type CampaignInput = {
  name: string;
  /** YYYY-MM-DD */
  targetDate: string;
};

export type ExamsResponse = { exams: PublicExam[] };
export type ExamResponse = { exam: PublicExam };

export type ImportPlanQuest = { name: string; description?: string };
export type ImportPlanRealm = { name: string; quests: ImportPlanQuest[] };
export type ImportPlanProposal = { realms: ImportPlanRealm[] };

export type ImportPlanPreviewResponse = {
  campaignName: string;
  proposal: ImportPlanProposal;
  message?: string;
};

export type ImportPlanReport = {
  campaignName: string;
  realms: Array<{
    name: string;
    created: boolean;
    questsAdded: string[];
    questsSkipped: string[];
  }>;
  totalQuestsAdded: number;
  totalQuestsSkipped: number;
};

export type ImportPlanCommitResponse = {
  report: ImportPlanReport;
  message?: string;
};

export type ParseTopicsResponse = {
  topics: ParsedTopic[];
  message?: string;
};
