# Auth

JWT Bearer session for PaceMaker mobile.

## Flow
Cold start → SecureStore token → `GET /api/auth/me` → tabs, or `/onboarding` when `onboardedAt` is null.
Email/password login & signup. Google via `?client=mobile` deep link. Signup with a null timestamp opens onboarding.

## APIs
`POST /api/auth/login|signup|logout` · `GET /api/auth/me` · `GET /api/auth/google?client=mobile`

## Limitations
No forgot-password. Google Calendar consent remains web-only.
