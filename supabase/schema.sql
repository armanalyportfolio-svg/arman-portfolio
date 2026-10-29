-- =============================================================================
-- Arman Portfolio — Supabase schema for the admin panel
-- Run this whole file once in Supabase → SQL Editor. It is safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------- Admins
-- Only emails listed here can edit content, read messages or upload files.
create table if not exists public.admin_users (
  email text primary key
);
alter table public.admin_users enable row level security;
-- (no policies: the table is not readable or writable through the API)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------- Site content
-- One row per section (general, hero, about, services, portfolio, ...).
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
  on public.site_content for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
  on public.site_content for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content"
  on public.site_content for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------- Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.contact_messages add column if not exists is_read boolean not null default false;
alter table public.contact_messages enable row level security;

drop policy if exists "Allow public submissions" on public.contact_messages;
create policy "Allow public submissions"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Admins can read messages" on public.contact_messages;
create policy "Admins can read messages"
  on public.contact_messages for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update messages" on public.contact_messages;
create policy "Admins can update messages"
  on public.contact_messages for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete messages" on public.contact_messages;
create policy "Admins can delete messages"
  on public.contact_messages for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------- Media storage
-- Public bucket for images and the CV uploaded from the admin panel.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read media" on storage.objects;
create policy "Public can read media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------- Your admin account
-- 1. Supabase → Authentication → Users → "Add user" (tick "Auto Confirm User").
-- 2. Replace the email below with that user's email and run this line:
-- insert into public.admin_users (email) values ('you@example.com') on conflict do nothing;
