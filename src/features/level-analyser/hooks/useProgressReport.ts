import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";

import {
  ensureProgressReportApi,
  getProgressReportApi,
  regenerateProgressReportApi,
} from "../api/levelAnalyser.api";
import { LEVEL_ANALYSER_QUERY_KEYS } from "../constants/levelAnalyser.constants";
import type { PublicProgressReport } from "../types/levelAnalyser.types";

/** Cached report (GET), plus explicit generate (ensure) and regenerate actions. */
export function useProgressReport(examId: string, categoryId: string, enabled = true) {
  const queryClient = useQueryClient();
  const key = LEVEL_ANALYSER_QUERY_KEYS.progressReport(categoryId);
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: key,
    queryFn: () => getProgressReportApi(examId, categoryId),
    enabled: enabled && Boolean(categoryId),
  });

  function store(report: PublicProgressReport) {
    queryClient.setQueryData(key, report);
  }

  const ensure = useMutation({ mutationFn: () => ensureProgressReportApi(examId, categoryId) });
  const regenerate = useMutation({
    mutationFn: () => regenerateProgressReportApi(examId, categoryId),
  });

  async function run(
    mutation: typeof ensure | typeof regenerate,
    fallback: string,
  ) {
    setActionError(null);
    try {
      const result = await mutation.mutateAsync();
      if (!result.ok) {
        setActionError(result.error);
        return;
      }
      store(result.report);
    } catch (error) {
      logger.error("Progress report request failed", { message: getErrorMessage(error) });
      setActionError(getErrorMessage(error, fallback));
    }
  }

  return {
    report: query.data ?? null,
    isLoading: query.isLoading,
    loadError: query.error,
    reload: () => void query.refetch(),
    isWorking: ensure.isPending || regenerate.isPending,
    actionError,
    generate: () => run(ensure, "Could not generate the report"),
    regenerate: () => run(regenerate, "Could not regenerate the report"),
  };
}
