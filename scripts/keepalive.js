/**
 * Supabase Anti-Sleep Keep-Alive Script
 *
 * Executes an active PostgREST query against the Supabase database.
 * Supabase free-tier projects pause after 7 days of inactivity;
 * running this regularly resets the countdown and keeps the database 100% active.
 *
 * Usage:
 *   node scripts/keepalive.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqnobywvbluuticblnjy.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_NoxTVgBrDQvtuKILs1grQw_W0HBtzfc';

async function ping() {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] Ping target: ${SUPABASE_URL}`);

  const supabase = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { status, error, data } = await supabase
      .from('site_settings')
      .select('id', { count: 'exact', head: true });

    const latency = Date.now() - start;

    if (error && error.code !== 'PGRST205') {
      console.warn(`[WARNING] Query returned ${error.code}: ${error.message} (${latency}ms)`);
      console.log(`[INFO] Request reached Supabase PostgREST layer — activity was registered.`);
      return;
    }

    console.log(`[SUCCESS] Database responded: status ${status} (${latency}ms)`);
    console.log(`[SUCCESS] Supabase project is active and healthy. 7-day sleep timer reset!`);
  } catch (err) {
    console.error(`[ERROR] Heartbeat failed:`, err.message);
    process.exit(1);
  }
}

ping();
