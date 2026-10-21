import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

import { ARSENAL_QUERY_KEYS } from "@/features/arsenal";
import { useAuth } from "@/features/auth";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import type { UnlockKind } from "@/shared/constants/unlocks.constants";
import { playAnswerHaptic, playRewardHaptic } from "@/shared/utils/quizHaptics";

import {
  answerColosseumApi,
  getColosseumStatusApi,
  startColosseumApi,
  surrenderColosseumApi,
  timeoutColosseumApi,
} from "../api/colosseum.api";
import { COLOSSEUM_QUERY_KEYS } from "../constants/colosseum.constants";
import type {
  ColosseumAnswerResult,
  ColosseumContinued,
  ColosseumEnded,
  ColosseumRun,
} from "../types/colosseum.types";

/**
 * One Colosseum run. Elixirs, streaks, XP and the daily limit are all server state:
 * every response replaces the local run snapshot.
 */
export function useColosseum(examId: string, categoryId: string) {
  const queryClient = useQueryClient();
  const { refreshMe } = useAuth();

  const statusQuery = useQuery({
    queryKey: COLOSSEUM_QUERY_KEYS.status(examId, categoryId),
    queryFn: () => getColosseumStatusApi(examId, categoryId),
  });

  const [run, setRun] = useState<ColosseumRun | null>(null);
  /** A wrong (but not final) strike waiting for the player to continue. */
  const [pendingWrong, setPendingWrong] = useState<ColosseumContinued | null>(null);
  const [ended, setEnded] = useState<ColosseumEnded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [unlockQueue, setUnlockQueue] = useState<UnlockKind[]>([]);

  function enqueueUnlock(arsenalUnlocked: boolean | undefined) {
    if (!arsenalUnlocked) return;
    playRewardHaptic();
    setUnlockQueue((queue) => [...queue, "arsenal"]);
  }

  async function afterSkillXp() {
    void queryClient.invalidateQueries({ queryKey: ARSENAL_QUERY_KEYS.all });
    try {
      await refreshMe();
    } catch (err) {
      logger.warn("Refresh me after Colosseum failed", { message: getErrorMessage(err) });
    }
  }

  function applyEnded(result: ColosseumEnded) {
    if (result.reason !== "surrender") playAnswerHaptic(false);
    enqueueUnlock(result.lastSkillAward?.arsenalUnlocked);
    setRun(null);
    setPendingWrong(null);
    setEnded(result);
    void queryClient.invalidateQueries({
      queryKey: COLOSSEUM_QUERY_KEYS.status(examId, categoryId),
    });
    void afterSkillXp();
  }

  function applyContinued(result: ColosseumContinued) {
    setRun({
      attemptId: result.attemptId,
      question: result.question,
      session: result.session,
      timer: result.timer,
    });
    setPendingWrong(null);
  }

  function handleResult(result: ColosseumAnswerResult) {
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.ended) {
      applyEnded(result);
      return;
    }
    playAnswerHaptic(result.wasCorrect);
    if (result.elixirEarned) playRewardHaptic();
    enqueueUnlock(result.skillAward?.arsenalUnlocked);
    if (result.skillAward) void afterSkillXp();

    if (result.wasCorrect) {
      applyContinued(result);
    } else {
      setPendingWrong(result);
    }
  }

  async function call(request: () => Promise<ColosseumAnswerResult>, fallback: string) {
    setIsBusy(true);
    setError(null);
    try {
      handleResult(await request());
    } catch (err) {
      logger.error("Colosseum request failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, fallback));
    } finally {
      setIsBusy(false);
    }
  }

  async function start() {
    setIsBusy(true);
    setError(null);
    setEnded(null);
    try {
      const result = await startColosseumApi(examId, categoryId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRun({
        attemptId: result.attemptId,
        question: result.question,
        session: result.session,
        timer: result.timer,
      });
    } catch (err) {
      logger.error("Start Colosseum failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Could not start the Colosseum"));
    } finally {
      setIsBusy(false);
    }
  }

  return {
    status: statusQuery.data ?? null,
    isLoadingStatus: statusQuery.isLoading,
    statusError: statusQuery.error,
    retryStatus: () => void statusQuery.refetch(),
    run,
    pendingWrong,
    ended,
    error,
    isBusy,
    start,
    answer: (selectedIndex: number) =>
      run
        ? call(
            () => answerColosseumApi(examId, categoryId, run.attemptId, selectedIndex),
            "Could not submit your answer",
          )
        : Promise.resolve(),
    timeout: () =>
      run && !isBusy && !pendingWrong
        ? call(() => timeoutColosseumApi(examId, categoryId, run.attemptId), "Could not record the timeout")
        : Promise.resolve(),
    surrender: () =>
      run
        ? call(() => surrenderColosseumApi(examId, categoryId, run.attemptId), "Could not surrender")
        : Promise.resolve(),
    continueAfterWrong: () => {
      if (pendingWrong) applyContinued(pendingWrong);
    },
    currentUnlock: unlockQueue[0] ?? null,
    dismissUnlock: () => setUnlockQueue((queue) => queue.slice(1)),
    leave: () => (router.canGoBack() ? router.back() : router.replace("/(tabs)")),
  };
}
