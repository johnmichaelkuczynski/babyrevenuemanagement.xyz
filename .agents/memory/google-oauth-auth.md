---
name: Google OAuth auth system
description: How passport+express-session Google OAuth is wired in this app — routing quirks, startup guard, secrets needed.
---

## Auth stack
- **Backend:** `passport` + `passport-google-oauth20` + `express-session` + `connect-pg-simple`
- **Frontend:** `AuthContext` (`src/lib/auth-context.tsx`) — fetches `/api/auth/user`, exposes `useAuth()`, `login()`, `logout()`
- **User/visit tables:** created at startup via raw SQL in `artifacts/api-server/src/lib/storage.ts` using the shared `pool` from `@workspace/db`
- **Session table:** `user_sessions` — created automatically by `connect-pg-simple` (`createTableIfMissing: true`)

## Critical routing rule — CALLBACK_PATH = `/api/auth/google/callback`
The Replit proxy only routes `/api/*` to the api-server (artifact.toml `paths = ["/api"]`). Any path without the `/api` prefix hits the qr-course SPA and returns 404. The callback MUST be `/api/auth/google/callback`.

Register exactly this URI in Google Cloud Console:
- Dev: `https://ae3f4c24-07f1-45ff-bcc4-f6f111237c96-00-xhao3bv8l86f.picard.replit.dev/api/auth/google/callback`
- Production: `https://<your-replit-app-domain>/api/auth/google/callback`

## Startup guard — passport-google-oauth20 throws if clientID is empty
If `GOOGLE_LOGIN_CLIENT_ID` is not set, `new GoogleStrategy({clientID: "", ...})` throws `TypeError: OAuth2Strategy requires a clientID option` at module load time, crashing the server before it can even start. The strategy registration is wrapped in `if (clientID && clientSecret)` to prevent this. The `/api/auth/google` login endpoint returns a 503 when credentials are missing.

**Why:** The package validates clientID synchronously in the constructor, before any request is made.

## Required secrets
Set in Replit Secrets (or env before production deploy):
- `GOOGLE_LOGIN_CLIENT_ID` — from Google Cloud Console OAuth 2.0 credentials
- `GOOGLE_LOGIN_CLIENT_SECRET` — from Google Cloud Console OAuth 2.0 credentials
- `SESSION_SECRET` — required in production (server throws if missing when `NODE_ENV=production` or `REPLIT_DEPLOYMENT=1`); in dev a hardcoded fallback is used

## Admin check
Admin email is hardcoded to `johnmichaelkuczynski@gmail.com` in `auth.ts`. The `isAdmin` middleware enforces this. `isAuthenticated` / `isAdmin` middleware exist but are NOT applied to any existing course routes (API is open by design for a single-user app).
