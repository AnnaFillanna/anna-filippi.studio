import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let client: SupabaseClient<Database> | undefined;

/** Lazy singleton: importing this module does not contact Supabase or affect prerendering. */
export function getSupabase(): SupabaseClient<Database> {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('VITE_SUPABASE_URL und VITE_SUPABASE_PUBLISHABLE_KEY müssen gesetzt sein.');
  }

  let parsed: URL;
  try { parsed = new URL(url); }
  catch { throw new Error('VITE_SUPABASE_URL muss eine gültige HTTPS-Projekt-URL sein.'); }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
    throw new Error('VITE_SUPABASE_URL muss eine HTTPS-Projekt-URL ohne Zugangsdaten, Pfad oder Parameter sein.');
  }
  // Accept only the public key format requested for this project, never secret/service-role keys.
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY muss ein Publishable Key sein; geheime Schlüssel sind nicht erlaubt.');
  }

  client = createClient<Database>(url, key, {
    auth: {
      // No login flow yet: avoid persistent browser storage, refresh tasks and URL handling.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}
