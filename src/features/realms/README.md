# Realms

Realms are `Category` rows: subject areas inside a campaign. The realm detail screen is the action hub for quests, Level Analyser, Colosseum, and Autofill.

## Architecture
- `api/realms.api.ts` — list/create/delete realms, analyser statuses, AI quest preview.
- `hooks/useRealms`, `useRealmMutations` — server state (TanStack Query). Deleting a realm also invalidates quests and analyser statuses.
- `hooks/useRealmDetail` — all realm-detail logic (quest CRUD, reorder, delete realm, navigation). The screen only renders.
- `hooks/useRealmAutofill` — preview-then-accept flow; persists only through `quests` bulk create.
- Quest UI (`QuestRow`, `QuestEditorSheet`) comes from the `quests` feature via its public index.

## Routes owned
`/realm/[examId]/[categoryId]` · `/autofill/[examId]/[categoryId]`
Links out to screens owned by other features: `/quest-quiz/...`, `/level-analyser/...`, `/colosseum/...`.

## API dependencies
`GET|POST|DELETE /api/exams/[examId]/realms` · `GET .../realm-analyser-statuses` · `POST .../ai/game-plan`

## Known limitations
- Autofill uses the server's `realmName` + `topicsHint` contract; the guide's organise/generate mode toggle is not in the API.
- Analyse gating uses `canChallenge` and quest count only; the server remains the authority.
- Destructive confirms use `Alert.alert` (native only; no-op on web).
