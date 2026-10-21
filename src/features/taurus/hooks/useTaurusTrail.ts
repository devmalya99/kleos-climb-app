import { useQuery } from "@tanstack/react-query";

import { CLIMB_QUERY_KEY, getClimbBoard, type Climb } from "@/features/mountain-climber";

export type TaurusTrailStatus = {
  trail: string;
  campLabel: string;
  phase: string;
};

export function useTaurusTrail(): TaurusTrailStatus | null {
  const query = useQuery({
    queryKey: [...CLIMB_QUERY_KEY, null],
    queryFn: () => getClimbBoard(null),
  });

  return trailStatus(query.data?.climb ?? null);
}

function trailStatus(climb: Climb | null): TaurusTrailStatus | null {
  if (!climb || climb.levels.length === 0) return null;

  const current = climb.levels.findIndex((level) => level.progress < 100);
  const atSummit = current === -1;
  const index = atSummit ? climb.levels.length - 1 : current;
  const phase = atSummit ? "Summit" : climb.levels[index]?.title.trim() || "Push";

  return {
    trail: climb.goal,
    campLabel: `Camp ${index + 1}`,
    phase,
  };
}
