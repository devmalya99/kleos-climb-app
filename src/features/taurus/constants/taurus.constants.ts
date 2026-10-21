export const TAURUS_QUERY_KEYS = {
  all: ["taurus"] as const,
  conversations: ["taurus", "conversations"] as const,
  /** `null` is the server-chosen "active" (most recent) conversation. */
  conversation: (conversationId: string | null) =>
    ["taurus", "conversation", conversationId ?? "active"] as const,
};

export const TAURUS_CHAT_PATH = "/api/taurus/chat";
export const TAURUS_MAX_CONVERSATIONS = 30;
export const TAURUS_MESSAGE_MAX_CHARS = 4000;

export const TOOL_PART_PREFIX = "tool-";
export const DYNAMIC_TOOL_PART = "dynamic-tool";

export const TOOL_STATE = {
  INPUT_STREAMING: "input-streaming",
  INPUT_AVAILABLE: "input-available",
  OUTPUT_AVAILABLE: "output-available",
  OUTPUT_ERROR: "output-error",
} as const;

export const STREAM_DONE_SENTINEL = "[DONE]";

export const TAURUS_QUICK_PROMPTS = [
  {
    id: "today-plan",
    label: "Today's study plan",
    message:
      "Look at my quests, then help me plan what to study for the rest of today.",
  },
  {
    id: "find-tutorial",
    label: "Find a tutorial",
    message:
      "Find a good YouTube tutorial for a topic I'm struggling with. Ask me which topic if you need to.",
  },
  {
    id: "quiz-me",
    label: "Quiz me",
    message: "Quiz me on a topic from my current quests to test what I remember.",
  },
] as const;
