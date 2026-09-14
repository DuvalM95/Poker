-- Ejecuta este archivo en Supabase: SQL Editor > New query > Run.
-- Nunca uses la service_role key en el navegador.

create table if not exists public.poker_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  club_name text not null default '',
  tournament_tag text not null default 'none',
  ticket_counter integer not null default 1 check (ticket_counter > 0),
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists one_active_poker_session_per_user
  on public.poker_sessions(user_id) where archived_at is null;
create index if not exists poker_sessions_user_id_idx on public.poker_sessions(user_id);

create table if not exists public.poker_movements (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.poker_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  ticket integer not null check (ticket > 0),
  ticket_label text not null,
  name text not null,
  name_key text not null,
  amount numeric(12,2) not null check (amount > 0),
  kind text not null check (kind in ('entrada', 'salida')),
  method text not null,
  tournament_tag text not null default 'none',
  created_at timestamptz not null default now()
);
create index if not exists poker_movements_session_created_idx on public.poker_movements(session_id, created_at desc);
create index if not exists poker_movements_user_id_idx on public.poker_movements(user_id);

create table if not exists public.poker_rake (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.poker_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);
create index if not exists poker_rake_session_created_idx on public.poker_rake(session_id, created_at desc);
create index if not exists poker_rake_user_id_idx on public.poker_rake(user_id);

-- The browser uses the public/publishable key. RLS is what protects the data.
alter table public.poker_sessions enable row level security;
alter table public.poker_movements enable row level security;
alter table public.poker_rake enable row level security;

revoke all on public.poker_sessions, public.poker_movements, public.poker_rake from anon, authenticated;
grant select, insert, update on public.poker_sessions to authenticated;
grant select, insert on public.poker_movements to authenticated;
grant select, insert, delete on public.poker_rake to authenticated;

create policy "Users manage their sessions" on public.poker_sessions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users manage their movements" on public.poker_movements for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users manage their rake" on public.poker_rake for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
