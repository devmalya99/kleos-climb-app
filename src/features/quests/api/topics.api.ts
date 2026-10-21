import { api } from "@/services/api";
import type { PublicTopic } from "@/shared/types/study.types";

import type {
  BulkCreateInput,
  BulkDeleteResponse,
  QuestInput,
  QuestUpdateInput,
  ReorderQuestsInput,
  TopicResponse,
  TopicsResponse,
} from "../types/quests.types";

const base = (examId: string) => `/api/exams/${examId}/topics`;

export async function listQuestsApi(examId: string): Promise<PublicTopic[]> {
  const data = await api.get<TopicsResponse>(base(examId));
  return data.topics;
}

export async function createQuestApi(
  examId: string,
  input: QuestInput,
): Promise<PublicTopic> {
  const data = await api.post<TopicResponse>(base(examId), input);
  return data.topic;
}

export async function updateQuestApi(
  examId: string,
  topicId: string,
  input: QuestUpdateInput,
): Promise<PublicTopic> {
  const data = await api.patch<TopicResponse>(`${base(examId)}/${topicId}`, input);
  return data.topic;
}

export async function deleteQuestApi(
  examId: string,
  topicId: string,
): Promise<void> {
  await api.delete(`${base(examId)}/${topicId}`);
}

export async function bulkCreateQuestsApi(
  examId: string,
  input: BulkCreateInput,
): Promise<PublicTopic[]> {
  const data = await api.post<TopicsResponse>(`${base(examId)}/bulk`, input);
  return data.topics;
}

export async function bulkDeleteQuestsApi(
  examId: string,
  topicIds: string[],
): Promise<number> {
  const data = await api.post<BulkDeleteResponse>(`${base(examId)}/bulk-delete`, {
    topicIds,
  });
  return data.deletedCount;
}

export async function reorderQuestsApi(
  examId: string,
  input: ReorderQuestsInput,
): Promise<void> {
  await api.patch(`${base(examId)}/reorder`, input);
}
