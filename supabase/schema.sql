-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  account_no  text not null,
  address     text,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id) default auth.uid()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Customers open the app without signing in, so the anon role may read.
drop policy if exists "orders are readable by everyone" on public.orders;
create policy "orders are readable by everyone"
  on public.orders for select
  using (true);

-- The app is single-user with no sign-in, so the anon role may write.
-- NOTE: the anon key ships in the app bundle, so anyone who reads it can
-- insert and delete orders. There is no server-side restriction to one admin.
drop policy if exists "signed-in clients can insert orders" on public.orders;
drop policy if exists "anyone can insert orders" on public.orders;
create policy "anyone can insert orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "signed-in clients can delete orders" on public.orders;
drop policy if exists "anyone can delete orders" on public.orders;
create policy "anyone can delete orders"
  on public.orders for delete
  to anon, authenticated
  using (true);

-- No update policy exists on purpose: rows cannot be edited by anyone through the API.

-- Push inserts/deletes to open customer screens in real time.
alter publication supabase_realtime add table public.orders;
