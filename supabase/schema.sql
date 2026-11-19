-- =====================================================================
-- Veda Sri Karri Portfolio — database schema, security rules, storage and live updates.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- It is safe to run again after changes.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Admins: only users listed here can edit the portfolio.
-- After creating the admin user (Authentication → Users → Add user), run:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'vedhakarri25@gmail.com';
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Profile (a single row): hero, about, contact details and SEO.
-- ---------------------------------------------------------------------
create table if not exists public.profile (
  id              smallint primary key default 1 check (id = 1),
  full_name       text not null default '' check (char_length(full_name) <= 120),
  headline        text not null default '' check (char_length(headline) <= 220),
  tagline         text not null default '' check (char_length(tagline) <= 300),
  about           text not null default '' check (char_length(about) <= 6000),
  location        text not null default '' check (char_length(location) <= 120),
  email           text not null default '' check (char_length(email) <= 200),
  phone           text not null default '' check (char_length(phone) <= 40),
  show_phone      boolean not null default false,
  linkedin_url    text not null default '',
  github_url      text not null default '',
  avatar_url      text not null default '',
  resume_url      text not null default '',
  open_to_work    boolean not null default true,
  seo_title       text not null default '' check (char_length(seo_title) <= 120),
  seo_description text not null default '' check (char_length(seo_description) <= 320),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Site settings (a single row): homepage section order/visibility and a
-- content version the public site listens to for live updates.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id              smallint primary key default 1 check (id = 1),
  sections        jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  content_version bigint not null default 0,
  updated_at      timestamptz not null default now()
);

-- The row must exist from the start: live updates bump its content_version.
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Experience: internships and leadership / activities.
-- ---------------------------------------------------------------------
create table if not exists public.experiences (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'internship' check (kind in ('internship', 'leadership')),
  role         text not null check (char_length(role) between 1 and 120),
  organization text not null check (char_length(organization) between 1 and 160),
  org_url      text not null default '',
  logo_url     text not null default '',
  location     text not null default '' check (char_length(location) <= 120),
  mode         text not null default '' check (mode in ('', 'On-site', 'Remote', 'Hybrid')),
  start_date   date not null,
  end_date     date check (end_date is null or end_date >= start_date),
  bullets      text[] not null default '{}',
  skills       text[] not null default '{}',
  sort_order   integer not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title       text not null check (char_length(title) between 1 and 160),
  category    text not null default '' check (char_length(category) <= 120),
  summary     text not null default '' check (char_length(summary) <= 400),
  description text not null default '' check (char_length(description) <= 10000),
  tools       text[] not null default '{}',
  cover_url   text not null default '',
  gallery     text[] not null default '{}',
  links       jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array'),
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  category   text not null default 'Other' check (char_length(category) between 1 and 60),
  name       text not null check (char_length(name) between 1 and 80),
  level      smallint check (level is null or level between 0 and 100),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Certifications & workshops
-- ---------------------------------------------------------------------
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(title) between 1 and 200),
  issuer         text not null default '' check (char_length(issuer) <= 160),
  issued_on      text not null default '' check (char_length(issued_on) <= 40),
  credential_url text not null default '',
  file_url       text not null default '',
  sort_order     integer not null default 0,
  is_visible     boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Education
-- ---------------------------------------------------------------------
create table if not exists public.education (
  id            uuid primary key default gen_random_uuid(),
  institution   text not null check (char_length(institution) between 1 and 200),
  qualification text not null default '' check (char_length(qualification) <= 160),
  field         text not null default '' check (char_length(field) <= 160),
  start_year    smallint check (start_year is null or start_year between 1950 and 2100),
  end_year      smallint check (end_year is null or end_year between 1950 and 2100),
  score_label   text not null default '' check (char_length(score_label) <= 40),
  score         text not null default '' check (char_length(score) <= 40),
  sort_order    integer not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists experiences_order_idx    on public.experiences (kind, sort_order);
create index if not exists projects_order_idx       on public.projects (sort_order);
create index if not exists skills_order_idx         on public.skills (sort_order);
create index if not exists certifications_order_idx on public.certifications (sort_order);
create index if not exists education_order_idx      on public.education (sort_order);

-- ---------------------------------------------------------------------
-- Contact messages from the site's contact form.
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 100),
  email      text not null check (char_length(email) between 3 and 200),
  message    text not null check (char_length(message) between 1 and 5000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_idx on public.messages (created_at desc);

-- ---------------------------------------------------------------------
-- Triggers: keep updated_at current, and bump site_settings.content_version
-- whenever the admin changes content — open visitor pages listen to that
-- single row and refresh themselves.
-- ---------------------------------------------------------------------
create or replace function public.bump_content_version()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  -- Statement triggers fire even when RLS blocks every row; only real admin edits count.
  if public.is_admin() then
    insert into public.site_settings (id, content_version) values (1, 1)
    on conflict (id) do update set content_version = public.site_settings.content_version + 1;
  end if;
  return null;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profile', 'site_settings', 'experiences', 'projects', 'skills', 'certifications', 'education'] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;

  foreach t in array array['profile', 'experiences', 'projects', 'skills', 'certifications', 'education'] loop
    execute format('drop trigger if exists bump_content_version on public.%I', t);
    execute format('create trigger bump_content_version after insert or update or delete on public.%I for each statement execute function public.bump_content_version()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Public profile: everything except the phone number unless "show phone" is on.
-- The profile table itself is admin-only, so a hidden phone never leaves the database.
-- ---------------------------------------------------------------------
create or replace function public.get_public_profile()
returns jsonb
language sql stable security definer
set search_path = public
as $$
  select (to_jsonb(p) - 'phone' - 'updated_at')
         || jsonb_build_object('phone', case when p.show_phone then p.phone else '' end)
  from public.profile p
  where p.id = 1;
$$;

revoke all on function public.get_public_profile() from public;
grant execute on function public.get_public_profile() to anon, authenticated;

-- ---------------------------------------------------------------------
-- API access for the anon / authenticated roles. Supabase usually grants these
-- automatically; granting them explicitly keeps the site working on projects
-- created with "automatically expose new tables" turned off. The Row Level
-- Security policies below still decide which rows each role can see or change.
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.experiences, public.projects, public.skills,
  public.certifications, public.education to anon, authenticated;
grant insert on public.messages to anon, authenticated;
grant select, insert, update, delete on public.profile, public.site_settings, public.experiences,
  public.projects, public.skills, public.certifications, public.education, public.messages to authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security: the public (anon) key can only do what these allow.
-- ---------------------------------------------------------------------
alter table public.admins         enable row level security;
alter table public.profile        enable row level security;
alter table public.site_settings  enable row level security;
alter table public.experiences    enable row level security;
alter table public.projects       enable row level security;
alter table public.skills         enable row level security;
alter table public.certifications enable row level security;
alter table public.education      enable row level security;
alter table public.messages       enable row level security;

-- Profile: only the admin reads the raw row (visitors use get_public_profile()).
drop policy if exists "Admins manage profile" on public.profile;
create policy "Admins manage profile" on public.profile
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Site settings: everyone can read; only the admin can change.
drop policy if exists "Settings are public" on public.site_settings;
create policy "Settings are public" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "Admins manage settings" on public.site_settings;
create policy "Admins manage settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Content lists: everyone sees visible rows; the admin sees and manages everything.
do $$
declare
  t text;
begin
  foreach t in array array['experiences', 'projects', 'skills', 'certifications', 'education'] loop
    execute format('drop policy if exists "Visible rows are public" on public.%I', t);
    execute format('create policy "Visible rows are public" on public.%I for select to anon, authenticated using (is_visible)', t);
    execute format('drop policy if exists "Admins manage rows" on public.%I', t);
    execute format('create policy "Admins manage rows" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Messages: anyone may send one; only the admin can read or manage them.
drop policy if exists "Anyone can send a message" on public.messages;
create policy "Anyone can send a message" on public.messages
  for insert to anon, authenticated with check (is_read = false);

drop policy if exists "Admins read messages" on public.messages;
create policy "Admins read messages" on public.messages
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins update messages" on public.messages;
create policy "Admins update messages" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete messages" on public.messages;
create policy "Admins delete messages" on public.messages
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: public bucket for the photo, project images, certificates and résumé.
-- Anyone can view files by URL; only the admin can upload, replace or delete.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media', 'portfolio-media', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins read media" on storage.objects;
create policy "Admins read media" on storage.objects
  for select to authenticated using (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-media' and public.is_admin());

-- ---------------------------------------------------------------------
-- Live updates (Supabase Realtime).
-- Visitors listen to site_settings (content_version changes on every edit);
-- the admin inbox listens to messages (RLS keeps them private).
-- ---------------------------------------------------------------------
do $$
begin
  begin
    alter publication supabase_realtime add table public.site_settings;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.messages;
  exception when duplicate_object then null;
  end;
end $$;
