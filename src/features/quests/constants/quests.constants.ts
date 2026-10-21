import type { TopicPriority } from "@/shared/types/study.types";

export const QUEST_QUERY_KEYS = {
  list: (examId: string) => ["quests", examId] as const,
};

export const QUEST_NAME_MAX = 200;
export const QUEST_DESCRIPTION_MAX = 2000;

export const QUEST_PRIORITIES: ReadonlyArray<{
  value: TopicPriority;
  label: string;
}> = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export const QUEST_PRIORITY_LABEL: Record<TopicPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};
