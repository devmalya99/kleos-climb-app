export const CLUTTER_QUERY_KEYS = {
  all: ["brain-clutter"] as const,
  groups: ["brain-clutter", "groups"] as const,
  group: (groupId: string) => ["brain-clutter", "group", groupId] as const,
  pending: ["brain-clutter", "pending-tasks"] as const,
};

export const GROUP_NAME_MAX = 80;
export const NOTE_TITLE_MAX = 200;
export const NOTE_CONTENT_MAX = 20_000;
export const MAX_PINNED_GROUPS = 3;

export const clutterHref = {
  group: (groupId: string) => `/clutter/${groupId}` as const,
};

export const CLUTTER_MODES = [
  { value: "notes", label: "Notes" },
  { value: "tasks", label: "Tasks" },
] as const;

export type ClutterMode = (typeof CLUTTER_MODES)[number]["value"];

/**
 * Honey for Clutter controls. Dark mode's app accent is periwinkle, so this
 * screen keeps its own gold. `soft` is the selected mode pill in light mode.
 */
export const CLUTTER_HONEY = {
  light: { fill: "#F0B429", soft: "#F6E7C1", ink: "#1C1408" },
  dark: { fill: "#F5A524", soft: "#F5A524", ink: "#1A1204" },
} as const;

export type ClutterHoney = (typeof CLUTTER_HONEY)[keyof typeof CLUTTER_HONEY];
