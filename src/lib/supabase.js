// Supabase client — only created when the project's URL + anon key are present.
//
// The anon key is safe to ship in the browser (it's protected by Row Level
// Security on the database). Set these in your Netlify env (and .env locally):
//   VITE_SUPABASE_URL=https://<project>.supabase.co
//   VITE_SUPABASE_ANON_KEY=<anon public key>
//
// When they're absent, `isCloud` is false and the app falls back to on-device
// accounts (see auth.js / storage.js), so local dev works without a backend.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isCloud = Boolean(url && anonKey);

export const supabase = isCloud
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
