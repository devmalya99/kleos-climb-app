# PaceMaker Mobile — Agent Build Playbook

> **What this document is:** The single playbook an AI coding assistant follows to build the **full** PaceMaker React Native app against the **existing** Next.js backend.
>
> **What this document is not:** A vague architecture essay. Every feature section tells you **what it does**, **the exact user flow**, **constraints**, **limitations**, **APIs**, **what you must not reinvent**, and **how to build it**.
>
> **Related:** Taurus streaming / voice / TTS depth → [`docs/taurus-react-native-migration.md`](./taurus-react-native-migration.md). Product architecture notes → [`architecture.md`](../architecture.md). **When architecture.md and live code disagree, live code wins** (divergences called out with ⚠️).

---

## Part A — Project contract (read once, obey always)

### A1. Locked decisions

| Decision | Choice |
|---|---|
| Mobile repo | **Separate Git repo** (e.g. `pacemaker-mobile`) |
| Stack | **Expo + Expo Router + TypeScript** |
| Backend | Existing PaceMaker / Kleos API — **no business-logic fork** |
| Scope | **Full feature parity** with today’s web app |
| Design | **New** modern gamified mobile look — not the web cyberpunk/crimson clone, not purple “AI slop” |
| Auth | JWT Bearer (`Authorization: Bearer <token>`) — already supported |

### A2. API hosts

| Environment | Base URL |
|---|---|
| Production | `https://kleos-ai.vercel.app` |
| Local | `http://localhost:3000` (use LAN IP on physical device) |
| Env var | `EXPO_PUBLIC_API_BASE_URL` |

### A3. Non‑negotiable engineering rules

1. **Thin client.** Scoring, XP, unlocks, cooldowns, LLM, ownership, quotas = server only.
2. **Inspect before inventing.** For each feature, open the matching `src/features/<feature>/` and `src/app/api/...` in study-tracker. Copy request/response shapes; do not invent fields.
3. **Code constants beat docs.** Prefer values in feature `constants` / services over older prose in `architecture.md`.
4. **No secrets in the mobile repo.** Only public base URL. Never ship `JWT_SECRET`, LLM keys, Google client secret.
5. **Vertical slices.** Finish one feature flow end-to-end before scaffolding the next.
6. **Verify on simulator/device.** Do not mark a feature done without running its happy path + one failure path.
7. **If an API is missing (server action only), stop and add a thin REST wrapper in study-tracker first.** Do not fake the feature client-side.

### A4. How the coding agent should work (development method)

For **every** feature below, follow this loop:

1. Read that feature’s section in **this playbook** (purpose → flow → constraints → limits → APIs).
2. Open the cited source files in study-tracker and confirm shapes/constants.
3. If APIs are “server action only,” implement **Phase 0** wrappers first (Part B).
4. Build mobile in this order inside the feature: **types → API client → query/mutation hooks → screens → polish (motion/haptics/empty states)**.
5. Wire navigation + unlock gating if applicable.
6. Run the **Acceptance** checklist at the end of that section.
7. Only then move to the next feature in Part E order.

**Do not** start by generating 40 empty screens. **Do not** reimplement quiz scoring “temporarily.” **Do not** hardcode unlock flags on the client.

### A5. Product vocabulary (use these labels in UI copy)

| UI term | Database / code | Meaning |
|---|---|---|
| Campaign | `Exam` | Named exam goal with target date |
| Realm | `Category` | Subject area inside a campaign |
| Quest | `Topic` | One completable study task |
| Claim XP / Final Showdown | Quest Quiz | 5-question perfect-clear gate |
| Level Analyser | Level Analyser | Mastery assessment (**per realm** in code) |
| Colosseum | Colosseum | Timed infinite arena (**per realm**) |
| Arsenal | `Skill` | Skill XP and ranks |
| Battle Stats | Analytics | Progress charts (gated) |
| Hall of Fame | Profile badges | Level Analyser badges (gated) |
| Brain Clutter | Groups + Notes | Galaxy notebook |
| Task Manager | Task categories + tasks | Separate from galaxy notes |
| RAG Quiz | Packs + Sessions | PDF → quiz |
| Taurus | AI assistant | Chat + voice + tools |

### A6. Shared numbers cheat sheet (verify in code if changing)

| Area | Rule | Source of truth |
|---|---|---|
| JWT lifetime | 7 days | `src/shared/lib/auth/jwt.ts` |
| Signup password | 8–72 chars | `src/features/auth/model/schemas.ts` |
| Quest quiz | 5 questions, pass = 5/5, XP = 100 | quest-quiz constants + `quest-xp.ts` |
| Quest quiz cooldown | ⚠️ **0 ms in code** (docs may say 1h) | `quest-quiz-service.ts` |
| Level Analyser | 20 Q (10+5+5), 5 marks each, max 100 | `level-analyser/model/constants.ts` |
| Level Analyser scope | ⚠️ **Per realm (`categoryId`)**, not per quest | `level-analyser-service.ts` |
| Level Analyser cooldown | ⚠️ **1 minute in code** (UI copy may say daily) | same constants |
| Colosseum | Start 3 elixirs, max 10, +1 per 6 streak, 30 XP/correct, 3 runs/day/realm | `colosseum/constants/colosseum.ts` |
| Colosseum wave | ⚠️ **batch size 10** (architecture may say 5) | same |
| Import plan | ≤15k words, 1 preview / 10 min | `ai-parse/model/constants.ts` |
| Realm autofill | ≤5k words, 2 successes / 5 min | `ai-game-plan` autofill limits |
| Daily AI tokens | 200_000 / user timezone day | `ai-parse/model/constants.ts` |
| Availability XP goals | 100–5000 | `availability/model/schemas.ts` |
| Brain Clutter pins | max 3 | brain-clutter defaults |
| Brain Clutter storage % | display vs 50k chars (not hard quota) | brain-clutter-service |
| Task expand | max 20 preview tasks | task-manager schemas |
| Focus timer | 1–180 minutes, **client-only** | task-manager timer |
| RAG | 1–3 PDFs, ≤10MB, ≤100 pages, ≤100MB/user, history 20, Q caps 10/20/40/50 | `rag-quiz/constants/rag-quiz.ts` |
| TTS | ≤4000 chars, auth required | tts request schema |
| Proactive alert | 20 min inactivity, 60s heartbeat | voice-assistant storage-keys |
| Taurus | ≤30 conversations; see Taurus doc for voice timings | taurus constants |
| Web search quota | 300 | taurus constants |
| Skill ranks | NOVICE→SUPREME, XP thresholds in skill-ranks | `arsenal/constants/skill-ranks.ts` |

### A7. Mobile design brief (all screens)

**Avoid:** purple→indigo startup gradients, cream+terracotta kits, glow soup, emoji decoration, pill spam, first-screen dashboard clutter, cloning web cyberpunk/crimson.

**Do:** One coherent “athletic competitive study game” brand. One accent + success + danger + neutrals. Distinctive display font + readable body (`expo-font`). Consistent radius scale. Cards only when they group interaction. Signature motions: screen enter, press scale, reward burst on XP/unlock. Haptics on claim/correct/incorrect/unlock. Safe areas + thumb-zone primary CTAs.

Define tokens in `src/app/theme/` **before** feature UI. Features consume tokens only.

### A8. Recommended app shell

**Auth stack:** Welcome → Login → Signup  

**Tabs:** Home · Plan (Timetable) · Taurus · Clutter · More  

**More hub:** Arsenal, Battle Stats, Hall of Fame, RAG Quiz, Settings, Profile (respect unlocks)

**Stacks:** Campaign → Realm → Quest actions · Colosseum full-screen · Quiz/Analyser full-screen · RAG pack → process → session

Folder spirit: `app/` routes only; `src/features/<name>/{api,hooks,screens,components,types,constants}` — same ownership idea as web.

---

## Part B — Phase 0: Backend enablement (study-tracker repo)

React Native **cannot** call Next.js `"use server"` actions. Before combat/mastery/Arsenal/Hall of Fame mobile work, add thin REST routes that call **existing** services. Keep response shapes identical to what web UI already consumes. Never send `correctIndex` before result/review.

### B1. Must add

| Capability | Today | Add roughly |
|---|---|---|
| Quest Quiz start/submit/timeout | `quest-quiz/actions/quest-quiz.ts` | `POST .../topics/[topicId]/quest-quiz/{start,submit,timeout}` |
| Level Analyser start/submit | `level-analyser/actions/level-analyser.ts` | `POST .../categories/[categoryId]/level-analyser/{start,submit}` |
| Progress report get/ensure/regenerate | `level-analyser/actions/progress-report.ts` | `GET/POST .../progress-report` (+ regenerate) |
| Colosseum status/start/answer/timeout/surrender | `colosseum/actions/colosseum.ts` | `.../colosseum/{status,start,answer,timeout,surrender}` |
| Arsenal workspace | SSR `getArsenalWorkspaceData` | `GET /api/arsenal` |
| Global analytics | SSR `getUserProgressAnalytics` | `GET /api/analytics` |
| Hall of Fame badges | SSR `getUserLevelBadges` | `GET /api/user/badges` |
| Google → mobile JWT | browser cookie redirect | Deep-link / JSON exchange returning `{ user, token }` |
| Calendar consent return | web redirect to Taurus | Mobile deep-link back into Taurus |

Already usable: auth, exams/realms/topics, import-plan, parse-topics, game-plan (generate-only), timetable, brain-clutter, rag-quiz, taurus, tts, user settings, per-exam analytics, realm-analyser-statuses.

### B2. Phase 0 exit criteria

- Every combat/mastery/read path mobile needs works with Bearer token from an HTTP client.
- No required feature still depends only on server actions.
- Brief note added to `architecture.md` for new routes.

---

## Part C — Feature playbooks

Each feature uses the same template:

- **Purpose** — what the user gets  
- **Workflow** — ordered steps  
- **UI states** — empty / loading / success / error  
- **Constraints** — hard rules  
- **Limitations** — known ceilings / caveats  
- **APIs** — what to call  
- **Do not reinvent** — server-owned logic  
- **Build instructions** — how the agent should implement  
- **Acceptance** — done definition  

---

### C1. Authentication

**Purpose**  
Create and restore a PaceMaker session. Email/password and Google both yield a JWT. Mobile stores the JWT and sends it as Bearer on every request.

**Workflow**
1. Cold start → read SecureStore token → if present, `GET /api/auth/me` → tabs; else auth stack.
2. Signup: validate email + password 8–72 + confirm → `POST /api/auth/signup` → store `token` → enter app.
3. Login: `POST /api/auth/login` → store `token` → enter app.
4. Google: mobile OAuth / AuthSession → backend exchange → `{ user, token }` → store → enter app.
5. Logout: clear SecureStore (+ optional `POST /api/auth/logout`) → auth stack.
6. Any `401` → clear session → auth stack.

**UI states**  
Empty forms · submit loading · field/banner errors · OAuth cancel · success navigate.

**Constraints**
- Login fails for Google-only accounts with no `passwordHash`.
- JWT expires in 7 days.
- `PublicUser` includes `featureUnlocks` — keep that object; do not invent unlocks.

**Limitations**
- No forgot-password API — **do not build a fake reset**.
- Google calendar consent is a **separate** OAuth path from sign-in.

**APIs**  
`POST /api/auth/signup|login|logout` · `GET /api/auth/me` · `GET /api/auth/google` (+ callback / mobile exchange) · `GET /api/auth/google/calendar`

**Do not reinvent**  
Password hashing, JWT sign/verify, Google token exchange, user creation.

**Build instructions**
1. SecureStore session module + API client that attaches Bearer.
2. Auth screens with zod validation mirroring web schemas.
3. Session provider hydrates `me` once at launch.
4. Implement Google only after Phase 0 mobile OAuth return exists.

**Acceptance**  
Signup, login, restore, logout, 401 handling work on device. `me` returns unlocks.

---

### C2. Home / Command Center

**Purpose**  
Landing after login: campaign roster, forge entry, today’s plan shortcut, gated feature tiles, optional XP goal stats.

**Workflow**
1. Load `GET /api/exams` + `GET /api/auth/me`.
2. Zero campaigns → emphasize Forge / first campaign.
3. Tap campaign → campaign detail.
4. Today’s Plan → timetable today view.
5. Show stats strip only if `campaigns > 0 OR weekdayXp > 0 OR weekendXp > 0`.
6. Locked Arsenal / Battle Stats / Hall of Fame → explain or soft-lock (do not crash).

**UI states**  
Empty roster · loading skeletons · stats hidden/shown · unlock-locked tiles.

**Constraints**  
Stats visibility rule above. New users may have XP goals = 0 until Settings.

**Limitations**  
Web page is SSR; mobile must use REST. Do not SSR-copy HTML.

**APIs**  
`GET /api/exams` · `GET /api/auth/me` · optional `GET /api/timetable/today`

**Do not reinvent**  
Exam ownership queries, unlock computation.

**Build instructions**  
Home tab first after auth. Campaign cards + primary Forge CTA + More shortcuts. Wire deep links later.

**Acceptance**  
Empty and populated homes both clear. Navigation to campaign/timetable works. Locked tiles don’t open gated routes.

---

### C3. Campaigns (Exams)

**Purpose**  
Create and manage exam goals (name + target date). Campaign detail is the hub for realms and import/forge flows.

**Workflow**
1. Create campaign (`POST /api/exams`) with name ≤120 and `YYYY-MM-DD` target.
2. Open detail (`GET /api/exams/[examId]`).
3. Edit / delete campaign (confirm delete).
4. **Import plan:** paste syllabus → preview → review proposal → commit (persist only on commit).
5. **AI parse topics:** paste → structured topics → user confirms bulk create (`parse-topics` never writes alone).
6. Optional deadline edits from Settings batch patterns.

**UI states**  
Create form · preview loading · rate-limit error · commit report · 404 not found.

**Constraints**
- Import ≤15,000 words; **1 successful preview / 10 minutes**.
- AI preview/parse must not write DB until user confirms.
- All routes ownership-scoped.

**Limitations**  
Import quality depends on syllabus + LLM. Shares daily AI token budget.

**APIs**  
`GET|POST /api/exams` · `GET|PATCH|DELETE /api/exams/[examId]` · `POST .../import-plan/preview|commit` · `POST /api/ai/parse-topics` · `GET .../analytics`

**Do not reinvent**  
LLM parse/import, rate windows, token accounting, transactional commit.

**Build instructions**  
Campaign list → detail shell → create sheet → import/parse wizards as multi-step screens (paste → preview → confirm).

**Acceptance**  
CRUD works. Preview without commit leaves DB unchanged. Rate limit surfaces clearly.

---

### C4. Realms (Categories)

**Purpose**  
Subject areas inside a campaign. Host quests, Level Analyser, Colosseum, Autofill.

**Workflow**
1. On campaign detail, list/create realms (`GET|POST .../realms`).
2. Open realm → quests + Analyse / Colosseum / Autofill / edit / delete.
3. Delete realm is destructive (quests + related data) — require confirm.

**UI states**  
Empty realm map · create form · delete confirm · not found.

**Constraints**  
Realm must belong to owned exam. Analyser needs ≥1 quest in realm (server enforces).

**Limitations**  
Theme/accent is presentation only.

**APIs**  
`GET|POST|DELETE /api/exams/[examId]/realms` · `GET .../realm-analyser-statuses`

**Do not reinvent**  
Cascade delete rules, eligibility checks for analyser/colosseum.

**Build instructions**  
Realm cards on campaign detail → realm detail screen as action hub.

**Acceptance**  
Create/open/delete realm. Empty realm shows create-quest CTA. Destructive delete confirmed.

---

### C5. Quests (Topics)

**Purpose**  
Completable study tasks: name, description/subtopics, priority, reorder, optional reminder image. **XP claim is via Quest Quiz**, not a free complete toggle in primary UX.

**Workflow**
1. Add quest in realm (name, priority HIGH|MEDIUM|LOW, optional description/resources/image).
2. Edit / delete / bulk delete.
3. Reorder within realm.
4. Reminder image upload/view if using that API.
5. Primary completion path: **Claim XP → Quest Quiz** (C7).
6. After pass, quest shows mastered/completed.

**UI states**  
Empty list · saving · reordering · upload error · mastered badge.

**Constraints**
- Validation in `topics/model/schemas.ts` (respect max lengths).
- Priority currently does **not** change XP (all awards 100) — do not invent tier XP on client.
- Reorder sends ordered `topicIds` for a `categoryId`.

**Limitations**  
Epic/Legendary timed portal modes removed; all plain 5-question quizzes.

**APIs**  
Topics CRUD/bulk/bulk-delete/reorder/complete · reminder-image routes under `/api/exams/[examId]/topics...`

**Do not reinvent**  
Completion side effects (XP, Battle Stats unlock), blob storage for images.

**Build instructions**  
Quest list + editor sheet + reorder gestures. Claim XP button routes to quiz flow. Don’t expose raw “complete” as bypass unless product asks.

**Acceptance**  
CRUD + reorder + claim entry work. Completed quests reflect server `completedAt`.

---

### C6. Realm AI Autofill / Game Plan

**Purpose**  
From pasted notes, generate or organise quests for a realm. User always confirms before persist.

**Workflow**
1. Open Autofill from realm.
2. Paste notes (≥5 chars, ≤5000 words).
3. Choose mode `organise` | `generate`.
4. Call generate endpoint → preview list.
5. User accepts → bulk create topics.
6. Handle rate limit: **2 successes / 5 minutes**.

**UI states**  
Textarea · generating · preview list · accepting · rate-limit / quota errors.

**Constraints**  
Generate route must not write DB. Persist only via topics bulk. Priority mix enforced server-side.

**Limitations**  
⚠️ Web also has `processQuests` server action — confirm mobile uses the REST `.../ai/game-plan` path (or wrap the action). Don’t call both inconsistently.

**APIs**  
`POST /api/exams/[examId]/ai/game-plan` · topics bulk create

**Do not reinvent**  
Strategist prompts, rate windows, priority mix, token usage.

**Build instructions**  
Two-step UI: compose → preview → accept. Disable accept until preview exists.

**Acceptance**  
Preview alone doesn’t create quests. Accept creates them. Rate limit message appears when hit.

---

### C7. Quest Quiz (Claim XP)

**Purpose**  
Final showdown gate: **5 MCQs**, must score **5/5** to complete quest and award XP (+ possible Arsenal skill XP / Battle Stats unlock).

**Workflow**
1. Quest → Claim XP.
2. Start → loading while LLM forges questions (no answers in payload).
3. User answers all (honor timer if server returns timed attempt).
4. Submit →  
   - Pass: success overlay, XP, skill award, unlock overlays if flags flip, quest completed.  
   - Fail: failure overlay, missed review, cooldown messaging if any.
5. Timeout path if attempt is timed.

**UI states**  
Summoning · in-arena · success · failure · already claimed · LLM error.

**Constraints**
- Pass threshold perfect only.
- XP = 100 on pass (server).
- Never display `correctIndex` before result.
- ⚠️ Cooldown is **0 ms in current code** — UI should still handle `retryAt` if server sends it later.

**Limitations**  
Needs Phase 0 REST wrappers. Question quality LLM-dependent.

**APIs**  
After Phase 0: start / submit / timeout under topic quest-quiz routes. Until then: blocked.

**Do not reinvent**  
Generation, scoring, completion, XP/skill awards, unlock claims.

**Build instructions**  
Full-screen quiz arena reusable later by Colosseum/Analyser where possible (shared question UI only — **not** shared scoring). Wire unlock overlays on pass response / refreshed `me`.

**Acceptance**  
5/5 completes quest; imperfect does not; answers never leaked early; unlocks fire once.

---

### C8. Level Analyser + Progress Report + Badges

**Purpose**  
⚠️ **Realm-level** mastery check: 20 questions → score → mastery tier → badge upsert → AI progress report. Unlocks Hall of Fame on first badge.

**Workflow**
1. Realm → Analyse / Challenge status (check statuses endpoint / cooldown).
2. Require ≥1 quest; otherwise prompt to add quests.
3. Start → 20 MCQs (10 basic + 5 deeper + 5 advanced).
4. Submit → score (5 marks each, max 100) → tier (NOVICE→CONQUEROR) → badge → report.
5. View cached report; ensure/regenerate when allowed.
6. Badge appears in Hall of Fame after unlock.

**UI states**  
Disabled (no quests / cooldown) · generating · in-quiz · mastery result · report viewer · errors.

**Constraints**
- Scoped by `categoryId` (realm), not topic id.
- ⚠️ Cooldown **1 minute in code** despite “daily” copy — trust server `retryAt`.
- `correctIndex` server-only until review.

**Limitations**  
`architecture.md` “per quest / subtopics required” is outdated vs code. Report quality depends on attempts + LLM.

**APIs**  
`GET .../realm-analyser-statuses` · Phase 0 start/submit · Phase 0 progress-report routes · Phase 0 `GET /api/user/badges`

**Do not reinvent**  
Quiz gen, scoring, tiering, badge upsert, report compile, Hall of Fame unlock claim.

**Build instructions**  
Mirror quest-quiz arena UX with 20-step progress. Result overlay → optional report sheet. Persist “seen unlock” locally.

**Acceptance**  
Start/submit/report work; badge list updates; cooldown honored via server; first badge unlocks Hall of Fame.

---

### C9. Colosseum

**Purpose**  
Per-realm infinite timed arena. Elixirs, streaks, personal bests, Arsenal XP per correct strike.

**Workflow**
1. Realm → Colosseum → rules intro.
2. Fetch status (attempts remaining today).
3. Start run → HUD (elixirs, streak, timer, question).
4. Answer / timeout / surrender (back button confirms surrender).
5. Waves continue until elixirs hit 0.
6. Result overlay + record-break celebration if earned.

**UI states**  
Rules · blocked (daily limit) · forging · HUD · wrong feedback · game over · surrender confirm.

**Constraints**
- Start 3 elixirs, max 10; +1 elixir every 6 correct; 30 XP/correct; 3 counted runs/realm/day (user TZ).
- Wave batch size **10**.
- Abrupt kill may void uncounted run; surrender counts — match server.
- Never show correct index early.

**Limitations**  
Needs Phase 0 REST. AI quality depends on realm quest clarity.

**APIs**  
Phase 0 colosseum status/start/answer/timeout/surrender.

**Do not reinvent**  
Elixir/streak/daily counting, batch forge, skill XP, record breaks.

**Build instructions**  
Immersive full-screen. Hardware back → surrender confirm. Haptics on correct/incorrect/elixir gain. Reuse question presentation component only.

**Acceptance**  
Full run works; daily limit blocks; XP appears in Arsenal after unlock; records update.

---

### C10. Timetable

**Purpose**  
Weekly Mon–Sun study plan. Slots are `REPEATABLE` (every week) or `ONCE` (auto-cleared after end on read).

**Workflow**
1. Open Plan tab → week grid.
2. Create/edit slot: title, weekday, start/end, recurrence.
3. Delete slot.
4. Today’s Plan uses `GET /api/timetable/today`.
5. Taurus may create slots — pull-to-refresh should show them.

**UI states**  
Empty week · slot sheet · validation errors · Weekly/Once badges.

**Constraints**  
ONCE purge happens on **read** (no cron). Use user timezone from profile.

**Limitations**  
ONCE may still appear on weekday column until expiry even if `occursOn` is future.

**APIs**  
`GET|POST /api/timetable` · `PATCH|DELETE /api/timetable/[entryId]` · `GET /api/timetable/today`

**Do not reinvent**  
Expiry math, timezone filtering, ownership.

**Build instructions**  
Native-feeling week view + bottom sheet editor. Keep recurrence explicit in UI.

**Acceptance**  
CRUD works. Today view matches server. ONCE disappears after expiry on refresh.

---

### C11. Settings (availability, speech, pacing)

**Purpose**  
Daily XP goals, timezone, notification speech mute, voice preference, AI token usage visibility, optional campaign deadline edits.

**Workflow**
1. Open Settings from More.
2. Patch availability (weekday/weekend XP 100–5000 + timezone).
3. Toggle `notificationSpeechMuted`.
4. Pick TTS voice (device-local storage OK, matching web).
5. Show daily AI token usage if `me` / pacing endpoints expose it.
6. Logout.

**UI states**  
Form · saving · validation · success feedback.

**Constraints**  
XP goals min 100 when saving availability. Token quota resets at midnight in user TZ (server).

**Limitations**  
Voice id not server-synced today. No password change/reset UI unless API exists.

**APIs**  
`PATCH /api/user/availability` · `GET /api/user/quest-pacing` · `PATCH /api/user/notification-speech` · exam PATCH · `POST /api/tts` for samples

**Do not reinvent**  
Quota accounting, pacing formulas.

**Build instructions**  
Sectioned settings screen. Deep-link anchors optional (`#weekday-xp-goal` equivalents).

**Acceptance**  
Goals persist and affect Home stats visibility. Mute stops proactive speech. Logout works.

---

### C12. Arsenal

**Purpose**  
Skill board showing XP and ranks earned from quest clears and Colosseum.

**Workflow**
1. If locked → show locked state / CTA explaining “earn skill XP.”
2. When unlocked → `GET /api/arsenal` → skill cards + progress to next rank.
3. On rank-up from a combat response → rank-up overlay.

**UI states**  
Locked · empty skills · list · rank-up overlay.

**Constraints**  
Ranks/thresholds from server/`skill-ranks`. Unlock only via first skill XP (server flag).

**Limitations**  
Needs Phase 0 `GET /api/arsenal`.

**APIs**  
`GET /api/arsenal` (new) · awards happen inside quiz/colosseum responses

**Do not reinvent**  
XP award, rank math, unlock claim.

**Build instructions**  
More → Arsenal. Gate with `featureUnlocks.arsenalUnlocked`. Celebrate unlock once.

**Acceptance**  
After Colosseum/quest skill XP, skills appear with correct ranks; locked users cannot open.

---

### C13. Battle Stats (Analytics)

**Purpose**  
Progress / pacing charts after first quest completion.

**Workflow**
1. Locked until `battleStatsUnlocked`.
2. Load global analytics (+ optional per-exam analytics).
3. Empty → CTA to forge/complete quests.
4. Pull to refresh.

**UI states**  
Locked · empty · charts · loading.

**Constraints**  
Server owns aggregations. Unlock from first `completedAt` quest.

**Limitations**  
Needs Phase 0 global analytics route. Per-exam analytics already REST.

**APIs**  
`GET /api/analytics` (new) · `GET /api/exams/[examId]/analytics`

**Do not reinvent**  
Aggregation / on-track math.

**Build instructions**  
Simple readable charts (not dashboard soup). Respect unlock gate.

**Acceptance**  
Charts render from server data after unlock; locked redirect/soft-lock works.

---

### C14. Hall of Fame / Profile

**Purpose**  
Achievement gallery of Level Analyser badges + progress reports.

**Workflow**
1. Locked until first badge.
2. Load badges · open report · link Settings.
3. Unlock overlay once.

**UI states**  
Locked · empty · badge grid · report sheet.

**Constraints**  
One badge per realm (`userId` + `categoryId`).

**Limitations**  
Needs badges + progress-report REST.

**APIs**  
`GET /api/user/badges` · progress-report routes

**Do not reinvent**  
Badge upsert, report generation.

**Build instructions**  
Profile header (email handle) + achievements. Gate with `hallOfFameUnlocked`.

**Acceptance**  
Badges match analyser results; reports open; gate works.

---

### C15. Feature unlocks (system)

**Purpose**  
Server-owned gates + one-time celebrations for Arsenal, Battle Stats, Hall of Fame.

**Workflow**
1. User earns unlock via skill XP / quest complete / badge.
2. Response flags and/or refreshed `me` show new unlocks.
3. Show full-screen overlay once; persist “seen” locally; reveal nav.

**Constraints**

| Feature | Flag | Earn when |
|---|---|---|
| Arsenal | `arsenalUnlockedAt` | First skill XP |
| Battle Stats | `battleStatsUnlockedAt` | First quest completed |
| Hall of Fame | `hallOfFameUnlockedAt` | First Level Analyser badge |

Claims are atomic on server. Client must not set flags.

**Limitations**  
Backfilled users may already be unlocked without overlay — that’s OK.

**APIs**  
Flags on `GET /api/auth/me`; claim happens inside server services.

**Do not reinvent**  
Writing unlock timestamps from the client.

**Build instructions**  
Central unlock listener after mutations that can unlock. Three overlay variants. Nav items read flags.

**Acceptance**  
First-time unlock shows once; nav updates; locked routes stay locked until flag true.

---

### C16. Brain Clutter (Buckets + Notes)

**Purpose**  
Galaxy notebook: buckets hold notes. Separate from Task Manager data.

**Workflow**
1. Clutter tab → Buckets.
2. Create bucket (server assigns accent/icon).
3. Pin up to 3; open bucket → notes CRUD.
4. Optional mark-as-task on notes; AI rewrite preview → apply.
5. Delete note/bucket with confirm.

**UI states**  
Empty galaxy · pin limit error · note editor · rewrite preview · storage % display.

**Constraints**  
Max 3 pins. Storage % is **display** vs ~50k chars — not a hard enforcement to invent. All user-scoped.

**Limitations**  
No note version history. Galaxy layout need not be physics-based. Notes ≠ Task Manager tasks.

**APIs**  
`/api/brain-clutter/groups` · `/notes` · `/notes/rewrite` · `/pending-tasks`

**Do not reinvent**  
Ownership, rewrite LLM, pin-limit server rules.

**Build instructions**  
Two-mode workspace switch (Buckets | Task Manager). Native lists + editor screen/sheet. Keep dark playful layout without cyberpunk clone.

**Acceptance**  
Full bucket/note CRUD; pin cap; rewrite preview doesn’t save until confirm.

---

### C17. Task Manager

**Purpose**  
Executable tasks in user-defined categories, with AI expand/review and a local focus timer.

**Workflow**
1. Switch to Task Manager.
2. Categories CRUD; tasks create/toggle/edit/delete.
3. **Expand:** paste → preview (≤20) → accept to save.
4. **Review:** find vague / too-long tasks → preview splits → apply selected.
5. Focus timer 1–180 min: start/pause/reset; mark done; closing sheet stops timer (client-only).

**UI states**  
Empty · expand/review preview · applying · timer running · errors.

**Constraints**  
AI never persists until accept/apply. Title/notes length limits from schemas. No due dates / drag-reorder required in v1.

**Limitations**  
Timer not synced to server. Expand/review quality LLM-dependent.

**APIs**  
`/api/brain-clutter/tasks` · categories routes · expand · expand/accept · review · review/apply

**Do not reinvent**  
Expand/review LLM + accept/apply persistence.

**Build instructions**  
Same Clutter tab, second mode. Preview screens are mandatory before write.

**Acceptance**  
CRUD works; expand/review require confirm; timer behaves locally without corrupting server state.

---

### C18. RAG Quiz

**Purpose**  
Upload PDFs → chunk/embed → MCQ session → report → optional export note to Brain Clutter.

**Workflow**
1. Create pack (1–3 PDFs within size/page limits).
2. Process in steps; show `embeddedCount / chunkCount` progress; chain process calls until ready.
3. Start session with question cap (10/20/40/50).
4. Answer / extend / finish → report.
5. Optional export to Brain Clutter bucket `"RAG Quiz"`.

**UI states**  
Upload validation · processing · ready · in-session · report · storage/quota errors.

**Constraints**  
Respect file size, page, doc count, storage, history caps in `rag-quiz` constants. Don’t re-download PDF each embed step — server already designed for stepped process.

**Limitations**  
Multiple process round-trips by design. Embedding provider dependent.

**APIs**  
`/api/rag-quiz/packs` · `.../process` · sessions · answer · extend · report · export-note

**Do not reinvent**  
PDF extract, chunking, embeddings, retrieval, scoring, storage accounting.

**Build instructions**  
Use `expo-document-picker`. Progress UI must feel continuous across stepped calls. Session = full-screen quiz.

**Acceptance**  
PDF → ready pack → finished report on device. Export creates note when chosen.

---

### C19. Taurus

**Purpose**  
Tool-calling study assistant: chat mode, voice mode, conversation history, tools that mutate study data, optional Google Calendar.

**Workflow (summary)**  
Open Taurus → resume/create conversation → chat or voice → stream replies → tool cards → history switch/delete → capabilities info.

**Depth**  
**Mandatory:** implement using [`docs/taurus-react-native-migration.md`](./taurus-react-native-migration.md) for streaming protocol, VAD, barge-in, TTS queue, transcription, tool UI, guardrails.

**Constraints / limits (high level)**  
≤30 conversations; server tools/bouncer/quotas stay server-side; TTS ≤4000 chars; voice timings in taurus constants; web search quota 300.

**APIs**  
`POST /api/taurus/chat` · conversations CRUD · `POST /api/taurus/transcribe` · `POST /api/tts` · calendar OAuth

**Do not reinvent**  
Tools, bouncer, heuristics, Whisper/LLM orchestration, conversation cap enforcement.

**Build instructions**  
After core study loop exists, port Taurus as its own phase. Invalidate campaign/timetable/clutter queries when tools mutate them.

**Acceptance**  
Chat streaming works; voice path works on device; history persists; tool side effects visible in other tabs after refresh/invalidate.

---

### C20. Proactive study reminders

**Purpose**  
Remind the user what to study now from timetable (or fallback routine), with optional spoken guidance.

**Workflow (mobile mapping)**
1. On foreground / after ~20 min since last acknowledge, resolve current task via `GET /api/timetable/today` (+ pacing if used).
2. Show in-app sheet and/or local notification.
3. If not muted, speak via `POST /api/tts` + native audio.
4. Acknowledge → store last-handled timestamp; stop audio.

**Constraints**  
Respect `notificationSpeechMuted`. TTS auth + 4000 char cap. Don’t spam.

**Limitations**  
Web uses gesture interceptor for autoplay — mobile should use normal notification/audio APIs instead of copying browser hacks.

**APIs**  
`GET /api/timetable/today` · `GET /api/user/quest-pacing` · `POST /api/tts` · `PATCH /api/user/notification-speech`

**Do not reinvent**  
Server “what’s now” filtering; Edge TTS proxy.

**Build instructions**  
Implement after timetable + settings. Request OS notification permission properly.

**Acceptance**  
Foreground reminder appears with correct slot text; mute silences speech; acknowledge suppresses until next window.

---

## Part D — Cross-feature points to keep in mind

1. **Daily AI token budget is shared** across parse, import, autofill, quizzes, Taurus, RAG generation, etc. Surface friendly “AI budget” errors; don’t infinite-retry.
2. **Unlocks are server truth.** Always re-read `me` after claim XP / analyser / skill awards.
3. **AI previews never auto-save** (import, parse, autofill, expand, review, rewrite). Mobile UX must keep an explicit confirm step.
4. **Combat modes need Phase 0.** Building pretty quiz UI without REST wrappers is wasted work.
5. **Timezone matters** for timetable today, ONCE expiry, Colosseum daily limits, AI token day reset — always use profile timezone mentally; server already applies it.
6. **Taurus mutates the same data** as manual screens — use shared query keys and invalidate widely after tool finishes.
7. **Don’t trust architecture.md alone** for cooldowns, Colosseum batch size, or Level Analyser scope — verify constants files.
8. **Accessibility:** labels on icon buttons, large tap targets, don’t rely on color alone for correct/incorrect.
9. **Performance:** FlashList for long quest/note lists; avoid re-rendering entire chat history carelessly.
10. **Design consistency:** one theme module; no one-off hex in feature folders.

---

## Part E — Build order (execute in sequence)

| Phase | Where | Deliverable |
|---|---|---|
| **0** | study-tracker | REST wrappers + mobile Google JWT return (Part B) |
| **1** | mobile | Expo app, theme, API client, auth (C1), tab shell |
| **2** | mobile | Home + Campaigns + Realms + Quests CRUD (C2–C5) |
| **3** | mobile | Timetable + Settings (C10–C11) |
| **4** | mobile | Autofill (C6) |
| **5** | mobile | Quest Quiz + unlocks wiring (C7, C15) |
| **6** | mobile | Level Analyser + reports + Hall of Fame (C8, C14) |
| **7** | mobile | Colosseum + Arsenal (C9, C12) |
| **8** | mobile | Battle Stats (C13) |
| **9** | mobile | Brain Clutter + Task Manager (C16–C17) |
| **10** | mobile | RAG Quiz (C18) |
| **11** | mobile | Taurus (C19 + Taurus doc) |
| **12** | mobile | Proactive reminders (C20) + polish + EAS preview |

**Rule:** Do not start Phase N+1 until Phase N acceptance passes on a simulator/device.

---

## Part F — Kickoff prompt (paste to the mobile coding agent)

> You are building PaceMaker mobile in this separate Expo + Expo Router + TypeScript repo. Reuse the backend at `EXPO_PUBLIC_API_BASE_URL` (production `https://kleos-ai.vercel.app`). Auth is JWT Bearer from login/signup responses.
>
> Your source of truth for **what to build, in what order, with what constraints** is the study-tracker file `docs/mobile-rn-agent-build-guide.md`. For Taurus streaming/voice/TTS details use `docs/taurus-react-native-migration.md`. Prefer live code constants over older architecture prose when they disagree.
>
> Full feature parity is required. Thin client only — never invent XP/scoring/unlocks/cooldowns on device. If a feature still depends on server actions, stop and add REST wrappers in study-tracker (Phase 0) before continuing.
>
> Design a fresh modern gamified UI (athletic study-game), not purple AI-slop and not a clone of the web cyberpunk theme.
>
> Work Part E phases in order. For each feature, follow that feature’s Purpose → Workflow → Constraints → Build instructions → Acceptance. Verify on simulator before advancing.

---

## Part G — Out of scope

- Forgot password / email verification (no API)
- Offline-first sync engine
- Admin tools
- Separate mobile backend / schema fork
- Pixel-perfect clone of the web theme
- Inventing features not present in study-tracker today
