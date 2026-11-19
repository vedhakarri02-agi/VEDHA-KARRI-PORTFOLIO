import { formatDateRange, formatDuration } from '@/lib/format';
import type { Experience } from '@/lib/types';
import { Users, Sparkles } from 'lucide-react';

export function LeadershipGrid({ items }: { items: Experience[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {items.map((item) => {
        const current = item.end_date === null;
        return (
          <li key={item.id} className="bp-card bp-card-hover flex flex-col p-6 border-emerald-500/20 bg-ink-900/70">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-muted">{formatDateRange(item.start_date, item.end_date)}</span>
              {current && (
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-emerald-300 uppercase">
                  Active Role
                </span>
              )}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-fg">{item.role}</h3>
            <p className="mt-1 text-sm font-medium text-emerald-400">{item.organization}</p>
            {item.bullets.length > 0 && (
              <ul className="bullet-list mt-3.5 space-y-2 text-sm leading-relaxed text-muted">
                {item.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
            <p className="mt-auto pt-4 font-mono text-[11px] text-emerald-400/70">{formatDuration(item.start_date, item.end_date)}</p>
          </li>
        );
      })}
    </ul>
  );
}
