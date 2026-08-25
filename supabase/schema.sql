-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

-- Payout bank account attached to a payment order from the Cash Flow API.
-- `payment_id` is the payment's id in that API, so each order holds at most
-- one set of bank details and saving again overwrites them.
create table if not exists public.bank_details (
  payment_id      uuid primary key,
  account_holder  text not null,
  account_number  text not null,
  ifsc            text not null,
  bank_name       text,
  -- Payout amount typed by the admin. This is the only amount customers see,
  -- deliberately independent of the Cash Flow API figure.
  amount_inr      numeric,
  updated_at      timestamptz not null default now()
);

-- Existing installs: add the column to a table created before it existed.
alter table public.bank_details add column if not exists amount_inr numeric;

alter table public.bank_details enable row level security;

-- Customers open the app without signing in, so the anon role may read.
drop policy if exists "bank details are readable by everyone" on public.bank_details;
create policy "bank details are readable by everyone"
  on public.bank_details for select
  using (true);

-- The app is single-user with no sign-in, so the anon role may write.
-- NOTE: the anon key ships in the app bundle, so anyone who reads it can
-- insert and update bank details. There is no server-side restriction to one admin.
drop policy if exists "anyone can insert bank details" on public.bank_details;
create policy "anyone can insert bank details"
  on public.bank_details for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anyone can update bank details" on public.bank_details;
create policy "anyone can update bank details"
  on public.bank_details for update
  to anon, authenticated
  using (true)
  with check (true);

-- Orders the admin sent to the customer-facing orders page. Customers only
-- ever see rows from this table (name, amount, phone, date), never the Cash
-- Flow API data directly. The admin can edit a row after sending; removing
-- the row takes the order off the page again.
create table if not exists public.sent_orders (
  payment_id     uuid primary key,
  customer_name  text not null,
  phone          text not null,
  amount_cad     numeric not null,
  amount_inr     numeric not null,
  -- When the payment was recorded in Cash Flow; the date customers see.
  created_at     timestamptz not null,
  sent_at        timestamptz not null default now()
);

alter table public.sent_orders enable row level security;

drop policy if exists "sent orders are readable by everyone" on public.sent_orders;
create policy "sent orders are readable by everyone"
  on public.sent_orders for select
  using (true);

-- Same open-write caveat as bank_details above: no sign-in, anon may write.
drop policy if exists "anyone can insert sent orders" on public.sent_orders;
create policy "anyone can insert sent orders"
  on public.sent_orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anyone can update sent orders" on public.sent_orders;
create policy "anyone can update sent orders"
  on public.sent_orders for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "anyone can delete sent orders" on public.sent_orders;
create policy "anyone can delete sent orders"
  on public.sent_orders for delete
  to anon, authenticated
  using (true);

-- The old `public.orders` table from the manual-entry version of the app is
-- no longer used. Once you are sure nothing else reads it, you can remove it:
-- drop table if exists public.orders;
