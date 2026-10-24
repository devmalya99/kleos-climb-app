# Onboarding

First run after signup: a name, one expedition, and one task. One save creates the first summit. It does not create Brain Clutter content.

## Architecture
- `model/schemas.ts` — name, goal, deadline, and task limits.
- `store/onboardingDraft.store.ts` — in-memory draft for this app process. React Native has no `sessionStorage`. Nothing is written until Save, and nothing is written to disk.
- `api/completeOnboarding.ts` — `POST /api/user/onboarding`.
- `screens/OnboardingScreen` — three steps. The route `app/onboarding.tsx` is the gate.

## API dependencies
`POST /api/user/onboarding` · `GET /api/auth/me` (`displayName`, `onboardedAt`)

## Known limitations
- The draft dies when the process dies.
- `onboardedAt: null` is the only signal that the flow is required. An older account response that omits the field is treated as already onboarded.
- Reorder is not offered here. The summit starts with the task the user named.
