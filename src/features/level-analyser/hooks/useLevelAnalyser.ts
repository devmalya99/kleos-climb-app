import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

import { useAuth } from "@/features/auth";
import { REALM_QUERY_KEYS } from "@/features/realms";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import type { QuizAnswer } from "@/shared/types/quiz.types";
import { playAnswerHaptic, playRewardHaptic } from "@/shared/utils/quizHaptics";

import { startLevelAnalyserApi, submitLevelAnalyserApi } from "../api/levelAnalyser.api";
import { LEVEL_ANALYSER_QUERY_KEYS } from "../constants/levelAnalyser.constants";
import type { LevelAnalyserOutcome, LevelAnalyserSession } from "../types/levelAnalyser.types";

type StartFailure = { message: string; retryAt?: string };

/** One Level Analyser run: start → answer 20 → submit → mastery result. The server scores. */
export function useLevelAnalyser(examId: string, categoryId: string) {
  const queryClient = useQueryClient();
  const { refreshMe } = useAuth();

  const [session, setSession] = useState<LevelAnalyserSession | null>(null);
  const [outcome, setOutcome] = useState<LevelAnalyserOutcome | null>(null);
  const [startFailure, setStartFailure] = useState<StartFailure | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHallOfFameUnlock, setShowHallOfFameUnlock] = useState(false);

  async function start() {
    setIsStarting(true);
    setStartFailure(null);
    setActionError(null);
    setOutcome(null);
    try {
      const result = await startLevelAnalyserApi(examId, categoryId);
      if (!result.ok) {
        setStartFailure({ message: result.error, retryAt: result.retryAt });
        return;
      }
      setSession({ attemptId: result.attemptId, questions: result.questions });
    } catch (error) {
      logger.error("Start level analyser failed", { message: getErrorMessage(error) });
      setStartFailure({ message: getErrorMessage(error, "Could not start the analyser") });
    } finally {
      setIsStarting(false);
    }
  }

  async function submit(answers: QuizAnswer[]) {
    if (!session) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const result = await submitLevelAnalyserApi(examId, categoryId, {
        attemptId: session.attemptId,
        answers,
      });
      if (!result.ok) {
        setActionError(result.error);
        return;
      }
      playAnswerHaptic(true);
      setOutcome(result);
      setSession(null);
      if (result.report) {
        queryClient.setQueryData(
          LEVEL_ANALYSER_QUERY_KEYS.progressReport(categoryId),
          result.report,
        );
      }
      if (result.hallOfFameUnlocked) {
        playRewardHaptic();
        setShowHallOfFameUnlock(true);
      }
      void queryClient.invalidateQueries({ queryKey: REALM_QUERY_KEYS.analyserStatuses(examId) });
      void queryClient.invalidateQueries({ queryKey: LEVEL_ANALYSER_QUERY_KEYS.badges });
      try {
        await refreshMe();
      } catch (error) {
        logger.warn("Refresh me after analyser failed", { message: getErrorMessage(error) });
      }
    } catch (error) {
      logger.error("Submit level analyser failed", { message: getErrorMessage(error) });
      setActionError(getErrorMessage(error, "Could not submit your answers"));
    } finally {
      setIsSubmitting(false);
    }
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
    showHallOfFameUnlock,
    dismissUnlock: () => setShowHallOfFameUnlock(false),
    leave: () => (router.canGoBack() ? router.back() : router.replace("/(tabs)")),
  };
}
