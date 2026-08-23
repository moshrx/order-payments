import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** False until .env.local holds a project URL and anon key. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(
  url ?? 'http://localhost:54321',
  anonKey ?? 'not-configured'
);
