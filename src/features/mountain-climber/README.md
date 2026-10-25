# Mountain Climber

A thin client for one study summit. The server owns the climb. The phone draws it and remembers which summit was opened last.

## Architecture
- `api/climb.api.ts` — `GET/POST/PATCH/DELETE /api/mountain-climber/climb`. Responses are parsed with the same Zod board schema the server writes.
- `utils/climb-path.ts` — copy of the server's pure actions, used only to update the query cache before the response returns. A 400 or 409 rolls that cache back.
- `hooks/useMountainClimb` — TanStack Query plus a local file for the open summit id (`mountain-climber-summit`). The climb itself is not stored on the device.
- `screens/MountainClimberScreen` — loading, error, two-step setup, or the trail. The ascent card switches summits, reorders open tasks with AI, and adds a task. Expedition opens new or delete for the whole climb (`DELETE /api/mountain-climber/climb?id=`). Tap a camp to edit, delete, clear, or set progress on one task. Drag reorders camps that are not cleared yet. AI reorder suggests an order and saves only on Apply.

## Routes owned
`app/(tabs)/climb.tsx` (bottom tab, no feature unlock)

## API dependencies
`/api/mountain-climber/climb` on the study-tracker server, plus `POST /api/mountain-climber/climb/reorder` for the suggestion. Apply is `PATCH` with `{ type: "reorder", levelIds }`. A build pointed at production 404s until that route is deployed.

## Known limitations
- Arrange lets you drag camps that are not cleared yet. Cleared camps stay planted.
- Each device remembers its own open summit. The web localStorage value does not travel here.
- Delete expedition is confirmed in the sheet, then the server message stays on the screen if the delete fails.
- A task added in the last moment can be moved only after the server replaces its temporary id.
- Offline edits are not queued.
- The deadline is typed as year, month, and day. The system date picker is not linked into the current Android binary.
