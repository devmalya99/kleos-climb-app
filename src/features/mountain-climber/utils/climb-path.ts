import { MAX_LEVELS, SUMMIT_ALTITUDE_METERS } from "../constants/climb.constants";
import type { Climb, ClimbLevel, ClimbStats } from "../types/climb.types";
import type { ClimbAction } from "./climb.schemas";

const MS_PER_DAY = 86_400_000;

/*
 * Invariant kept by every function here: cleared levels form a contiguous
 * block at the start of `levels`. That is what makes "one level at a time"
 * enforceable — the current level is simply the first pending one.
 */

export function createClimb(
  goal: string,
  deadline: string,
  keySteps: { title: string; description: string }[],
  now: Date,
  createId: () => string,
): Climb {
  return {
    // The database assigns the summit id on insert. This placeholder never leaves the server.
    id: "",
    goal,
    deadline,
    createdAt: now.toISOString(),
    levels: keySteps.map((step) => ({
      id: createId(),
      title: step.title,
      description: step.description,
      progress: 0,
      completedAt: null,
    })),
  };
}

export function getCurrentLevelIndex(levels: ClimbLevel[]): number {
  return levels.findIndex((level) => level.completedAt === null);
}

/** Title and description can change after a task is cleared. Progress stays where it is. */
export function editLevel(
  climb: Climb,
  levelId: string,
  title: string,
  description: string,
): Climb {
  const current = climb.levels.find((level) => level.id === levelId);
  if (!current || (current.title === title && current.description === description)) return climb;
  return {
    ...climb,
    levels: climb.levels.map((level) =>
      level.id === levelId ? { ...level, title, description } : level,
    ),
  };
}

/** New levels go to the top of the trail (the end of the array, under the summit). */
export function addLevel(climb: Climb, title: string, description: string, id: string): Climb {
  if (climb.levels.length >= MAX_LEVELS) return climb;
  return {
    ...climb,
    levels: [...climb.levels, { id, title, description, progress: 0, completedAt: null }],
  };
}

export function removePendingLevel(climb: Climb, levelId: string): Climb {
  const levels = climb.levels.filter(
    (level) => level.id !== levelId || level.completedAt !== null,
  );
  // A climb needs at least one level to stay meaningful.
  return levels.length === 0 ? climb : { ...climb, levels };
}

export function clearCurrentLevel(climb: Climb, now: Date): Climb {
  const currentIndex = getCurrentLevelIndex(climb.levels);
  if (currentIndex === -1) return climb;
  return {
    ...climb,
    levels: climb.levels.map((level, index) =>
      index === currentIndex ? { ...level, progress: 100, completedAt: now.toISOString() } : level,
    ),
  };
}

/** Undo for an accidental clear: only the most recently cleared level can be reopened. */
export function reopenLastClearedLevel(climb: Climb): Climb {
  const currentIndex = getCurrentLevelIndex(climb.levels);
  const lastClearedIndex = currentIndex === -1 ? climb.levels.length - 1 : currentIndex - 1;
  if (lastClearedIndex < 0) return climb;
  return {
    ...climb,
    levels: climb.levels.map((level, index) =>
      index === lastClearedIndex ? { ...level, progress: 99, completedAt: null } : level,
    ),
  };
}

/** Only the current task moves. 100 marks it cleared and opens the next one. */
export function setLevelProgress(
  climb: Climb,
  levelId: string,
  progress: number,
  now: Date,
): Climb {
  const currentIndex = getCurrentLevelIndex(climb.levels);
  if (currentIndex === -1 || climb.levels[currentIndex]?.id !== levelId) return climb;
  const nextProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const current = climb.levels[currentIndex];
  if (!current || current.progress === nextProgress) return climb;
  return {
    ...climb,
    levels: climb.levels.map((level, index) =>
      index === currentIndex
        ? {
            ...level,
            progress: nextProgress,
            completedAt: nextProgress === 100 ? now.toISOString() : null,
          }
        : level,
    ),
  };
}

/** Moves `activeId` to the position of `overId`. Cleared levels are frozen and never move. */
export function movePendingLevel(climb: Climb, activeId: string, overId: string): Climb {
  const cleared = climb.levels.filter((level) => level.completedAt !== null);
  const pending = climb.levels.filter((level) => level.completedAt === null);
  const fromIndex = pending.findIndex((level) => level.id === activeId);
  const toIndex = pending.findIndex((level) => level.id === overId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return climb;

  const reordered = [...pending];
  const [moved] = reordered.splice(fromIndex, 1);
  if (!moved) return climb;
  reordered.splice(toIndex, 0, moved);
  return { ...climb, levels: [...cleared, ...reordered] };
}

/** Single entry point shared by the server (source of truth) and the client (optimistic update). */
export function applyClimbAction(
  climb: Climb,
  action: ClimbAction,
  now: Date,
  createId: () => string,
): Climb {
  switch (action.type) {
    case "clear":
      return clearCurrentLevel(climb, now);
    case "undo":
      return reopenLastClearedLevel(climb);
    case "add":
      return addLevel(climb, action.title, action.description, createId());
    case "remove":
      return removePendingLevel(climb, action.levelId);
    case "edit":
      return editLevel(climb, action.levelId, action.title, action.description);
    case "setProgress":
      return setLevelProgress(climb, action.levelId, action.progress, now);
    case "move":
      return movePendingLevel(climb, action.activeId, action.overId);
  }
}

export function getClimbStats(climb: Climb, now: Date): ClimbStats {
  const totalLevels = climb.levels.length;
  const currentLevelIndex = getCurrentLevelIndex(climb.levels);
  const clearedLevels = currentLevelIndex === -1 ? totalLevels : currentLevelIndex;
  const progress = totalLevels === 0 ? 0 : clearedLevels / totalLevels;
  // Deadline is a calendar day; count whole days from today's local midnight.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [year, month, day] = climb.deadline.split("-").map(Number);
  const deadline = new Date(year, (month ?? 1) - 1, day);

  return {
    totalLevels,
    clearedLevels,
    currentLevelIndex,
    progressPercent: Math.round(progress * 100),
    altitudeMeters: Math.round(progress * SUMMIT_ALTITUDE_METERS),
    daysLeft: Math.round((deadline.getTime() - today.getTime()) / MS_PER_DAY),
    isSummitReached: totalLevels > 0 && currentLevelIndex === -1,
  };
}
