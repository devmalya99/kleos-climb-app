import { useQuery } from "@tanstack/react-query";

import { isLockedError } from "@/shared/utils/isLockedError";

import { getAnalyticsApi, getExamAnalyticsApi } from "../api/battleStats.api";
import { ANALYTICS_QUERY_KEYS } from "../constants/battleStats.constants";

export function useAnalytics() {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.global,
    queryFn: getAnalyticsApi,
    retry: (count, error) => !isLockedError(error) && count < 1,
  });
}

/** Only fetches once a campaign is selected. */
export function useExamAnalytics(examId: string | null) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.exam(examId ?? ""),
    queryFn: () => getExamAnalyticsApi(examId ?? ""),
    enabled: Boolean(examId),
  });
}
