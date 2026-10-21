import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

import { ARSENAL_QUERY_KEYS } from "@/features/arsenal";
import { useAuth } from "@/features/auth";
import { ANALYTICS_QUERY_KEYS } from "@/features/battle-stats";
import { QUEST_QUERY_KEYS } from "@/features/quests";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import type { QuizAnswer } from "@/shared/types/quiz.types";
import type { UnlockKind } from "@/shared/constants/unlocks.constants";
import { playAnswerHaptic, playRewardHaptic } from "@/shared/utils/quizHaptics";

import { startQuestQuizApi, submitQuestQuizApi, timeoutQuestQuizApi } from "../api/questQuiz.api";
import type {
  QuestQuizOutcome,
  QuestQuizSession,
  SubmitQuestQuizResult,
} from "../types/questQuiz.types";

type StartFailure = { message: string; retryAt?: string };

/**
 * Orchestrates one quest-quiz trial: start → answer → submit/timeout → result.
 * Grading, XP, skill XP and unlock flags all come from the server response.
 */
export function useQuestQuiz(examId: string, topicId: string) {
  const queryClient = useQueryClient();
  const { refreshMe } = useAuth();

  const [session, setSession] = useState<QuestQuizSession | null>(null);
  const [outcome, setOutcome] = useState<QuestQuizOutcome | null>(null);
  const [startFailure, setStartFailure] = useState<StartFailure | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlockQueue, setUnlockQueue] = useState<UnlockKind[]>([]);

  async function start() {
    setIsStarting(true);
    setStartFailure(null);
    setActionError(null);
    setOutcome(null);
    try {
      const result = await startQuestQuizApi(examId, topicId);
      if (!result.ok) {
        setStartFailure({ message: result.error, retryAt: result.retryAt });
        return;
      }
      setSession({
        attemptId: result.attemptId,
        questions: result.questions,
        timer: result.timer,
        questSkill: result.questSkill,
      });
    } catch (error) {
      logger.error("Start quest quiz failed", { message: getErrorMessage(error) });
      setStartFailure({ message: getErrorMessage(error, "Could not start the trial") });
    } finally {
      setIsStarting(false);
    }
  }

  async function handleResult(result: SubmitQuestQuizResult) {
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    playAnswerHaptic(result.passed);
    setOutcome(result);
    setSession(null);

    if (result.passed) {
      const unlocks: UnlockKind[] = [];
      if (result.skillAward?.arsenalUnlocked) unlocks.push("arsenal");
      if (result.battleStatsUnlocked) unlocks.push("battleStats");
      if (unlocks.length > 0) playRewardHaptic();
      setUnlockQueue(unlocks);

      void queryClient.invalidateQueries({ queryKey: QUEST_QUERY_KEYS.list(examId) });
      void queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ARSENAL_QUERY_KEYS.all });
      try {
        await refreshMe();
      } catch (error) {
        logger.warn("Refresh me after quest quiz failed", { message: getErrorMessage(error) });
      }
    }
  }

  async function finish(
    call: () => Promise<SubmitQuestQuizResult>,
    fallbackMessage: string,
  ) {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await handleResult(await call());
    } catch (error) {
      logger.error("Quest quiz request failed", { message: getErrorMessage(error) });
      setActionError(getErrorMessage(error, fallbackMessage));
    } finally {
      setIsSubmitting(false);
    }
  }

  function submit(answers: QuizAnswer[]) {
    if (!session) return Promise.resolve();
    return finish(
      () => submitQuestQuizApi(examId, topicId, { attemptId: session.attemptId, answers }),
      "Could not submit your answers",
    );
  }

  function timeout(answers: QuizAnswer[]) {
    if (!session || isSubmitting) return Promise.resolve();
    return finish(
      () => timeoutQuestQuizApi(examId, topicId, { attemptId: session.attemptId, answers }),
      "Could not record the timeout",
    );
  }

  return {
    session,
    outcome,
    startFailure,
    actionError,
    isStarting,
    isSubmitting,
    start,
    submit,
    timeout,
    currentUnlock: unlockQueue[0] ?? null,
    dismissUnlock: () => setUnlockQueue((queue) => queue.slice(1)),
    leave: () => (router.canGoBack() ? router.back() : router.replace("/(tabs)")),
  };
}
