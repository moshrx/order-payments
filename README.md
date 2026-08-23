# Orders

A small mobile app (Expo / React Native) backed by Supabase, with two sides:

- **Client** — signs in, records an order (name, account no, optional address), browses the full history.
- **Customer view** — read-only. Sees order details and nothing else: no sign-in, no create, no edit, no delete.

## Setup

1. **Create the table.** In your Supabase dashboard open **SQL Editor → New query**, paste
   [`supabase/schema.sql`](supabase/schema.sql) and run it. It creates `public.orders`, turns on
   row level security, and adds the policies below.

2. **Add your keys.** Copy `.env.example` to `.env` and fill in:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   Both come from **Project Settings → Data API / API Keys**. Only ever use the *anon* key here —
   `EXPO_PUBLIC_` values are readable inside the shipped app bundle. `.env` is gitignored.

3. **Create the client's login.** **Authentication → Users → Add user**, with an email and
   password. That account is what the order desk signs in with. Don't create accounts for
   customers — they never sign in.

4. **Run it.**

   ```bash
   npm install
   npx expo start --clear
   ```

   Press `i` for the iOS simulator, `a` for Android, `w` for the browser, or scan the QR code
   with **Expo Go** on a phone.

Until `.env` is filled in, every screen shows a "Not connected yet" notice instead of failing.

## How the customer is kept out of the client pages

Two layers, and the second is the one that matters:

**In the app** — [`src/app/client/_layout.tsx`](src/app/client/_layout.tsx) wraps every `/client`
route. With no session it renders a redirect to `/sign-in`, so typing the URL, deep-linking, or
tapping back all land on the sign-in screen rather than the history.

**In the database** — row level security in [`supabase/schema.sql`](supabase/schema.sql) decides
what the anon key can actually do:

| Action | Customer (anon) | Client (signed in) |
| --- | --- | --- |
| Read orders | yes | yes |
| Create an order | **rejected by Postgres** | yes |
| Delete an order | **rejected by Postgres** | yes |
| Edit an order | **rejected by Postgres** | **rejected by Postgres** — no update policy exists |

So even someone who unpacks the app bundle, takes the anon key and calls the API directly still
cannot write anything. The UI guard is convenience; RLS is the enforcement.

## Screens

| Route | Who | What |
| --- | --- | --- |
| `/` | both | Entry screen — pick Client or Customer view |
| `/sign-in` | client | Email + password sign-in |
| `/client` | client (auth) | Order history, newest first, with **New order** and sign out |
| `/client/new` | client (auth) | The input form (name + account no required, address optional) |
| `/client/[id]` | client (auth) | Order details, with delete behind a two-step confirm |
| `/view` | customer | Read-only list of orders |
| `/view/[id]` | customer | Read-only order details |

## Project layout

```
src/
  app/                      expo-router routes (the table above)
  components/               OrderCard, DetailRow, EmptyState, ErrorNotice, SetupNotice
  components/ui/            Button, Card, Screen, Text, TextField, Badge
  constants/theme.ts        colors (light + dark), spacing, radii
  lib/supabase.ts           Supabase client
  features/auth/            session state, signIn, signOut
  features/orders/
    types.ts                Order model
    orders-repository.ts    every Supabase query for orders lives here
    orders-provider.tsx     React context over the repository
    format.ts               date formatting
supabase/schema.sql         table + RLS policies + realtime
```

Orders are read once on load and then kept current by Supabase realtime, so an order saved on
the client's phone appears on a customer's open screen without a manual refresh. Pull to refresh
also works on both lists.

## Worth knowing

Order details are readable by anyone running the app, because customers don't sign in — that is
what makes the customer view work without accounts. Account numbers and addresses are therefore
visible to any holder of the app and anon key. If those need to be private per customer, the
customer side needs sign-in too, plus a policy narrowing `select` to that customer's own rows.
