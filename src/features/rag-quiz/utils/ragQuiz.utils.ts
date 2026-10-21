import {
  PACK_STATUS,
  PDF_MIME_TYPE,
  RAG_MAX_DOCS,
  RAG_MAX_FILE_BYTES,
  SESSION_STATUS,
} from "../constants/ragQuiz.constants";
import type { PickedPdf, RagPack, RagSession } from "../types/ragQuiz.types";

export function isPackTerminal(pack: RagPack): boolean {
  return pack.status === PACK_STATUS.READY || pack.status === PACK_STATUS.FAILED;
}

/** Embedding progress across all documents of a pack, 0–100. */
export function getPackProgress(pack: RagPack): { embedded: number; chunks: number; percent: number } {
  const chunks = pack.documents.reduce((sum, doc) => sum + doc.chunkCount, 0);
  const embedded = pack.documents.reduce((sum, doc) => sum + doc.embeddedCount, 0);
  if (pack.status === PACK_STATUS.READY) return { embedded: chunks, chunks, percent: 100 };
  return { embedded, chunks, percent: chunks === 0 ? 0 : Math.round((embedded / chunks) * 100) };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Merges newly picked PDFs into the current list, enforcing the client-side limits. */
export function mergePickedPdfs(
  current: PickedPdf[],
  picked: PickedPdf[],
): { files: PickedPdf[]; error: string | null } {
  const files = [...current];
  let error: string | null = null;

  for (const file of picked) {
    if (files.some((item) => item.uri === file.uri)) continue;
    if (file.mimeType !== PDF_MIME_TYPE && !file.name.toLowerCase().endsWith(".pdf")) {
      error = `"${file.name}" is not a PDF.`;
      continue;
    }
    if (file.size > RAG_MAX_FILE_BYTES) {
      error = `"${file.name}" is over the ${formatBytes(RAG_MAX_FILE_BYTES)} limit.`;
      continue;
    }
    if (files.length >= RAG_MAX_DOCS) {
      error = `You can add up to ${RAG_MAX_DOCS} PDFs.`;
      break;
    }
    files.push(file);
  }

  return { files, error };
}

export type SessionControls = {
  awaitingAnswer: boolean;
  canLoadQuestion: boolean;
  canNext: boolean;
  canExtend: boolean;
  canFinish: boolean;
  isReport: boolean;
};

/** Which buttons the quiz should offer. The server remains the source of truth. */
export function getSessionControls(session: RagSession): SessionControls {
  const item = session.currentItem;
  const active = session.status === SESSION_STATUS.ACTIVE;
  const awaitingAnswer = Boolean(item) && item?.userAnswerIndex == null;
  const answered = Boolean(item) && !awaitingAnswer;
  const atLimit = session.answeredCount >= session.questionLimit;

  return {
    awaitingAnswer,
    canLoadQuestion: active && !item,
    canNext: active && answered && !atLimit,
    canExtend: active && answered && session.canExtendTo !== null,
    canFinish: active && answered && session.answeredCount > 0,
    isReport: !active || Boolean(session.reportWeak || session.reportStrong),
  };
}
