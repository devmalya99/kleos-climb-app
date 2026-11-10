# Brain Clutter (Notes)

Buckets that hold notes. Shown as the Notes tab.

## Architecture
- `api/groups.api.ts`, `api/notes.api.ts` — REST wrappers.
- `hooks/useClutterWorkspace` — bucket list, stats, pending note-tasks.
- `hooks/useClutterGroupDetail` — one bucket's notes.
- `hooks/useClutterSearch` — local filter across notes and tasks for the search sheet.
- `components/FirstUnloadPrompt` — first topic when the account has zero buckets.
- `screens/NotesScreen` (tab), `screens/GroupDetailScreen` (route `/clutter/[groupId]`).

## API dependencies
`/api/brain-clutter/groups[/id]` · `/notes[/id]` · `/notes/rewrite` · `/pending-tasks`

## Known limitations
- Pin limit (3) is enforced by the server.
- Note detail path stays `/clutter/[groupId]`.
