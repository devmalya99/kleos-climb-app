# Campaigns

A campaign is an `Exam`: a named goal with a target date. The campaign detail screen is the hub for realms and for the import-plan flow.

## Architecture
- `api/exams.api.ts` — list/get/create/update/delete.
- `api/importPlan.api.ts` — preview and commit; `parseTopicsApi` is wired but no screen uses it yet.
- `hooks/useExams`, `useCampaignMutations` — server state. Mutations invalidate `["campaigns"]`.
- `hooks/useCampaignDetail` — composes exam + realms + quest counts + analyser statuses (via `realms` / `quests` public indexes) and owns edit/delete.
- `hooks/useImportPlan` — paste → preview → commit state machine. Only `commit` writes; it refreshes realms and quests.
- `components/CampaignFormSheet` — create and edit in one sheet (mounted only while open so form state resets).

## Routes owned
`/campaign/[examId]` · `/import-plan/[examId]`

## API dependencies
`GET|POST /api/exams` · `GET|PATCH|DELETE /api/exams/[examId]` · `POST .../import-plan/preview|commit` · `POST /api/ai/parse-topics`

## Known limitations
- Target date is typed as `YYYY-MM-DD` (no native date picker dependency yet).
- Import preview cannot be edited item-by-item; discard and re-paste to change it.
- Destructive confirms use `Alert.alert` (native only; no-op on web).
