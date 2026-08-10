# CV Builder

**Live: [cv-maker-7pxy.onrender.com](https://cv-maker-7pxy.onrender.com)**

A Next.js + Firebase app for building CVs from 30 guided, field-specific templates, with PDF export capped at 5/day per user.

## What's built

- Email/password + Google sign-up/login (Firebase Auth) — `/login`, `/signup`
- Dashboard listing your CVs — `/dashboard`
- Template gallery with 30 templates across 8 categories, filterable — `/templates`
- Guided CV builder: dynamic form driven by each template's schema + live preview, autosaves to Firestore — `/builder/[cvId]`
- Client-side PDF export (html2canvas + jsPDF) enforcing a hard 5-exports-per-day limit via a Firestore transaction — no export can slip past the count, even with concurrent clicks
- Settings page: edit profile, change password, delete account (cascades all CV + export data) — `/settings`
- Privacy Policy and Terms of Service pages — `/privacy`, `/terms`
- Firestore security rules (`firestore.rules`) restricting every user to their own data

## 1. Set up your Firebase project (~5 minutes)

1. Go to https://console.firebase.google.com → **Add project** → name it (e.g. "cv-builder") → finish the wizard (Google Analytics optional).
2. In the project, click **Build → Authentication → Get started**. Enable **Email/Password** and **Google** sign-in providers.
3. Click **Build → Firestore Database → Create database** → start in **production mode** → pick a region.
4. Click **Build → Storage → Get started** → production mode.
5. Go to **Project settings** (gear icon) → **General** → scroll to "Your apps" → click the **</> (Web)** icon → register an app (any nickname) → copy the `firebaseConfig` values shown.
6. In this project folder, copy `.env.local.example` to `.env.local` and paste in those values:

```
cp .env.local.example .env.local
```

Fill in each `NEXT_PUBLIC_FIREBASE_*` value from the config Firebase gave you.

7. Deploy the security rules (or paste `firestore.rules` into Firebase Console → Firestore → Rules → Publish):

```
npx firebase-tools login
npx firebase-tools init firestore   # select your project, keep default file names
npx firebase-tools deploy --only firestore:rules
```

## 2. Run it locally

```
npm install
npm run dev
```

Visit http://localhost:3000. Sign up, pick a template, fill it in, and export — you'll see "X of 5 exports left today" tick down.

## 3. Deploy

Deployed on [Render](https://render.com) (free Web Service tier) at **https://cv-maker-7pxy.onrender.com**, auto-deploying on every push to `main`. Root directory is `cv-builder` since the repo nests the app in a subfolder; build command `npm install && npm run build`, start command `npm run start`; env vars (Firebase + Cloudinary) are set in the service's Environment tab.

Alternative: push this repo to GitHub and import it on [Vercel](https://vercel.com) (free tier) — set the project's Root Directory to `cv-builder` and add the same `NEXT_PUBLIC_FIREBASE_*` / Cloudinary variables in Vercel's Project Settings → Environment Variables.

Note: the free Render tier spins down on inactivity — the first request after idle can take 50+ seconds.

## Notes & next steps

- **SSO across future apps**: point any new app's Firebase config at this same Firebase project (or a dedicated identity project) and users who are logged in on one are recognized on the other. See the plan doc for details.
- **Export limit enforcement**: currently enforced via a Firestore transaction from the client, which is race-safe (concurrent requests can't push the count past 5) but relies on your Firestore rules — a technically sophisticated user could inspect network calls. For airtight server-side enforcement, move `consumeExportCredit` into a Firebase Cloud Function (Blaze plan) that the client calls instead of writing directly.
- **Templates**: add more by adding an entry to `src/data/templates.ts` — no new components needed for the common case.
- **Seeding `templates` collection in Firestore**: not required — templates currently live in code (`src/data/templates.ts`) for simplicity and speed. Move them to Firestore later only if you want to edit them without redeploying.
