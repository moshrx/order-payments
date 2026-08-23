# Cashflow pending orders

Next.js app for recording pending orders and showing them to customers.

## Setup

```bash
npm install
cp .env.example .env.local   # then paste your Supabase URL and anon key
npm run dev
```

Open http://localhost:3000.

Run `supabase/schema.sql` once in the Supabase SQL editor to create the table.

## The two views

| Route | Who it is for | What it does |
| --- | --- | --- |
| `/` | Customers | Read-only list of orders, updates live |
| `/admin` | You | Add and delete orders |

There is no sign-in. Anyone with the `/admin` URL can add and delete orders, and
the anon key in the browser has write access, so treat both URLs as private.

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm start        # serve the production build
```
