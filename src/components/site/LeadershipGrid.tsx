import { formatDateRange, formatDuration } from '@/lib/format';
import type { Experience } from '@/lib/types';
import { Users, Sparkles } from 'lucide-react';

export function LeadershipGrid({ items }: { items: Experience[] }) {
  return (
    <ul className="grid gap-8 sm:grid-cols-2">
      {items.map((item) => {
        const current = item.end_date === null;

        return (
          <li
            key={item.id}
            className="bp-card bp-card-hover flex flex-col p-8 sm:p-9 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <span className="font-mono text-xs font-medium text-muted">
                {formatDateRange(item.start_date, item.end_date)}
              </span>
              {current && (
                <span className="rounded-full border border-emerald-400/50 bg-emerald-400/20 px-3 py-0.5 font-mono text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Active Role
                </span>
              )}
            </div>

            <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-fg leading-snug group-hover:text-emerald-300 transition-colors">
              {item.role}
            </h3>

            <p className="mt-2 text-base font-semibold text-emerald-400">
              {item.organization}
            </p>

            {item.bullets.length > 0 && (
              <ul className="mt-5 space-y-2.5 text-base leading-relaxed text-muted font-normal">
                {item.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-auto pt-6 font-mono text-xs text-emerald-400/80 font-medium">
              Duration: {formatDuration(item.start_date, item.end_date)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
