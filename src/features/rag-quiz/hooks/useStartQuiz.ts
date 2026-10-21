import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";

import { startSessionApi } from "../api/sessions.api";
import { RAG_QUERY_KEYS, ragHref } from "../constants/ragQuiz.constants";

/** Starts a quiz session for a ready pack and opens the session screen. */
export function useStartQuiz() {
  const queryClient = useQueryClient();
  const { error, run, clearError } = useSoftAction();
  const [startingPackId, setStartingPackId] = useState<string | null>(null);

  async function startQuiz(packId: string) {
    if (startingPackId) return;
    setStartingPackId(packId);
    const result = await run(() => startSessionApi(packId), "Could not start the quiz");
    setStartingPackId(null);
    if (!result.ok) return;
    // Seed the cache so the session screen renders the first question immediately.
    queryClient.setQueryData(RAG_QUERY_KEYS.session(result.value.id), result.value);
    void queryClient.invalidateQueries({ queryKey: RAG_QUERY_KEYS.packs });
    router.push(ragHref.session(result.value.id));
  }

  return { startQuiz, startingPackId, error, clearError };
}
