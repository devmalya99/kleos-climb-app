import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QUEST_QUERY_KEYS } from "@/features/quests";
import { REALM_QUERY_KEYS } from "@/features/realms";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";

import { commitImportPlanApi, previewImportPlanApi } from "../api/importPlan.api";
import type { ImportPlanProposal, ImportPlanReport } from "../types/campaigns.types";

/** Paste → preview → commit. Preview never saves; only `commit` writes. */
export function useImportPlan(examId: string) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [proposal, setProposal] = useState<ImportPlanProposal | null>(null);
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [report, setReport] = useState<ImportPlanReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewMutation = useMutation({
    mutationFn: (planText: string) => previewImportPlanApi(examId, planText),
  });

  const commitMutation = useMutation({
    mutationFn: (value: ImportPlanProposal) => commitImportPlanApi(examId, value),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: REALM_QUERY_KEYS.list(examId) }),
        queryClient.invalidateQueries({ queryKey: QUEST_QUERY_KEYS.list(examId) }),
      ]),
  });

  async function preview() {
    if (!text.trim()) {
      setError("Paste a study plan to continue.");
      return;
    }
    setError(null);
    try {
      const result = await previewMutation.mutateAsync(text.trim());
      setProposal(result.proposal);
      setPreviewMessage(result.message ?? null);
    } catch (err) {
      logger.warn("Import preview failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Could not read that plan"));
    }
  }

  async function commit() {
    if (!proposal) return;
    setError(null);
    try {
      const result = await commitMutation.mutateAsync(proposal);
      setReport(result.report);
      setProposal(null);
    } catch (err) {
      logger.error("Import commit failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Could not save the import"));
    }
  }

  return {
    text,
    setText,
    proposal,
    previewMessage,
    report,
    error,
    isPreviewing: previewMutation.isPending,
    isCommitting: commitMutation.isPending,
    preview,
    commit,
    discardPreview: () => setProposal(null),
  };
}
