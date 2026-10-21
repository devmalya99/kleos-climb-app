import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  bulkCreateQuestsApi,
  createQuestApi,
  deleteQuestApi,
  reorderQuestsApi,
  updateQuestApi,
} from "../api/topics.api";
import { QUEST_QUERY_KEYS } from "../constants/quests.constants";
import type {
  BulkCreateInput,
  QuestInput,
  QuestUpdateInput,
  ReorderQuestsInput,
} from "../types/quests.types";

/** Every quest mutation refreshes the campaign's quest list (server is source of truth). */
export function useQuestMutations(examId: string) {
  const queryClient = useQueryClient();
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: QUEST_QUERY_KEYS.list(examId) });

  const create = useMutation({
    mutationFn: (input: QuestInput) => createQuestApi(examId, input),
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: (vars: { topicId: string; input: QuestUpdateInput }) =>
      updateQuestApi(examId, vars.topicId, vars.input),
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: (topicId: string) => deleteQuestApi(examId, topicId),
    onSuccess: refresh,
  });

  const reorder = useMutation({
    mutationFn: (input: ReorderQuestsInput) => reorderQuestsApi(examId, input),
    onSuccess: refresh,
  });

  const bulkCreate = useMutation({
    mutationFn: (input: BulkCreateInput) => bulkCreateQuestsApi(examId, input),
    onSuccess: refresh,
  });

  return { create, update, remove, reorder, bulkCreate };
}
