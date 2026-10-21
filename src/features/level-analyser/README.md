# Level Analyser

Realm-level mastery check: 20 MCQs (10 basic, 5 deeper, 5 advanced), 5 marks each, max 100. The server scores, awards the tier badge and compiles an AI progress report. Scoped by realm (`categoryId`), not by quest.

## Architecture
- `hooks/useLevelAnalyser` — start → submit state machine. On success it caches the returned report, invalidates realm analyser statuses and the badges key, and calls `useAuth().refreshMe()`. `hallOfFameUnlocked` queues the shared `UnlockOverlay`.
- `hooks/useProgressReport` — cached report (`GET`, never calls AI), plus explicit `ensure` (generate) and `regenerate`.
- `components/LevelAnalyserArena` — 20-step arena built on the shared `QuizArena`, `QuizNav`, `useQuizAnswers`. Mount with `key={attemptId}`.
- `components/ProgressReportSheet` / `ProgressReportView` — reusable report viewer (also used by Hall of Fame via the public index).
- Cooldown/eligibility is the server's `canChallenge` / `retryAt` from `realm-analyser-statuses` (owned by `realms`); the client never computes it.

## Routes owned
`app/level-analyser/[examId]/[categoryId].tsx` (full-screen modal)

## API dependencies
`POST /api/exams/[examId]/categories/[categoryId]/level-analyser/{start,submit}` · `GET|POST .../progress-report` (+ `/ensure`, `/regenerate`) · `GET .../realm-analyser-statuses` (via `realms`)

Start/submit/ensure/regenerate return action-shaped JSON at HTTP 200 (`{ ok: false, error }` on failure).

## Known limitations
- The report is shown as plain text; the web's section parser is not ported.
- `ANY_EXAM_ID` is used when opening a report from Hall of Fame (a badge has no `examId`). The progress-report routes only use `categoryId` today, so this works, but it relies on that server behaviour.
- "Seen unlock" is not persisted locally: the server only reports `hallOfFameUnlocked: true` on the first badge.
