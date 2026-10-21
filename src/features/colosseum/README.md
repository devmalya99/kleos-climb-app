# Colosseum

Per-realm, infinite, timed arena. The player keeps striking until elixirs hit 0. Every correct strike earns Arsenal skill XP.

## Architecture
- `hooks/useColosseum` — the run state machine. Every server response replaces the local snapshot (`session`: elixirs, streak, XP, batch counters), so elixir/streak/daily-limit logic is never recomputed on the client. Status (`attemptsRemaining`, `canStart`, personal best) is a TanStack Query read.
- Correct strike → advance immediately (success haptic, extra heavy haptic if an elixir was earned). Wrong strike that does not end the run → the correct option is revealed (`answerFeedback`, only available after grading) and the player taps "Next strike".
- `components/ColosseumArena` — shared `QuizArena` + `ColosseumHud`; mounted with `key={question.id}` so selection and timer reset per strike. The per-question countdown (from `timer.secondsByQuestionId`) calls `timeout` on expiry and pauses while a request is in flight.
- `components/ColosseumResult` — end overlay: totals, record breaks, rank-up text. First-time `arsenalUnlocked` queues the shared `UnlockOverlay`.
- Back handling: Android hardware back and the Surrender button both ask for confirmation then call `surrender`; iOS swipe-back is disabled while a run is active.

## Routes owned
`app/colosseum/[examId]/[categoryId].tsx` (full-screen modal)

## API dependencies
`GET .../colosseum/status` · `POST .../colosseum/{start,answer,timeout,surrender}` under `/api/exams/[examId]/categories/[categoryId]`. Mutating endpoints return action-shaped JSON at HTTP 200 (`{ ok: false, error }` on failure).

## Known limitations
- Rule numbers on the rules screen (3 elixirs, max 10, +1 per 6, 30 XP, 3 runs/day) are display copies of server constants and may drift if the server changes them.
- Wrong-answer feedback waits for a tap rather than the web's 10-second timer.
- Force-quitting the app mid-run leaves the run to the server to resolve.
