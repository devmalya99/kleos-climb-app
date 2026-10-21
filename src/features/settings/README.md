# Settings (and Profile)

Account preferences. `ProfileScreen` lives here because it only reads `me` and signs out; it needs no data layer of its own.

## Architecture
- Appearance (System, Light, Dark) is stored on the device in `pacemaker.theme.preference` and applied by `ThemeProvider`. It is not sent to the server. System follows the phone.
- `hooks/useSettings` — availability form state, notification speech toggle, quest pacing query. Mutations return `{ user }`; after each one we call `useAuth().refreshMe()` so `me` stays the single source of truth (no duplicated user state).
- `utils/availability.schemas` — XP goals 100–5000 (whole numbers) and IANA timezone validation via `Intl`.
- `components/QuestPacingSection` — renders `GET /api/user/quest-pacing`.
- `screens/ProfileScreen` — email, timezone, XP goals, sign out via `useAuth().logout()` then `router.replace("/(auth)/welcome")`. A small version tag at the bottom reads `expoConfig.version` (currently `1.0.1`) so the installed build can be identified.

## Routes owned
`app/more/settings.tsx` · `app/more/profile.tsx`

## API dependencies
`PATCH /api/user/availability` · `PATCH /api/user/notification-speech` · `GET /api/user/quest-pacing` · `GET /api/auth/me` (via `auth`)

## Known limitations
- TTS voice choice, sample playback and campaign deadline editing from the guide are not built (voice is not server-synced; deadlines are edited on the campaign screen).
- "AI usage" shows the lifetime `totalAiTokens` from `me`; the server does not expose a daily quota yet.
- Timezone is a free-text IANA string (validated), not a picker.
- Sign-out confirmation uses `Alert.alert` (native only).
