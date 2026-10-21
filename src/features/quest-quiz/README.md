# Quest Quiz

The "Final showdown" gate for claiming a quest: 5 MCQs, a perfect score passes and awards XP.

## Architecture
- `hooks/useQuestQuiz` — orchestrates start → submit/timeout → result. Grading, XP, skill XP and unlock flags come only from server responses. On a pass it invalidates quests/analytics/arsenal queries and calls `useAuth().refreshMe()` so feature unlocks update.
- `components/QuestQuizArena` — mounted with `key={attemptId}` so answers reset per attempt. Uses the shared `QuizArena` (question UI only), `QuizNav` and `useQuizAnswers`.
- `components/QuestQuizResult` — pass/fail overlay. Missed-question review only appears on a failed result (the server reveals `correctOption` then, never before).
- First-time `arsenalUnlocked` / `battleStatsUnlocked` flags queue the shared `UnlockOverlay`.
- Haptics: success/error notification on result; selection tick on option tap.

## Routes owned
`app/quest-quiz/[examId]/[topicId].tsx` (full-screen modal)

## API dependencies
`POST /api/exams/[examId]/topics/[topicId]/quest-quiz/{start,submit,timeout}`. These return action-shaped JSON at HTTP 200 (`{ ok: false, error, retryAt? }` on failure), handled in the hook.

## Known limitations
- Only the `overall` timer mode is honoured (the server currently always returns `{ enabled: false }`); `per-question` timers are ignored here.
- Starting a trial costs an LLM call, so it begins from an explicit "Begin trial" button rather than on mount.
- Leaving mid-attempt does not notify the server (there is no abandon endpoint); the client simply discards the attempt.
- Cooldown is whatever the server sends in `retryAt`; the client never computes one.
