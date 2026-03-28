create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12,2) not null,
  category text not null,
  description text,
  date timestamptz not null default now(),
  source text not null default 'manual' check (source in ('manual', 'qr')),
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  deadline timestamptz not null,
  category text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "transactions_manage_own"
on public.transactions
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "goals_manage_own"
on public.goals
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

