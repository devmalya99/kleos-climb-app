export type TaskCategory = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  categoryId: string;
  title: string;
  notes: string;
  isCompleted: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** A task the AI proposes. Not saved until the user accepts the preview. */
export type ProposedTask = {
  title: string;
  notes: string;
};

export type ReviewStatus = "ok" | "needs_split";

export type ReviewItem = {
  taskId: string;
  status: ReviewStatus;
  reason: string;
  suggestedTitles?: string[];
};

export type TaskReplacement = {
  taskId: string;
  titles: string[];
};

export type CategoriesResponse = { categories: TaskCategory[] };
export type CategoryResponse = { category: TaskCategory };
export type TasksResponse = { tasks: Task[] };
export type TaskResponse = { task: Task };

/** One open task chosen by the server for the Home suggestion. Not a second task record. */
export type SuggestedTask = {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
};
export type ReviewResponse = { items: ReviewItem[] };
export type ExpandResponse = { tasks: ProposedTask[] };

export type TaskCreateInput = {
  categoryId: string;
  title: string;
  notes?: string;
};

export type TaskUpdateInput = {
  title?: string;
  notes?: string;
  isCompleted?: boolean;
};
