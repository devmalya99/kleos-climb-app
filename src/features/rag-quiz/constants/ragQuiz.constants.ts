export const RAG_QUERY_KEYS = {
  packs: ["rag-quiz", "packs"] as const,
  pack: (packId: string) => ["rag-quiz", "pack", packId] as const,
  session: (sessionId: string) => ["rag-quiz", "session", sessionId] as const,
};

export const PACK_STATUS = {
  READY: "ready",
  FAILED: "failed",
} as const;

export const SESSION_STATUS = {
  ACTIVE: "active",
} as const;

export const RAG_MIN_DOCS = 1;
export const RAG_MAX_DOCS = 3;
export const RAG_MAX_FILE_BYTES = 10 * 1024 * 1024;
export const RAG_MAX_PAGES = 100;
export const PDF_MIME_TYPE = "application/pdf";

export const ragHref = {
  home: "/more/rag",
  pack: (packId: string) => `/rag/${packId}` as const,
  session: (sessionId: string) => `/rag/session/${sessionId}` as const,
};
