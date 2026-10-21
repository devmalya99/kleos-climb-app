import { useQuery } from "@tanstack/react-query";

import { listQuestsApi } from "../api/topics.api";
import { QUEST_QUERY_KEYS } from "../constants/quests.constants";

/** All quests (topics) for a campaign. Filter by realm with `filterQuestsByRealm`. */
export function useQuests(examId: string) {
  return useQuery({
    queryKey: QUEST_QUERY_KEYS.list(examId),
    queryFn: () => listQuestsApi(examId),
    enabled: Boolean(examId),
  });
}
