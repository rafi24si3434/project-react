# AGENTS.md - CRM PetCare & Customer Portal

## Quick Start

**Dev server:** `npm run dev` → http://localhost:5173  
**Build:** `npm run build`  
**Lint:** `npm run lint` (currently broken; needs eslint.config.js)  
**Preview build:** `npm run preview`

## Project Overview

React 19 + Vite + Supabase (PostgreSQL) CRM system for a pet clinic. Three user roles: **admin**, **staff**, **customer**. Features include pet management, appointments, medical records, product shop, feedback/complaints, and customer portal.

## Architecture Notes

### Stack
- **Frontend:** React 19, React Router 7, Vite 7, Tailwind CSS 4, Shadcn UI, Recharts
- **Backend:** Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Auth:** Supabase Auth with token-based session management

### File Structure (key paths)
- `src/pages/` (27 JSX files) - Main page components; role-guarded via `ProtectedRoute`
- `src/components/member/` (14 JSX files) - Customer portal UI; reusable cards and modals
- `src/components/ui/` (7 JSX files) - Shadcn UI primitives (button, dialog, table, tabs, sheet, dropdown, progress)
- `src/context/AuthContext.jsx` - Global auth state, self-healing profile upsert logic
- `src/lib/supabase.js` - Supabase client init; reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`
- `src/layouts/` - `MainLayout` (with sidebar), `AuthLayout` (for login/register)
- `supabase_complete_schema.sql` - Full DDL, RLS policies, and seed data schema
- `.env` - Contains Supabase credentials (already configured in repo)

### Routing & Protection
All routes in `src/App.jsx` use:
- `<ProtectedRoute allowedRoles={["admin", "staff"]}>` for clinic staff areas
- `<ProtectedRoute allowedRoles={["customer"]}>` for customer portal (`/member`)
- Public: `/`, `/login`, `/register`, `/forgot`
- Guest can view shop catalog but not checkout

### Database Schema
10 main tables (all RLS-enabled):
- **users** - Profiles linked to Supabase auth (auth_user_id)
- **pets** - Owner references users
- **appointments** - Owner + pet references
- **medical_records** - Pet + owner references
- **orders** + **order_items** - Customer purchases
- **products** - Shop catalog
- **feedback** + **complaints** - Customer reviews & support tickets
- **activity_logs** - User action audit trail

**Key quirk:** PostgREST cannot join across `auth` and `public` schemas. Pages like Feedback, Pets, Appointments have fallback join logic in JS (queries separate, maps data in memory).

## Critical Behaviors

### Self-Healing Profiles (AuthContext.jsx)
If user's Supabase Auth session exists but their `public.users` profile is missing (DB reset/migration), the system auto-upserts a new profile on login using email fallback. Prevents crashes when navigating after DB rebuild.

### Autopilot Account Creation (LandingPage)
Non-logged-in guests can book appointments or order via landing page form. System auto-creates Supabase Auth account with password `PetCare123!`, upserts profile, registers pet, and creates order/appointment in one flow.

### Error Boundary Wrapper
All pages wrapped in `<ErrorBoundary>` in `App.jsx`. Runtime errors display clean error UI instead of white screen.

### RLS Isolation
- Customers only see their own pets, appointments, orders, medical records
- Admin/staff see all records but cannot edit `auth.users` directly (auth table is protected)
- Products are public-read for all; admin/staff can CRUD

## Environment & Setup

### Required .env vars
```
VITE_SUPABASE_URL=https://vfnnqisrkhbmhyjnikkb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Database Setup
1. Run `supabase_complete_schema.sql` in Supabase SQL Editor to create tables, RLS policies, and helper functions
2. Run `seed_50_records.sql` to populate test data (50 users, 72 pets, 72 appointments, etc.)
3. Default test accounts: `sigit@gmail.com`, `mido24si@mahasiswa.pcr.ac.id` (admin); all with password `PetCare123!`

## Common Gotchas

### Missing eslint.config.js
`npm run lint` fails. Project uses ESLint 9+ but needs `eslint.config.js` (not `.eslintrc.cjs`). To fix: create flat config or disable linting for now.

### Role-Based Access
Pages check `profile.role` from AuthContext. If profile fetch fails and falls back to guessed role (based on email domain), access may differ from expected. Check AuthContext logs.

### Supabase Credentials
`.env` is in `.gitignore` and contains real credentials. Do not commit `.env` changes. If credentials rotate, update locally only.

### Building
`npm run build` succeeds but warns about `/fonts/Poppins-ExtraBold.ttf` not resolving at build time (harmless; resolved at runtime).

## Testing & Verification

**Manual verification workflow:**
1. `npm run dev` to start dev server
2. Login with `sigit@gmail.com` / `PetCare123!` (admin)
3. Navigate `/dashboard` to verify admin-only pages load
4. Logout, login with a customer account from seeded data to verify customer portal (`/member`)
5. Check browser console for AuthContext debug logs if profile issues occur

**No automated test suite exists.** Linting is broken; build succeeds.

## Page Role Map

| Page | Admin | Staff | Customer | Guest |
|------|-------|-------|----------|-------|
| /dashboard | ✓ | ✓ | ✗ | ✗ |
| /member (portal) | ✗ | ✗ | ✓ | ✗ |
| /pets | ✓ | ✓ | ✓ | ✗ |
| /appointments | ✓ | ✓ | ✓ | ✗ |
| /medical-records | ✓ (CRUD) | ✓ (CRUD) | ✓ (read-only) | ✗ |
| /shop | ✓ (CRUD stock) | ✓ (CRUD stock) | ✓ (buy) | ✓ (view only) |
| /feedback | ✓ (full) | ✓ (full) | ✓ (limited) | ✗ |
| /customers (CRM) | ✓ | ✓ | ✗ | ✗ |

## Useful Supabase Queries

**Check if user profile exists:**
```sql
SELECT * FROM public.users WHERE auth_user_id = '<uuid>' OR email = '<email>';
```

**Manual RLS bypass (use service role key, not anon key):**
Not applicable from frontend. Service role queries only via server-side code or direct SQL editor.

**View active sessions:**
Supabase Dashboard → Auth → Users tab shows all registered users and their sessions.
