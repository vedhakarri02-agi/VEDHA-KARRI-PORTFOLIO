'use client';

import { ExternalLink, RotateCw, X } from 'lucide-react';
import { useState } from 'react';

/**
 * The real public site in a phone-sized frame beside the editor (wide screens only).
 * It updates itself through Realtime whenever something is saved.
 */
export function PreviewPane({ onClose }: { onClose: () => void }) {
  const [key, setKey] = useState(0);

  return (
    <aside aria-label="Live preview" className="sticky top-0 hidden h-dvh flex-col border-l border-line bg-ink-900 xl:flex">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
          <span className="pulse-dot" /> Live preview
        </p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setKey((k) => k + 1)} className="btn btn-ghost btn-icon" aria-label="Reload preview">
            <RotateCw size={16} />
          </button>
          <a href="/" target="_blank" rel="noopener" className="btn btn-ghost btn-icon" aria-label="Open site in a new tab">
            <ExternalLink size={16} />
          </a>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close preview">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <iframe key={key} src="/" title="Live preview of the portfolio" className="size-full rounded-xl border border-line bg-ink-950" />
      </div>
    </aside>
  );
}
