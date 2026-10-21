import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";

import { getPackApi, processPackApi } from "../api/packs.api";
import { RAG_QUERY_KEYS } from "../constants/ragQuiz.constants";
import { isPackTerminal } from "../utils/ragQuiz.utils";

/**
 * Loads a pack and chains `/process` calls until it is `ready` or `failed`.
 * The server does a bounded amount of work per call, so progress arrives in steps.
 */
export function usePackProcessing(packId: string) {
  const queryClient = useQueryClient();
  const key = RAG_QUERY_KEYS.pack(packId);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const loopRunning = useRef(false);
  const cancelled = useRef(false);

  const packQuery = useQuery({ queryKey: key, queryFn: () => getPackApi(packId) });

  const runLoop = useCallback(async () => {
    if (loopRunning.current) return;
    loopRunning.current = true;
    setError(null);
    setIsProcessing(true);
    try {
      let pack = await queryClient.fetchQuery({ queryKey: key, queryFn: () => getPackApi(packId) });
      while (!cancelled.current && !isPackTerminal(pack)) {
        pack = await processPackApi(packId);
        queryClient.setQueryData(key, pack);
      }
    } catch (err) {
      logger.warn("Pack processing failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Processing failed"));
    } finally {
      loopRunning.current = false;
      setIsProcessing(false);
    }
  }, [key, packId, queryClient]);

  useEffect(() => {
    cancelled.current = false;
    void runLoop();
    return () => {
      cancelled.current = true;
    };
  }, [runLoop]);

  return {
    pack: packQuery.data ?? null,
    isLoading: packQuery.isLoading,
    loadError: packQuery.error,
    isProcessing,
    error,
    retry: () => void runLoop(),
  };
}
