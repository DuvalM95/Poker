-- Run this after supabase/schema.sql. It creates the allow-list for admins.
create table if not exists public.poker_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.poker_admins enable row level security;
revoke all on public.poker_admins from anon, authenticated;
grant select on public.poker_admins to authenticated;

drop policy if exists "Admins can view their own access" on public.poker_admins;
create policy "Admins can view their own access"
  on public.poker_admins for select to authenticated
  using ((select auth.uid()) = user_id);

-- After creating the administrator in Authentication > Users, run once:
-- insert into public.poker_admins (user_id)
-- select id from auth.users where email = 'ADMIN_EMAIL_AQUI';
