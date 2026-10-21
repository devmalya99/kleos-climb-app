import { useQuery } from "@tanstack/react-query";

import { LEVEL_ANALYSER_QUERY_KEYS } from "@/features/level-analyser";
import { isLockedError } from "@/shared/utils/isLockedError";

import { getBadgesApi } from "../api/badges.api";

export function useBadges() {
  return useQuery({
    queryKey: LEVEL_ANALYSER_QUERY_KEYS.badges,
    queryFn: getBadgesApi,
    retry: (count, error) => !isLockedError(error) && count < 1,
  });
}
