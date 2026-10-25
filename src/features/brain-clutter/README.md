# Brain Clutter (Notes)

Buckets (groups) that hold notes. The Clutter tab switches between this feature (Notes) and `task-manager` (Tasks).

## Architecture
- `api/groups.api.ts`, `api/notes.api.ts` — REST wrappers.
- `hooks/useClutterWorkspace` — bucket list, stats, pending note-tasks, soft-locked bucket actions.
- `hooks/useClutterGroupDetail` — one bucket's notes (create, edit, complete, delete).
- `hooks/useNoteRewrite` — AI rewrite preview. It never writes; "Apply" only fills the editor and the user still saves.
- `hooks/useClutterSearch` — loads every bucket's notes and every category's tasks, then filters by title and body text. There is no server search route.
- `components/ClutterSearchSheet` — Search button on the Clutter tab. A note opens its bucket. A task switches to Tasks and selects that category.
- `components/FirstUnloadPrompt` — when the account has zero buckets, asks for one topic. Not now hides it until the Clutter tab is opened again. Submit uses the create-bucket API and opens that bucket.
- `screens/ClutterScreen` (tab), `screens/GroupDetailScreen` (route `/clutter/[groupId]`). A Home suggestion opens `/(tabs)/clutter?mode=tasks` with a new request id so the Tasks switch turns on without forcing it on later visits.

## API dependencies
`/api/brain-clutter/groups[/id]` · `/notes[/id]` · `/notes/rewrite` · `/pending-tasks`

## Known limitations
- Pin limit (3) is enforced by the server; its message is shown inline.
- No note version history; notes are plain text.
