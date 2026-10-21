import { router } from "expo-router";
import { useState } from "react";

import { useQuests } from "@/features/quests";
import {
  realmHref,
  useRealmAnalyserStatuses,
  useRealmMutations,
  useRealms,
} from "@/features/realms";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import { confirmAction } from "@/shared/utils/confirmAction";

import { campaignHref } from "../constants/campaigns.constants";

import { useCampaignMutations } from "./useCampaignMutations";
import { useExam } from "./useExams";

/** Data + actions for the campaign hub: realms, import entry, edit and delete. */
export function useCampaignDetail(examId: string) {
  const examQuery = useExam(examId);
  const realmsQuery = useRealms(examId);
  const questsQuery = useQuests(examId);
  const statusesQuery = useRealmAnalyserStatuses(examId);
  const realmMutations = useRealmMutations(examId);
  const campaignMutations = useCampaignMutations();

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questCountByRealm = new Map<string, number>();
  for (const quest of questsQuery.data ?? []) {
    if (!quest.categoryId) continue;
    questCountByRealm.set(quest.categoryId, (questCountByRealm.get(quest.categoryId) ?? 0) + 1);
  }

  function deleteCampaign() {
    if (!examQuery.data) return;
    confirmAction(
      {
        title: "Delete campaign?",
        message: `"${examQuery.data.name}", its realms, and all quests will be permanently removed.`,
      },
      async () => {
        try {
          await campaignMutations.remove.mutateAsync(examId);
          router.replace("/(tabs)");
        } catch (err) {
          logger.error("Delete campaign failed", { message: getErrorMessage(err) });
          setError(getErrorMessage(err, "Could not delete campaign"));
        }
      },
    );
  }

  return {
    exam: examQuery.data ?? null,
    realms: realmsQuery.data ?? [],
    statuses: statusesQuery.data ?? {},
    questCountByRealm,
    isLoading: examQuery.isLoading || realmsQuery.isLoading,
    loadError: examQuery.error ?? realmsQuery.error,
    error,
    editing,
    setEditing,
    isCreatingRealm: realmMutations.create.isPending,
    createRealm: (realmName: string) => realmMutations.create.mutateAsync(realmName),
    deleteCampaign,
    openRealm: (categoryId: string) => router.push(realmHref.detail(examId, categoryId)),
    openImport: () => router.push(campaignHref.importPlan(examId)),
    retry: () => {
      void examQuery.refetch();
      void realmsQuery.refetch();
    },
  };
}
