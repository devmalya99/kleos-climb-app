import {
  DYNAMIC_TOOL_PART,
  TOOL_PART_PREFIX,
  TOOL_STATE,
} from "../constants/taurus.constants";
import type { TaurusMessage, TaurusPart } from "../types/taurus.types";

export function isToolPart(part: TaurusPart): boolean {
  return part.type.startsWith(TOOL_PART_PREFIX) || part.type === DYNAMIC_TOOL_PART;
}

export function messageHasTools(message: TaurusMessage | undefined): boolean {
  return message?.parts.some(isToolPart) ?? false;
}

export function getMessageText(message: TaurusMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}

/** "get_timetable" → "get timetable". */
export function getToolLabel(part: TaurusPart): string {
  const name = part.type === DYNAMIC_TOOL_PART ? (part.toolName ?? "tool") : part.type.slice(TOOL_PART_PREFIX.length);
  return name.replace(/_/g, " ");
}

function isFinishedTool(part: TaurusPart): boolean {
  return part.state === TOOL_STATE.OUTPUT_AVAILABLE || part.state === TOOL_STATE.OUTPUT_ERROR;
}

/**
 * Messages as the server expects them. An aborted stream can leave a tool call
 * without a result, which the model API rejects, so unfinished tool parts and
 * empty messages are dropped from what we send back.
 */
export function toRequestMessages(messages: TaurusMessage[]): TaurusMessage[] {
  return messages
    .map((message) => ({
      ...message,
      parts: message.parts.filter((part) =>
        isToolPart(part) ? isFinishedTool(part) : part.type !== "text" || (part.text ?? "").length > 0,
      ),
    }))
    .filter((message) => message.parts.length > 0);
}
