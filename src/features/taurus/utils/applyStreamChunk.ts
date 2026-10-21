import {
  DYNAMIC_TOOL_PART,
  TOOL_PART_PREFIX,
  TOOL_STATE,
} from "../constants/taurus.constants";
import type { StreamChunk, TaurusMessage, TaurusPart } from "../types/taurus.types";

function lastTextIndex(parts: TaurusPart[]): number {
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (parts[i]?.type === "text") return i;
  }
  return -1;
}

function patchPart(parts: TaurusPart[], index: number, patch: Partial<TaurusPart>): TaurusPart[] {
  return parts.map((part, i) => (i === index ? { ...part, ...patch } : part));
}

function patchToolPart(
  parts: TaurusPart[],
  toolCallId: string | undefined,
  patch: Partial<TaurusPart>,
): TaurusPart[] {
  if (!toolCallId) return parts;
  return parts.map((part) => (part.toolCallId === toolCallId ? { ...part, ...patch } : part));
}

function toolPartType(chunk: StreamChunk): string {
  return chunk.dynamic ? DYNAMIC_TOOL_PART : `${TOOL_PART_PREFIX}${chunk.toolName ?? "tool"}`;
}

/** Adds a tool part for a call we have not seen yet (input chunks can arrive in either order). */
function upsertToolPart(parts: TaurusPart[], chunk: StreamChunk, patch: Partial<TaurusPart>): TaurusPart[] {
  if (parts.some((part) => part.toolCallId === chunk.toolCallId)) {
    return patchToolPart(parts, chunk.toolCallId, patch);
  }
  return [
    ...parts,
    {
      type: toolPartType(chunk),
      toolCallId: chunk.toolCallId,
      ...(chunk.dynamic ? { toolName: chunk.toolName } : {}),
      state: TOOL_STATE.INPUT_STREAMING,
      ...patch,
    },
  ];
}

/**
 * Pure reducer: folds one AI SDK UI-message-stream chunk into the assistant
 * message being built. Unknown chunk types (steps, reasoning, sources) are ignored.
 */
export function applyStreamChunk(message: TaurusMessage, chunk: StreamChunk): TaurusMessage {
  const { parts } = message;

  switch (chunk.type) {
    case "start":
      return chunk.messageId ? { ...message, id: chunk.messageId } : message;

    case "text-start":
      return { ...message, parts: [...parts, { type: "text", text: "", state: "streaming" }] };

    case "text-delta": {
      const index = lastTextIndex(parts);
      if (index === -1) {
        return { ...message, parts: [...parts, { type: "text", text: chunk.delta ?? "", state: "streaming" }] };
      }
      const text = `${parts[index]?.text ?? ""}${chunk.delta ?? ""}`;
      return { ...message, parts: patchPart(parts, index, { text }) };
    }

    case "text-end": {
      const index = lastTextIndex(parts);
      return index === -1 ? message : { ...message, parts: patchPart(parts, index, { state: "done" }) };
    }

    case "tool-input-start":
      return { ...message, parts: upsertToolPart(parts, chunk, {}) };

    case "tool-input-available":
      return {
        ...message,
        parts: upsertToolPart(parts, chunk, { state: TOOL_STATE.INPUT_AVAILABLE, input: chunk.input }),
      };

    case "tool-output-available":
      return {
        ...message,
        parts: patchToolPart(parts, chunk.toolCallId, {
          state: TOOL_STATE.OUTPUT_AVAILABLE,
          output: chunk.output,
        }),
      };

    case "tool-output-error":
      return {
        ...message,
        parts: patchToolPart(parts, chunk.toolCallId, {
          state: TOOL_STATE.OUTPUT_ERROR,
          errorText: chunk.errorText,
        }),
      };

    default:
      return message;
  }
}
