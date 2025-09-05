# Copilot Instructions for Next.js Backend Authentication System

## Project Overview
- **Framework:** Next.js (App Router, server components, client components)
- **Authentication:** Custom JWT-based system (not NextAuth), using HTTP-only cookies for session management
- **Database:** Supabase (PostgreSQL) via `@supabase/supabase-js`
- **Styling:** Tailwind CSS
- **User Roles:** `admin` and `user` with role-based routing and access control

## Key Architectural Patterns
- **API Routes:** All authentication and user management logic is in `src/app/api/*/route.js` (e.g., `/api/login`, `/api/register`, `/api/user/profile`)
- **Middleware:** `middleware.js` enforces authentication and role-based access for `/dashboard` and `/profile` routes. It reads the JWT from cookies and redirects based on user role.
- **JWT Handling:** JWTs are signed with `JWT_SECRET` and stored in HTTP-only cookies. The payload includes `sub` (user id), `name`, and `role`.
- **Supabase Integration:** All DB access is via the `supabase` client in `src/lib/supabase.js`. User data is stored in the `users` table. File uploads (avatars) use Supabase Storage.
- **Password Hashing:** Passwords are hashed with `bcryptjs` before storage.
- **Role-based UI:** Separate dashboard and profile pages for `admin` and `user` under `src/app/dashboard/` and `src/app/profile/`.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (uses Next.js with Turbopack)
- **Build for Production:** `npm run build`
- **Run Linter:** `npm run lint`
- **Environment Variables:** Set in `.env.local` (see `README.md` for required keys)
- **Testing:** Manual, via full auth flow (register → login → dashboard → logout). No automated tests present.

## Project-Specific Conventions
- **Path Aliases:** Use `@/` for imports from `src/` (see `jsconfig.json`)
- **API Response:** All API routes return JSON with either `{ error }` or `{ message }` keys
- **User Table:** `users` table has both `id` (int8) and `auth_id` (uuid); use `auth_id` for Supabase auth, `id` for local JWT
- **Profile Images:** Uploaded to Supabase Storage, public URL saved in `profile_image` field
- **Admin Registration:** Requires `adminSecret` matching `ADMIN_SECRET` env var

## Integration Points
- **Supabase:** Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **JWT:** Requires `JWT_SECRET` in env
- **Tailwind:** Configured via `postcss.config.mjs` and `src/app/globals.css`

## Examples
- **Protecting a route:** Add path to `protectedPrefixes` in `middleware.js`
- **Fetching user profile:** `GET /api/user/profile` (reads JWT from cookie)
- **Uploading avatar:** `POST /api/user/update-photo` with `file` in form-data

## References
- `src/app/api/` — All backend logic
- `middleware.js` — Auth/role enforcement
- `src/lib/` — Supabase and auth helpers
- `README.md` — Environment setup and secrets

---
For new features, follow the patterns in `src/app/api/` and update `middleware.js` if new protected routes or roles are added.
