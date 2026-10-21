import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

import { useQuestMutations } from "@/features/quests";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import type { ParsedTopic } from "@/shared/types/study.types";

import { generateRealmQuestsApi } from "../api/realms.api";
import { autofillNotesSchema } from "../utils/realm.schemas";

import { useRealms } from "./useRealms";

/**
 * Two-step flow: generate a preview (no DB write), then explicitly accept
 * to persist through the quests bulk-create endpoint.
 */
export function useRealmAutofill(examId: string, categoryId: string) {
  const realmsQuery = useRealms(examId);
  const { bulkCreate } = useQuestMutations(examId);
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState<ParsedTopic[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const realm = realmsQuery.data?.find((item) => item.id === categoryId) ?? null;

  const generate = useMutation({
    mutationFn: (topicsHint: string) =>
      generateRealmQuestsApi(examId, { realmName: realm?.name ?? "", topicsHint }),
  });

  async function onGenerate() {
    if (!realm) return;
    const parsed = autofillNotesSchema.safeParse(notes);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid notes");
      return;
    }
    setError(null);
    try {
      const result = await generate.mutateAsync(parsed.data);
      setPreview(result.topics);
      setMessage(result.message ?? null);
    } catch (err) {
      logger.warn("Autofill generate failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Could not generate quests"));
    }
  }

  async function onAccept() {
    if (!preview) return;
    setError(null);
    try {
      await bulkCreate.mutateAsync({ topics: preview });
      router.back();
    } catch (err) {
      logger.error("Autofill accept failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Could not save quests"));
    }
  }

  return {
    realm,
    isLoadingRealm: realmsQuery.isLoading,
    notes,
    setNotes,
    preview,
    message,
    error,
    isGenerating: generate.isPending,
    isAccepting: bulkCreate.isPending,
    onGenerate,
    onAccept,
    discardPreview: () => setPreview(null),
  };
}
