import { useQuery } from "@tanstack/react-query";

import { getAnalyserStatusesApi, listRealmsApi } from "../api/realms.api";
import { REALM_QUERY_KEYS } from "../constants/realms.constants";

export function useRealms(examId: string) {
  return useQuery({
    queryKey: REALM_QUERY_KEYS.list(examId),
    queryFn: () => listRealmsApi(examId),
    enabled: Boolean(examId),
  });
}

export function useRealmAnalyserStatuses(examId: string) {
  return useQuery({
    queryKey: REALM_QUERY_KEYS.analyserStatuses(examId),
    queryFn: () => getAnalyserStatusesApi(examId),
    enabled: Boolean(examId),
  });
}
