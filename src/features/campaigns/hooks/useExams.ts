import { useQuery } from "@tanstack/react-query";

import { getExamApi, listExamsApi } from "../api/exams.api";
import { CAMPAIGN_QUERY_KEYS } from "../constants/campaigns.constants";

export function useExams() {
  return useQuery({
    queryKey: CAMPAIGN_QUERY_KEYS.list,
    queryFn: listExamsApi,
  });
}

export function useExam(examId: string) {
  return useQuery({
    queryKey: CAMPAIGN_QUERY_KEYS.detail(examId),
    queryFn: () => getExamApi(examId),
    enabled: Boolean(examId),
  });
}
