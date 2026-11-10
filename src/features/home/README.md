# Home

Landing tab plus the Control tab.

## Architecture
- `screens/HomeScreen` — scenic greeting and the Task Manager “finish this now” suggestion.
- `screens/MoreScreen` — Control tab list (Settings, Profile). Routes stay under `/more/...`.
- `constants/home.constants` — Control list items.

## API dependencies
`GET /api/auth/me` · `GET /api/brain-clutter/tasks/suggestion`

## Known limitations
- Control still opens `/more/settings` and `/more/profile`.
