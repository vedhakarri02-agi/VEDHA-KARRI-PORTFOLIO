'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

/**
 * Keeps an open page in sync with the admin: every content edit bumps
 * site_settings.content_version (a database trigger), Supabase Realtime pushes
 * that change here, and the page re-renders on the server with the new content.
 */
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const channel = supabase
      .channel('site-content')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        // One save can touch several rows; refresh once after they settle.
        clearTimeout(timer);
        timer = setTimeout(() => router.refresh(), 350);
      })
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
