import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUEST_QUERY_KEYS } from "@/features/quests";

import { createRealmApi, deleteRealmApi } from "../api/realms.api";
import { REALM_QUERY_KEYS } from "../constants/realms.constants";

export function useRealmMutations(examId: string) {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (realmName: string) => createRealmApi(examId, realmName),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: REALM_QUERY_KEYS.list(examId) }),
  });

  // Deleting a realm cascades to its quests and analyser data on the server.
  const remove = useMutation({
    mutationFn: (realmName: string) => deleteRealmApi(examId, realmName),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: REALM_QUERY_KEYS.list(examId) }),
        queryClient.invalidateQueries({
          queryKey: REALM_QUERY_KEYS.analyserStatuses(examId),
        }),
        queryClient.invalidateQueries({ queryKey: QUEST_QUERY_KEYS.list(examId) }),
      ]),
  });

  return { create, remove };
}
