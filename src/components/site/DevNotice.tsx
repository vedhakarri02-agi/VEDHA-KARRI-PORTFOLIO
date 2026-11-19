import { TriangleAlert } from 'lucide-react';
import type { ContentSource } from '@/lib/types';

/**
 * Development-only hint that the site is showing the bundled starter content.
 * Visitors never see it — in production the starter content is a silent safety net.
 */
export function DevNotice({ source, error }: { source: ContentSource; error?: string }) {
  if (process.env.NODE_ENV === 'production' || source === 'live') return null;
  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-sm">
      <div className="alert alert-warning shadow-2xl backdrop-blur">
        <TriangleAlert size={18} />
        <span>
          Showing starter content from <code>seed-content.ts</code>.{' '}
          {error ? `Database error: ${error}` : 'Connect Supabase and load content from /admin to go live.'}
        </span>
      </div>
    </div>
  );
}
