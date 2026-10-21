# Quests

Quests are `Topic` rows on the server: one completable study task inside a realm.

## Architecture
- `api/topics.api.ts` — REST wrappers (list, create, update, delete, bulk create/delete, reorder).
- `hooks/useQuests` — TanStack Query list for a campaign (`["quests", examId]`).
- `hooks/useQuestMutations` — create/update/remove/reorder/bulkCreate; each invalidates the list.
- `components/QuestRow`, `QuestEditorSheet` — presentational; the owning screen (realm detail) wires them.
- `utils/` — pure helpers (filter by realm, move id, zod form schema).

XP is claimed via the Quest Quiz route (`/quest-quiz/[examId]/[topicId]`), not a free "complete" toggle.

## API dependencies
`GET|POST /api/exams/[examId]/topics` · `PATCH|DELETE .../topics/[topicId]` ·
`POST .../topics/bulk` · `POST .../topics/bulk-delete` · `PATCH .../topics/reorder`

## Known limitations
- Reorder is up/down buttons, not drag.
- Reminder image upload and bulk-delete UI are not built (`bulkDeleteQuestsApi` is wired but unused).
- Quest quiz screen is a separate feature (route exists in the root stack, screen not built yet).
