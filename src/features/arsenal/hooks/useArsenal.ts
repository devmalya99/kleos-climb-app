import { useQuery } from "@tanstack/react-query";

import { isLockedError } from "@/shared/utils/isLockedError";

import { getArsenalApi } from "../api/arsenal.api";
import { ARSENAL_QUERY_KEYS } from "../constants/arsenal.constants";

export function useArsenal() {
  return useQuery({
    queryKey: ARSENAL_QUERY_KEYS.all,
    queryFn: getArsenalApi,
    // A locked feature will not unlock on retry.
    retry: (count, error) => !isLockedError(error) && count < 1,
  });
}
