# CV Builder Platform — Project Plan

## 1. Concept

A web app where students and professionals build a CV/resume by choosing from 25+ templates, each guided by field-level prompts tailored to the type of work or course they're pursuing (e.g. tech internship vs. nursing placement vs. PhD application). Includes its own SSO identity system (reusable across future apps), a settings page, a privacy policy page, and a hard limit of 5 PDF exports per user per day.

## 2. Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (React, App Router) + TypeScript | SSR for fast first load, good SEO for landing/template pages, huge ecosystem |
| Styling | Tailwind CSS | Fast to build 25+ template layouts consistently |
| Backend/API | Next.js API routes (calling Firebase Admin SDK) | No separate server to run; Firebase handles the heavy lifting |
| Data storage | Firestore (NoSQL, Firebase) | No database server to manage — free Spark tier, generous limits, scales automatically |
| Auth/SSO | Firebase Authentication | Free, supports email/password + Google/Microsoft OAuth; one Firebase project can back multiple future apps for shared login (see §3) |
| PDF export | Puppeteer/Playwright (HTML→PDF) rendered server-side, queued | Reliable pixel-perfect output from the same templates used on-screen |
| File storage | Firebase Storage | Profile photos, generated PDFs — same project, free tier |
| Rate limiting | Firestore counter document per user per UTC day, updated via atomic transaction | Enforces the 5-export/day cap without needing Redis |
| Hosting | Vercel or Firebase Hosting (frontend) + Vercel serverless functions or Cloud Functions (PDF rendering) | Both have free tiers; avoids running your own servers |

Everything above fits inside Firebase's free "Spark" plan for a project this size (auth, Firestore reads/writes, storage, and light Cloud Functions usage all have no-cost quotas). You only pay if usage grows well beyond a personal/student-scale app.

## 3. SSO Across Your Own Apps (Firebase-based)

Since you don't want to run a database or a custom OAuth server, Firebase Authentication is the practical way to get "one login for all your apps" for free:

- Create **one Firebase project** dedicated to identity (separate from the CV app's data project, or the same project if you're not fussy about separation)
- Every future app you build initializes the Firebase SDK against that same project → a user who logs in on the CV app is already recognized on your next app, no extra server needed
- Login methods: email/password + Google OAuth (both built in, no config server needed)
- Firebase issues a standard signed JWT (ID token) per session; any backend (even non-Firebase) can verify it with Firebase Admin SDK or by checking the token's signature against Google's public keys — so this isn't locked to Firebase-only backends
- This is not a full OIDC provider with a consent screen and client registry like Auth0/Keycloak, but it gets you real cross-app SSO with zero database and zero servers to run. If you later outgrow it (e.g. need third-party apps to log in "via your platform"), migrating to Keycloak/Ory is a clean next step — but it's unnecessary complexity to start with.

## 4. Core Pages

1. Landing page — value prop, template gallery preview
2. Sign up / Log in / Forgot password (via SSO)
3. Dashboard — list of user's CVs, "create new"
4. Template gallery — 25+ templates, filterable by category (see §5)
5. CV Builder — step-by-step guided form (left) + live preview (right)
6. Export — "Download PDF" with remaining-quota indicator ("3 of 5 exports left today")
7. Settings — profile, email/password change, connected accounts, delete account, data export (GDPR)
8. Privacy Policy page
9. Terms of Service page
10. Admin/internal (later) — template management, usage metrics

## 5. Template System

25+ templates grouped by pursuit type, each with its own recommended field set and guidance copy:

- **Tech/Engineering** — projects, GitHub, tech stack, internships
- **Academic/Research** — publications, thesis, conferences, grants
- **Business/Finance** — quantifiable achievements, certifications (CFA etc.)
- **Creative/Design** — portfolio links, tools, exhibitions
- **Healthcare/Nursing** — licenses, clinical hours, certifications
- **Trades/Vocational** — certifications, apprenticeships, safety training
- **Student/Entry-level (no experience)** — coursework, extracurriculars, volunteering emphasized over work history
- **Executive/Leadership** — strategic achievements, board roles

Each template is a data-driven layout (JSON schema: sections, field types, ordering) + a rendering component. Guidance is stored per-section ("For an internship CV, list 3–5 bullet points with measurable outcomes") and shown contextually as the user fills the form. New templates should be addable by adding a schema + layout component, not by forking the whole app.

## 6. Data Model (Firestore collections)

- `users/{uid}` — profile info (name, email mirrors Firebase Auth, created_at); uid = Firebase Auth UID, so no separate user table needed
- `users/{uid}/cvs/{cvId}` — one CV document: template_id, title, content (nested JSON), updated_at
- `templates/{templateId}` — name, category, schema (sections/fields), is_active — seeded once, rarely written after
- `users/{uid}/exportLog/{yyyy-mm-dd}` — single counter document per user per day: `{ count: number, lastExportAt: timestamp }`
- Firebase Storage paths: `users/{uid}/photo.jpg`, `users/{uid}/exports/{cvId}-{timestamp}.pdf`

This is intentionally shallow (mostly nested under `users/{uid}`) so Firestore security rules can lock down "a user can only read/write their own data" with one simple rule.

## 7. Export Limit (5 PDFs/day)

- On each export request, read `users/{uid}/exportLog/{today's date}` inside a Firestore **transaction**
- If `count >= 5`, block with a clear message + time until UTC midnight reset; otherwise increment `count` and generate the PDF in the same transaction to avoid race conditions from double-clicks/parallel requests
- Must run server-side (Cloud Function or Next.js API route with Admin SDK) — never trust a client-side count, since Firestore security rules alone can't safely enforce "increment by at most 1, max 5" logic that also triggers PDF generation
- Show remaining count in the UI by reading today's counter document on page load

## 8. Privacy Policy & Settings — what they need to cover

- Privacy Policy: what data is collected (CV content, email, usage), how it's stored (Firebase/Google Cloud servers), third parties (Firebase Auth, Firestore, Storage, PDF rendering), retention, user rights (export/delete), cookie use
- Settings: edit profile, change password (via Firebase Auth), manage connected Google account, download all data (GDPR export — read the user's Firestore docs and zip them), delete account (deletes Firebase Auth user + all Firestore docs + Storage files under their uid), notification preferences

## 9. Phased Roadmap

**Phase 1 — Foundation**
Create Firebase project, enable Auth + Firestore + Storage, set up security rules, Next.js app skeleton, auth integration, basic dashboard.

**Phase 2 — Builder core**
CV document schema, 3–5 initial templates, guided form + live preview, autosave to Firestore.

**Phase 3 — Export & limits**
Server-side PDF rendering, Firestore-transaction-based 5/day limit, export history.

**Phase 4 — Template expansion**
Build out to 25+ templates across categories, per-category guidance content.

**Phase 5 — Polish & compliance**
Settings page, Privacy Policy/ToS pages, GDPR data export/delete, accessibility pass, mobile responsiveness.

**Phase 6 — Launch prep**
Firestore security rules audit, abuse protection (e.g. App Check to block bot signups), monitoring, backups (Firestore export), error tracking.

## 10. Open Decisions for You

- Whether the identity Firebase project should be shared across all your future apps from day one, or split later (recommend: one project now, it's free and easy to point new apps at it)
- Free vs. paid tiers (export limit suggests a future paywall for higher limits)
- Timezone basis for the "daily" reset (UTC is simplest)
- Whether PDF rendering runs as a Firebase Cloud Function or a Vercel serverless function (Cloud Function keeps everything in one Google Cloud project; Vercel keeps it next to your Next.js code)
