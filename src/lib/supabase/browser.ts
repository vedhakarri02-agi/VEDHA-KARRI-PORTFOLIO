'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './env';

let client: SupabaseClient | null = null;

/**
 * Browser client. In the admin dashboard it carries the signed-in admin's session;
 * on the public site it is only used to listen for live content updates.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  client ??= createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
