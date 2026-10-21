/** One step on the trail. Index 0 in `Climb.levels` is camp 1. */
export interface ClimbLevel {
  id: string;
  title: string;
  /** Empty when the user did not write one. Older climbs load as "". */
  description: string;
  /** 0–100. A cleared task is 100. */
  progress: number;
  /** ISO timestamp; null while the level is still pending. */
  completedAt: string | null;
}

export interface Climb {
  id: string;
  goal: string;
  /** yyyy-mm-dd, the day the user wants to stand on the summit. */
  deadline: string;
  createdAt: string;
  levels: ClimbLevel[];
}

/** Enough to draw the summit switcher without loading every trail. */
export interface ClimbSession {
  id: string;
  goal: string;
  deadline: string;
  clearedLevels: number;
  totalLevels: number;
  updatedAt: string;
}

export interface ClimbBoard {
  sessions: ClimbSession[];
  climb: Climb | null;
}

export interface ClimbStats {
  totalLevels: number;
  clearedLevels: number;
  /** Index into `levels` of the next level to clear; -1 when the summit is reached. */
  currentLevelIndex: number;
  progressPercent: number;
  altitudeMeters: number;
  daysLeft: number;
  isSummitReached: boolean;
}
