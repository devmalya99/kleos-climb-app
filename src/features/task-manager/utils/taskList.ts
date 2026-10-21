import type { ReviewItem, Task, TaskReplacement } from "../types/taskManager.types";
import {
  MAX_SPLIT_TITLES,
  MIN_SPLIT_TITLES,
} from "../constants/taskManager.constants";

/** Open tasks first (server order), completed tasks last. */
export function sortTasksForDisplay(tasks: Task[]): Task[] {
  const open = tasks.filter((task) => !task.isCompleted);
  const done = tasks.filter((task) => task.isCompleted);
  return [...open, ...done];
}

/** Review items the server wants split and that carry a usable split proposal. */
export function getSplittableItems(items: ReviewItem[]): ReviewItem[] {
  return items.filter(
    (item) =>
      item.status === "needs_split" &&
      (item.suggestedTitles?.length ?? 0) >= MIN_SPLIT_TITLES,
  );
}

export function buildReplacements(
  items: ReviewItem[],
  selectedTaskIds: ReadonlySet<string>,
): TaskReplacement[] {
  return getSplittableItems(items)
    .filter((item) => selectedTaskIds.has(item.taskId))
    .map((item) => ({
      taskId: item.taskId,
      titles: (item.suggestedTitles ?? []).slice(0, MAX_SPLIT_TITLES),
    }));
}
