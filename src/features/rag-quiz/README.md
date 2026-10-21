# RAG Quiz

Upload 1–3 PDFs, let the server prepare them, then quiz yourself.

## Flow
1. `RagHomeScreen` (`/more/rag`): pick PDFs with `expo-document-picker`, upload, or reuse a ready pack from history.
2. `RagPackScreen` (`/rag/[packId]`): `usePackProcessing` chains `POST .../process` until the pack is `ready` or `failed`.
3. `RagSessionScreen` (`/rag/session/[sessionId]`): answer, next, extend, finish for a report, optionally save it to Brain Clutter.

## API dependencies
`/api/rag-quiz/packs[/id][/process]` · `/sessions[/id]` · `/next` · `/answer` · `/extend` · `/report` · `/export-note`

## Known limitations
- Scoring, limits and storage quotas are server-owned; the client only pre-checks type, size and count.
- The question cap grows through the server's `canExtendTo` (10 → 20 → 40 → 50); there is no cap picker.
- The report is shown on screen only (no copy to clipboard).
