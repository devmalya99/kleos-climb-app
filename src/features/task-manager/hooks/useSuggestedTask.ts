import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { logger } from "@/services/logging/logger";

import { fetchSuggestedTask } from "../api/taskSuggestion.api";
import { SUGGESTED_TASK_COPY } from "../constants/taskManager.constants";
import type { SuggestedTask } from "../types/taskManager.types";

/** Home suggestion. A new visit picks with no exclude. Nothing is written to disk. */
export function useSuggestedTask() {
  const [task, setTask] = useState<SuggestedTask | null>(null);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const taskRef = useRef<SuggestedTask | null>(null);
  const requestRef = useRef(0);

  const load = useCallback(async (excludeTaskId?: string) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setPicking(true);
    setError(null);
    try {
      const next = await fetchSuggestedTask(excludeTaskId);
      if (requestId !== requestRef.current) return;
      taskRef.current = next;
      setTask(next);
    } catch (caught) {
      if (requestId !== requestRef.current) return;
      logger.warn("Could not load a suggested task", { error: caught });
      if (taskRef.current) {
        setError(SUGGESTED_TASK_COPY.pickError);
      }
    } finally {
      if (requestId === requestRef.current) setPicking(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const pickAnother = useCallback(() => {
    void load(taskRef.current?.id);
  }, [load]);

  return { task, picking, error, pickAnother };
}
