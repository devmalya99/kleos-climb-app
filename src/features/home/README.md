# Home

Landing tab ("Command Center") plus the More tab.

## Architecture
- `screens/HomeScreen` — theme photo (seaside by day, campfire at night), horizontal summit cards, and two tasks at a time in a blurred panel. The day greeting uses `resolveDisplayName`.
- `hooks/useHomeSummits` — `GET /api/mountain-climber/climb`, then the same route with `?id=` when a summit card is tapped.
- `constants/home.constants` — More items: Settings and Profile.
- `screens/MoreScreen` lives here because it uses that same list.

## API dependencies
`GET /api/auth/me` · `GET /api/mountain-climber/climb`

## Known limitations
- More links to `/more/settings` and `/more/profile`.
