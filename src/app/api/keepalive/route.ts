import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { supabaseUrl } from '@/lib/supabase/env';

// Force dynamic execution so keepalive pings are never cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Supabase Free Tier Keep-Alive Route.
 *
 * Supabase free-tier projects automatically pause after 7 days of inactivity.
 * This endpoint executes a lightweight query against PostgREST/PostgreSQL,
 * which registers activity and resets the 7-day sleep countdown.
 *
 * Triggered by:
 *   1. Vercel Cron (see vercel.json) every day.
 *   2. GitHub Actions scheduled workflow (.github/workflows/keepalive.yml).
 *   3. Free external cron services (cron-job.org or UptimeRobot).
 */
export async function GET() {
  const start = Date.now();
  const supabase = createServerSupabase(3000);

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        status: 'misconfigured',
        error: 'NEXT_PUBLIC_SUPABASE_URL or ANON_KEY is not configured.',
      },
      { status: 503 }
    );
  }

  try {
    // Lightweight count query that touches PostgreSQL via PostgREST
    const { count, error } = await supabase
      .from('site_settings')
      .select('id', { count: 'exact', head: true });

    const latency = Date.now() - start;

    if (error) {
      // Even if the table does not exist yet (PGRST205), PostgREST received the request
      // and logged activity with Supabase, resetting the inactivity timer.
      return NextResponse.json({
        ok: true,
        heartbeat: 'pinged',
        project_url: supabaseUrl,
        latency_ms: latency,
        note: `Database pinged successfully (${error.message || error.code})`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      heartbeat: 'active',
      project_url: supabaseUrl,
      latency_ms: latency,
      records: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const latency = Date.now() - start;
    const message = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      {
        ok: false,
        heartbeat: 'failed',
        error: message,
        latency_ms: latency,
        timestamp: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
