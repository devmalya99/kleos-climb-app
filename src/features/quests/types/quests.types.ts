import type {
  ParsedTopic,
  PublicTopic,
  TopicPriority,
} from "@/shared/types/study.types";

export type QuestInput = {
  name: string;
  description?: string;
  categoryName?: string;
  priority: TopicPriority;
  resources: string[];
};

export type QuestUpdateInput = Partial<QuestInput>;

export type ReorderQuestsInput = {
  categoryId: string | null;
  topicIds: string[];
};

export type TopicsResponse = { topics: PublicTopic[] };
export type TopicResponse = { topic: PublicTopic };
export type BulkCreateInput = { topics: ParsedTopic[] };
export type BulkDeleteResponse = { deletedCount: number };
