import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CLIMB_QUERY_KEY, getClimbBoard, type Climb, type ClimbSession } from "@/features/mountain-climber";

export function useHomeSummits() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const boardQuery = useQuery({
    queryKey: [...CLIMB_QUERY_KEY, "home", selectedId],
    queryFn: () => getClimbBoard(selectedId),
  });

  const climb: Climb | null = boardQuery.data?.climb ?? null;
  const sessions: ClimbSession[] = boardQuery.data?.sessions ?? [];

  return {
    sessions,
    climb,
    activeId: selectedId ?? climb?.id ?? null,
    selectSummit: (id: string) => setSelectedId(id),
    isLoading: boardQuery.isPending,
    error: boardQuery.error,
    retry: () => boardQuery.refetch(),
  };
}
