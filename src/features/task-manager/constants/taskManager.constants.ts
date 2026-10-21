export const TASK_QUERY_KEYS = {
  all: ["task-manager"] as const,
  categories: ["task-manager", "categories"] as const,
  tasks: (categoryId: string) => ["task-manager", "tasks", categoryId] as const,
};

export const CATEGORY_NAME_MAX = 80;
export const TASK_TITLE_MAX = 200;
export const TASK_NOTES_MAX = 2000;
export const EXPAND_CONTENT_MAX = 20_000;
export const MAX_EXPAND_TASKS = 20;
/** The server accepts 2–8 replacement titles per split task. */
export const MIN_SPLIT_TITLES = 2;
export const MAX_SPLIT_TITLES = 8;

export const TIMER_MIN_MINUTES = 1;
export const TIMER_MAX_MINUTES = 180;
export const TIMER_DEFAULT_MINUTES = 25;
export const TIMER_PRESET_MINUTES = [15, 25, 45, 60] as const;
