import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSoftAction } from "@/shared/hooks/useSoftAction";
import { confirmAction } from "@/shared/utils/confirmAction";

import { deletePackApi, listPacksApi } from "../api/packs.api";
import { RAG_QUERY_KEYS } from "../constants/ragQuiz.constants";
import type { RagPackSummary } from "../types/ragQuiz.types";
import { formatBytes } from "../utils/ragQuiz.utils";

/** Ready packs (history) with soft-locked delete. */
export function useRagPacks() {
  const queryClient = useQueryClient();
  const { error, run } = useSoftAction();

  const query = useQuery({ queryKey: RAG_QUERY_KEYS.packs, queryFn: listPacksApi });

  const remove = useMutation({
    mutationFn: deletePackApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RAG_QUERY_KEYS.packs }),
  });

  function deletePack(pack: RagPackSummary) {
    confirmAction(
      {
        title: "Delete this pack?",
        message: `${pack.fileNames.join(", ")} (${formatBytes(pack.totalBytes)}) and its past quizzes will be removed.`,
      },
      () => void run(() => remove.mutateAsync(pack.id), "Could not delete the pack"),
    );
  }

  return {
    packs: query.data ?? [],
    isLoading: query.isLoading,
    loadError: query.error,
    refetch: query.refetch,
    deletingPackId: remove.isPending ? remove.variables : null,
    error,
    deletePack,
  };
}
