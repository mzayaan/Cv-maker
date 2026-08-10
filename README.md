# CV Builder

**Live: [cv-maker-7pxy.onrender.com](https://cv-maker-7pxy.onrender.com)**

A Next.js + Firebase app for building CVs from 32 guided, field-specific templates, with PDF export capped at 5/day per user.

The app itself lives in [`cv-builder/`](./cv-builder) — see [`cv-builder/README.md`](./cv-builder/README.md) for setup, local development, and deployment instructions.

## What's built

- Email/password + Google sign-up/login (Firebase Auth)
- Dashboard listing your CVs
- Template gallery with 32 templates across 8 categories, filterable
- Guided CV builder: dynamic form driven by each template's schema + live preview, autosaves to Firestore
- Client-side PDF export enforcing a hard 5-exports-per-day limit via a Firestore transaction
- Settings page: edit profile, change password, delete account (cascades all CV + export data)
- Privacy Policy and Terms of Service pages
- Firestore security rules restricting every user to their own data
