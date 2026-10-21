/**
 * Loose mirror of the AI SDK `UIMessage` part. The server stores and accepts
 * many part kinds (text, tool calls, sources…), so unknown fields are kept as-is.
 */
export type TaurusPart = {
  type: string;
  text?: string;
  state?: string;
  toolCallId?: string;
  toolName?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  [key: string]: unknown;
};

export type TaurusRole = "system" | "user" | "assistant";

export type TaurusMessage = {
  id: string;
  role: TaurusRole;
  parts: TaurusPart[];
};

export type TaurusConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
  preview: string | null;
};

export type TaurusConversationDetail = TaurusConversationSummary & {
  messages: TaurusMessage[];
  createdAt: string;
};

/** One JSON event of the AI SDK UI message stream (`data: {...}` lines). */
export type StreamChunk = {
  type: string;
  id?: string;
  delta?: string;
  messageId?: string;
  toolCallId?: string;
  toolName?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  dynamic?: boolean;
};

export type ConversationsResponse = { conversations: TaurusConversationSummary[] };
