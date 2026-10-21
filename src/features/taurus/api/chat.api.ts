import { apiStream } from "@/services/api";

import { TAURUS_CHAT_PATH } from "../constants/taurus.constants";
import type { TaurusMessage } from "../types/taurus.types";

type ChatRequest = {
  conversationId: string;
  messages: TaurusMessage[];
  signal: AbortSignal;
};

/**
 * Opens the chat stream. The server replays the full thread, runs its tools,
 * streams the reply as server-sent events and persists the conversation on finish.
 */
export function openChatStream({ conversationId, messages, signal }: ChatRequest) {
  return apiStream(TAURUS_CHAT_PATH, {
    body: { conversationId, messages, interactionMode: "chat" },
    signal,
  });
}
