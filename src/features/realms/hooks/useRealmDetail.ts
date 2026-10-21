import { router } from "expo-router";
import { useState } from "react";

import {
  filterQuestsByRealm,
  moveQuestId,
  useQuestMutations,
  useQuests,
  type QuestFormValues,
} from "@/features/quests";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import { confirmAction } from "@/shared/utils/confirmAction";
import type { PublicTopic } from "@/shared/types/study.types";

import { realmHref } from "../constants/realms.constants";
import { getAnalyseAvailability } from "../utils/analyseAvailability";

import { useRealmAnalyserStatuses, useRealms } from "./useRealms";
import { useRealmMutations } from "./useRealmMutations";

/** Business logic for the realm detail screen: data, quest CRUD, navigation. */
export function useRealmDetail(examId: string, categoryId: string) {
  const realmsQuery = useRealms(examId);
  const questsQuery = useQuests(examId);
  const statusesQuery = useRealmAnalyserStatuses(examId);
  const quests = useQuestMutations(examId);
  const realmMutations = useRealmMutations(examId);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<PublicTopic | null>(null);
  const [error, setError] = useState<string | null>(null);

  const realm = realmsQuery.data?.find((item) => item.id === categoryId) ?? null;
  const realmQuests = filterQuestsByRealm(questsQuery.data ?? [], categoryId);
  const analyse = getAnalyseAvailability(
    realmQuests.length,
    statusesQuery.data?.[categoryId],
  );

  function openEditor(quest: PublicTopic | null) {
    setError(null);
    setEditing(quest);
    setEditorOpen(true);
  }

  async function saveQuest(values: QuestFormValues) {
    if (!realm) return;
    setError(null);
    try {
      if (editing) {
        await quests.update.mutateAsync({ topicId: editing.id, input: values });
      } else {
        await quests.create.mutateAsync({
          ...values,
          description: values.description || undefined,
          categoryName: realm.name,
        });
      }
      setEditorOpen(false);
    } catch (err) {
      logger.error("Save quest failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Could not save quest"));
    }
  }

  function deleteQuest(quest: PublicTopic) {
    confirmAction(
      { title: "Delete quest?", message: `"${quest.name}" will be removed.` },
      async () => {
        try {
          await quests.remove.mutateAsync(quest.id);
        } catch (err) {
          logger.error("Delete quest failed", { message: getErrorMessage(err) });
          setError(getErrorMessage(err, "Could not delete quest"));
        }
      },
    );
  }

  async function moveQuest(index: number, direction: "up" | "down") {
    const next = moveQuestId(realmQuests.map((q) => q.id), index, direction);
    if (!next) return;
    try {
      await quests.reorder.mutateAsync({ categoryId, topicIds: next });
    } catch (err) {
      logger.error("Reorder quests failed", { message: getErrorMessage(err) });
      setError(getErrorMessage(err, "Could not reorder quests"));
    }
  }

  function deleteRealm() {
    if (!realm) return;
    confirmAction(
      {
        title: "Delete realm?",
        message: `"${realm.name}" and all of its quests will be permanently removed.`,
      },
      async () => {
        try {
          await realmMutations.remove.mutateAsync(realm.name);
          router.back();
        } catch (err) {
          logger.error("Delete realm failed", { message: getErrorMessage(err) });
          setError(getErrorMessage(err, "Could not delete realm"));
        }
      },
    );
  }

  return {
    realm,
    quests: realmQuests,
    analyse,
    isLoading: realmsQuery.isLoading || questsQuery.isLoading,
    loadError: realmsQuery.error ?? questsQuery.error,
    error,
    editorOpen,
    editing,
    isSaving: quests.create.isPending || quests.update.isPending,
    openEditor,
    closeEditor: () => setEditorOpen(false),
    saveQuest,
    deleteQuest,
    moveQuest,
    deleteRealm,
    claimQuest: (quest: PublicTopic) =>
      router.push(realmHref.questQuiz(examId, quest.id)),
    openAnalyser: () => router.push(realmHref.analyser(examId, categoryId)),
    openColosseum: () => router.push(realmHref.colosseum(examId, categoryId)),
    openAutofill: () => router.push(realmHref.autofill(examId, categoryId)),
    retry: () => {
      void realmsQuery.refetch();
      void questsQuery.refetch();
    },
  };
}
