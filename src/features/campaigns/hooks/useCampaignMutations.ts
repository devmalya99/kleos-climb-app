import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExamApi, deleteExamApi, updateExamApi } from "../api/exams.api";
import { CAMPAIGN_QUERY_KEYS } from "../constants/campaigns.constants";
import type { CampaignInput } from "../types/campaigns.types";

export function useCampaignMutations() {
  const queryClient = useQueryClient();
  // The detail key is nested under the list key, so this refreshes both.
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEYS.list });

  const create = useMutation({
    mutationFn: (input: CampaignInput) => createExamApi(input),
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: (vars: { examId: string; input: Partial<CampaignInput> }) =>
      updateExamApi(vars.examId, vars.input),
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: (examId: string) => deleteExamApi(examId),
    onSuccess: (_data, examId) => {
      queryClient.removeQueries({ queryKey: CAMPAIGN_QUERY_KEYS.detail(examId) });
      return refresh();
    },
  });

  return { create, update, remove };
}
