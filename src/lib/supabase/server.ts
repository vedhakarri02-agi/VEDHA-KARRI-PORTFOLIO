import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './env';

/**
 * Anonymous client for Server Components, Route Handlers and Server Actions.
 * Enforces a 1200ms timeout so slow or offline networks never stall page rendering.
 */
export function createServerSupabase(timeoutMs = 1200): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (url, options = {}) => {
        const signal = options?.signal ?? AbortSignal.timeout(timeoutMs);
        return fetch(url, { ...options, signal });
      },
    },
  });
}
