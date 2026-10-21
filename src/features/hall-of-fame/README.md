# Hall of Fame

Gallery of Level Analyser mastery badges (one per realm) with access to each realm's progress report.

## Architecture
- `hooks/useBadges` — `GET /api/user/badges`. The query key is owned by `level-analyser` (the producer), so a new badge invalidates it automatically. A 403 is not retried.
- `screens/HallOfFameScreen` — states: loading, locked (403 → `EmptyState`), error, empty, badge list. Pull-to-refresh. Tapping a badge opens the `level-analyser` `ProgressReportSheet`.

## Routes owned
`app/more/hall-of-fame.tsx`

## API dependencies
`GET /api/user/badges` (403 until `featureUnlocks.hallOfFameUnlocked`) · progress-report routes (via `level-analyser`)

## Known limitations
- A badge has no `examId`, so reports are opened with the `ANY_EXAM_ID` placeholder; the server scopes progress reports by `categoryId` only.
- Badges are a list, not a visual grid; no sharing or filtering.
