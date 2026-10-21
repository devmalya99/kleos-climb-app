import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { CLUTTER_QUERY_KEYS } from "@/features/brain-clutter";
import { useSoftAction } from "@/shared/hooks/useSoftAction";

import {
  answerQuestionApi,
  exportNoteApi,
  extendSessionApi,
  getSessionApi,
  nextQuestionApi,
  reportSessionApi,
} from "../api/sessions.api";
import { RAG_QUERY_KEYS } from "../constants/ragQuiz.constants";
import type { RagSession } from "../types/ragQuiz.types";
import { getSessionControls } from "../utils/ragQuiz.utils";

/** One quiz session. Every server step returns the full session, which we cache. */
export function useRagSession(sessionId: string) {
  const queryClient = useQueryClient();
  const { error, run, clearError } = useSoftAction();
  const [isBusy, setIsBusy] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const key = RAG_QUERY_KEYS.session(sessionId);

  const query = useQuery({
    queryKey: key,
    queryFn: () => getSessionApi(sessionId),
    // The server owns scoring; refetching on focus could overwrite a pending step.
    refetchOnWindowFocus: false,
  });

  async function step(action: () => Promise<RagSession>, fallback: string) {
    if (isBusy) return;
    setIsBusy(true);
    const result = await run(action, fallback);
    setIsBusy(false);
    if (result.ok) queryClient.setQueryData(key, result.value);
  }

  async function saveReportNote() {
    if (isBusy) return;
    setIsBusy(true);
    const result = await run(() => exportNoteApi(sessionId), "Could not save the note");
    setIsBusy(false);
    if (!result.ok) return;
    setNoteSaved(true);
    void queryClient.invalidateQueries({ queryKey: CLUTTER_QUERY_KEYS.all });
  }

  const session = query.data ?? null;

  return {
    session,
    controls: session ? getSessionControls(session) : null,
    isLoading: query.isLoading,
    loadError: query.error,
    refetch: query.refetch,
    isBusy,
    noteSaved,
    error,
    clearError,
    answer: (itemId: string, index: number) =>
      step(() => answerQuestionApi(sessionId, itemId, index), "Could not submit your answer"),
    next: () => step(() => nextQuestionApi(sessionId), "Could not load the next question"),
    extend: () => step(() => extendSessionApi(sessionId), "Could not extend the quiz"),
    finish: () => step(() => reportSessionApi(sessionId), "Could not build the report"),
    saveReportNote,
  };
}
