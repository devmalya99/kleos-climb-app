# Taurus

Streaming chat study assistant with tool cards.

## APIs
`POST /api/taurus/chat` (SSE) · conversations CRUD

## Architecture
- `api/chat.api.ts` opens the SSE stream through `apiStream` (`@/services/api`, Expo streaming `fetch`).
- `utils/sseParser` + `utils/applyStreamChunk` decode the AI SDK UI message stream into messages and tool parts.
- `hooks/useTaurusChat` owns the live thread; `hooks/useTaurusConversations` owns history and the open conversation.

## Limitations
- Google Calendar consent deep-link remains web-only.
- Voice / VAD / TTS barge-in not in this slice. The mic and attach marks in the composer are visual only; chat streaming is wired.
- The status pill shows the active climb (goal, current camp, current step). It stays hidden when there is no trail.
- Assistant replies render as an insight card when the text has a numbered list or an `Elevation:` / `Altitude:` line. Other replies stay plain bubbles.
- Tool side effects invalidate exams, timetable, and brain-clutter queries.
