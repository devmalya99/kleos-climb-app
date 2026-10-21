export type ClutterGroup = {
  id: string;
  name: string;
  accent: string;
  icon: string;
  noteCount: number;
  isPinned: boolean;
  pinnedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClutterStats = {
  noteCount: number;
  bucketCount: number;
  lastActivityAt: string | null;
  /** Display-only percentage of the ~50k character budget. */
  storagePercent: number;
};

export type ClutterNote = {
  id: string;
  groupId: string;
  title: string;
  content: string;
  isTask: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

/** A note flagged as a task that is not completed yet. */
export type PendingNoteTask = {
  id: string;
  title: string;
  groupName: string;
};

export type GroupsResponse = { groups: ClutterGroup[]; stats: ClutterStats };
export type GroupResponse = { group: ClutterGroup };
export type GroupDetailResponse = { group: ClutterGroup; notes: ClutterNote[] };
export type NoteResponse = { note: ClutterNote };
export type PendingTasksResponse = { tasks: PendingNoteTask[] };

export type GroupUpdateInput = {
  name?: string;
  /** true pins (max 3 on the server), false unpins. */
  pinned?: boolean;
};

export type NoteCreateInput = {
  groupId: string;
  title: string;
  content?: string;
  isTask?: boolean;
};

export type NoteUpdateInput = {
  title?: string;
  content?: string;
  isTask?: boolean;
  isCompleted?: boolean;
};

export type NoteDraft = { title: string; content: string };

/** AI rewrite proposal. It is only a preview until the user applies and saves it. */
export type RewriteResult = NoteDraft;
