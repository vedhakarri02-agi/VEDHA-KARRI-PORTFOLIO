# Project Log — Bada Teja Portfolio

Portfolio website with a private admin for **Bada Teja**, final-year Mechanical Engineering student at ANITS, looking for Mechanical Design / CAD roles.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · Tailwind CSS 4 · Supabase (database, login, file storage, live updates) · Vercel hosting |
| **Supabase project** | `BADA-TEJA-PORTFOLIO` · ref `jmwusvwbywizixxqhluf` · region Northeast Asia (Seoul) · free plan |
| **Admin account** | `tejabada7@gmail.com` (the password is not recorded anywhere in this repo) |
| **Local dev** | `npm run dev -- -p 3001` → http://localhost:3001 (port 3000 is used by the SIH project) |
| **Keys** | In `.env.local` (git-ignored). Only the public *publishable* key is used; the secret key is never used. |

---

## Current status — 22 Sep 2026

| Area | Status |
|---|---|
| Public site (design, all sections, project pages, SEO, 404) | ✅ Built and verified |
| Admin dashboard (all editors, uploads, messages, account) | ✅ Built · ⚠️ not yet tested while signed in |
| Database schema + security rules | ✅ Running in Supabase and verified |
| Database content | ❌ **Empty**: `supabase/seed.sql` hasn't been run yet |
| Admin sign-in | ⚠️ Account exists; password not yet confirmed working |
| Git | ⚠️ Files staged, **no commits yet** |
| Deployment (GitHub + Vercel) | ❌ Not started |

---

## Timeline

### 10 Sep 2026 — Analysis and build
- Reviewed Bada's résumé PDF, LinkedIn PDF export and profile screenshots. Main findings:
  - Résumé links are dead because it was exported with "Microsoft Print to PDF".
  - The Delight Chemicals internship is missing from the résumé.
  - Email, location and job titles differ between the résumé and LinkedIn.
  - LinkedIn headline typo ("Studen t"); club roles marked "Full-time".
- Plan approved: dark black/white/blue design, all content in a database, admin-only editing at `/admin`, edits live without redeploying.
- Stack chosen: **Next.js 16 + Supabase + Vercel**, reusing patterns from the D2W project.
- Built:
  - Public site: hero with auto-computed stats, about "spec sheet", experience timeline, projects grid and `/projects/[slug]` pages, skills, certifications, education, leadership, contact form, footer title block, 404, sitemap, robots, share image.
  - Engineering-drawing theme: blueprint grid, dimension lines, corner brackets, monospace labels.
  - Admin: login, dashboard with checklist, profile form, one reusable list editor (add / edit / delete / reorder / hide), sections editor, live messages inbox, account page, live preview panel.
  - `supabase/schema.sql`: tables, Row Level Security, storage bucket, Realtime, keep-alive endpoint and daily Vercel cron.
- Verified: TypeScript, ESLint and `next build` pass; desktop and 375 px mobile screenshots; no horizontal scroll.

### 11 Sep 2026 — Supabase set up
- README rewritten with setup and deployment steps.
- Supabase project created (Seoul). `vercel.json` region set to `icn1` (Seoul) to keep the site close to the database.
- Schema run successfully. Explicit API grants were added before running it.
- Public sign-ups turned **off**.
- Admin user `tejabada7@gmail.com` created and added to `public.admins` (verified: 1 row).
- `.env.local` created with the project URL and publishable key.
- Security checks passed using the public key:
  - Visitors can't insert or edit content (blocked by RLS).
  - The raw profile table and messages are hidden from visitors.
  - The phone number isn't sent to the site unless "Show phone" is on.
  - New sign-ups are refused.

### 13 Sep 2026 — Empty database found and fixed
- The database had a profile row containing only the name and no other content. Saving the Profile page before loading content had hidden the **Load starter content** button.
- Fix: the dashboard now offers starter content whenever the lists are empty (with a confirmation if a profile already exists).
- Fix in `schema.sql` for future setups: create the `site_settings` row up front and upsert it in the live-update trigger. The live database gets this row from `seed.sql`.

### 13–20 Sep 2026 — Database choice reviewed
- Considered switching to **Neon** or **MongoDB Atlas**. Both are database-only, so login, file storage, live updates and security rules would have to be rebuilt in app code.
- **Decision: stay with Supabase.** It's already set up, verified, and provides all four.
- Free-plan pausing after 7 idle days is handled by the daily `/api/keepalive` Vercel cron, which only runs once the site is deployed. A paused project can be restored from the dashboard with no data lost.

### 20 Sep 2026 — Seed script
- Generated `supabase/seed.sql` from `src/lib/seed-content.ts`: profile, section settings, 10 experiences (4 internships + 6 campus roles), 2 projects, 13 skills, 3 certifications and 3 qualifications.
- Confirmed the public key can't write (`42501` RLS error). Content has to be loaded either by running `seed.sql` in the Supabase SQL Editor or with the admin's **Load starter content** button.

### 22 Sep 2026
- Project log created. Database still empty; all content tables have 0 rows.

---

## Decisions

| Decision | Why |
|---|---|
| Supabase over Neon / MongoDB Atlas | Includes login, storage, live updates and database-level security; already set up and verified. |
| Security enforced by Row Level Security | The rules live in the database, so the public key can't be abused even though every visitor's browser has it. |
| Phone hidden by default | `get_public_profile()` only returns the phone when "Show phone" is on. |
| Starter content kept in `seed-content.ts` + `seed.sql` | Avoids retyping the résumé. After loading, the database is the only source; the file is just a fallback if the database is unreachable. |
| Club roles in a separate "Leadership" section | Keeps internships at the top, fixing the LinkedIn ordering problem. |
| Email `tejabada7@gmail.com`, location Visakhapatnam | Matches the résumé and the LinkedIn banner. |

---

## To do (in order)

1. [ ] **Load the content:** run `supabase/seed.sql` in Supabase → SQL Editor, *or* sign in and click **Load starter content**.
2. [ ] **Confirm admin sign-in** at `/admin/login`. If the password is unknown, delete and recreate the user in Supabase → Authentication → Users, then re-run the `insert into public.admins …` query.
3. [ ] **Change the admin password** (Admin → Account). The previous password was typed into a chat session on 20 Sep 2026, so treat it as exposed. Use a strong one.
4. [ ] Test live editing: change the headline in the admin and confirm an open site tab updates within a few seconds.
5. [ ] Add content in the admin:
   - Profile photo.
   - Résumé PDF (re-export from Word with **Save As → PDF** so the links work).
   - Delight Chemicals description.
   - Project cover images.
6. [ ] First git commit (files are staged; `.env.local` is ignored).
7. [ ] Push to a GitHub repository.
8. [ ] Deploy on Vercel with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
9. [ ] In Supabase → Authentication → URL Configuration, set the Site URL and add `https://<site>/admin/account` to the redirect URLs.
10. [ ] After launch: add the site to Bada's LinkedIn and fix the headline typo.

---

## Known limitations

- Admin flows (uploads, live updates, reordering) haven't been tested end to end while signed in, because nobody has signed in yet.
- The live database was created before the 13 Sep schema fix. Its live-update trigger only works once the `site_settings` row exists, which `seed.sql` or **Load starter content** creates.
- Until the site is deployed, the daily keep-alive doesn't run, so the Supabase project can pause after 7 idle days.
- Password reset by email needs the Supabase URL Configuration step (to-do 9).

---

## Key files

| File | Purpose |
|---|---|
| `supabase/schema.sql` | Tables, security rules, storage bucket, Realtime (run once) |
| `supabase/seed.sql` | Bada's starter content (run once; replaces the content tables) |
| `src/lib/seed-content.ts` | Source of the starter content and fallback |
| `src/lib/content.ts` | Loads the public site's content |
| `src/lib/admin-api.ts` | Admin database operations and uploads |
| `src/lib/collections.ts` | Field settings that drive every admin form |
| `src/app/page.tsx` | Homepage |
| `src/app/admin/…` | Admin pages |
| `README.md` | Setup and deployment guide |
