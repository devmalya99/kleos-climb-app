# Arsenal

Skill board: XP and rank per skill, earned from quest clears and the Colosseum.

## Architecture
- `hooks/useArsenal` — `GET /api/arsenal` via TanStack Query; a 403 is not retried.
- `screens/ArsenalScreen` — states: loading, locked (403 → `EmptyState`), error, empty, list. Pull-to-refresh.
- `components/SkillCard` — XP, rank label and progress to the next rank. All rank math is server-side.
- `ARSENAL_QUERY_KEYS` is exported so quest-quiz and Colosseum can invalidate after awarding skill XP.

## Routes owned
`app/more/arsenal.tsx`

## API dependencies
`GET /api/arsenal` (403 until `featureUnlocks.arsenalUnlocked`).

## Known limitations
- No dedicated rank-up overlay: rank-ups are surfaced as text in the quest-quiz and Colosseum result cards.
- The More tab already blocks navigation while locked; the 403 EmptyState is the fallback for deep links or stale `me` data.
