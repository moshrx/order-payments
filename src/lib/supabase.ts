import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for this app's own tables (`sent_orders`, `bank_details`).
 *
 * Uses the SERVICE ROLE key, not the anon key. The cash-flow project revoked
 * every `anon` privilege (migration 007_lock_down_rls.sql) because that key is
 * compiled into browser bundles and anyone could copy it from devtools — so
 * anon now returns 401 on every table.
 *
 * `server-only` above is the guard that matters: importing this module from a
 * Client Component is a build error, so the key cannot reach a browser. Every
 * caller here is already a Server Component or a 'use server' action.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** False until .env.local holds a project URL and a service-role key. */
export const isSupabaseConfigured = Boolean(url && serviceRoleKey);

export const supabase = createClient(
  url ?? 'http://localhost:54321',
  serviceRoleKey ?? 'not-configured',
  // No browser session to persist: every call is server-side.
  { auth: { persistSession: false } }
);
