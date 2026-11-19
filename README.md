# Veda Sri Karri — B.Sc. (Hons) Agriculture Portfolio + Admin

A bio-agritech portfolio for **Veda Sri Karri** (B.Sc. Hons Agriculture) with a private admin dashboard, interactive 3D Vanta hero canvas, Lenis smooth scrolling, and GSAP scroll animations.
Nothing on the site is hardcoded: every word, photo, project and section lives in a database and is edited at
**`/admin`**. Saved changes appear on the live site within about a second — no redeploy.

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Vanta.js 3D WebGL, Lenis, GSAP, Lucide icons
- **Backend:** Supabase — Postgres database, login, file storage and Realtime live updates
- **Hosting:** Vercel (free tier) + Supabase (free tier)

## How it works

```
Visitor → Next.js renders the page on the server from Supabase (public, visible rows only)
        → the page listens to Supabase Realtime and refreshes itself when content changes
Admin   → /admin/login (email + password; sign-ups disabled)
        → edits are written straight to Supabase with the admin's session
        → Row Level Security accepts writes only from accounts in the `admins` table
```

If Supabase isn't configured (or can't be reached), the site shows the bundled starter content from
`src/lib/seed-content.ts`, so it never renders blank.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase you'll see the starter content and a small notice. `/admin` shows a "Connect your database" screen until the steps below are done.

## Set up Supabase (one time)

1. **Create or open your project** at [supabase.com](https://supabase.com).
2. **Create the database:** Dashboard → **SQL Editor** → New query → paste all of [`supabase/setup_all.sql`](supabase/setup_all.sql) → **Run**.
   It creates the tables, security rules, the `portfolio-media` storage bucket, live-update settings, and populates Veda's starter data.
3. **Turn off public sign-ups:** Authentication → **Sign In / Providers** → turn off **Allow new users to sign up**.
4. **Create the admin account:** Authentication → **Users** → **Add user** → *Create new user* with Veda's email (`vedhakarri25@gmail.com`) and a strong password, and tick **Auto Confirm User**.
5. **Make that account the admin:** in the SQL Editor run:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'vedhakarri25@gmail.com';
   ```
6. **Set up Anti-Sleep Keepalive:**
   The repository includes a GitHub Actions scheduled workflow at `.github/workflows/supabase-keepalive.yml` that pings Supabase twice a day to reset the 7-day inactivity pause counter, keeping the free tier alive 24/7.

## Copyright

© 2026 d2w. All rights reserved.
