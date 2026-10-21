# Battle Stats

Progress and pacing across campaigns. The server owns every aggregation and on-track calculation; the client only renders.

## Architecture
- `hooks/useBattleStats` — `useAnalytics` (global) and `useExamAnalytics` (only fetches once a campaign row is tapped). A 403 is not retried.
- `screens/BattleStatsScreen` — states: loading, locked (403 → `EmptyState`), error, empty (no quests), data. Pull-to-refresh.
- `components/XpBarChart` — daily XP bars drawn with plain Views (no chart dependency added).
- `components/ExamAnalyticsPanel` — per-campaign pacing and per-realm completion from the per-exam endpoint.
- `ANALYTICS_QUERY_KEYS.all` is exported so quest-quiz and Colosseum can invalidate after XP changes.

## Routes owned
`app/more/battle-stats.tsx`

## API dependencies
`GET /api/analytics` (403 until `featureUnlocks.battleStatsUnlocked`) · `GET /api/exams/[examId]/analytics`

## Known limitations
- Chart is a simple daily-XP bar view of the last 14 days; no zoom, tooltips or cumulative line.
- Types mirror the server response by hand; there is no shared schema package.
