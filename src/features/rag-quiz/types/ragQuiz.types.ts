export type RagDocument = {
  id: string;
  fileName: string;
  byteSize: number;
  status: string;
  extractedChars: number;
  chunkCount: number;
  embeddedCount: number;
  error: string | null;
};

export type RagPack = {
  id: string;
  status: string;
  statusMessage: string;
  topics: string[];
  error: string | null;
  documents: RagDocument[];
  createdAt: string;
  updatedAt: string;
};

/** A ready pack in history; its embeddings can be reused without re-uploading. */
export type RagPackSummary = {
  id: string;
  fileNames: string[];
  totalBytes: number;
  totalChunks: number;
  sessionCount: number;
  lastAccuracyPercent: number | null;
  createdAt: string;
  updatedAt: string;
};

export type RagSessionItem = {
  id: string;
  ordinal: number;
  prompt: string;
  options: string[];
  /** Server sends this only after the question is answered. */
  correctIndex: number | null;
  explanation: string | null;
  userAnswerIndex: number | null;
  isCorrect: boolean | null;
};

export type RagSession = {
  id: string;
  packId: string;
  topic: string;
  status: string;
  questionLimit: number;
  correctCount: number;
  wrongCount: number;
  answeredCount: number;
  reportWeak: string | null;
  reportStrong: string | null;
  currentItem: RagSessionItem | null;
  accuracyPercent: number;
  /** Non-null when the current set is finished and can grow to this cap. */
  canExtendTo: number | null;
  createdAt: string;
};

/** A PDF chosen with the document picker, before upload. */
export type PickedPdf = {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
};

export type PacksResponse = { packs: RagPackSummary[] };
export type PackResponse = { pack: RagPack };
export type SessionResponse = { session: RagSession };
export type ExportNoteResponse = { noteId: string };
