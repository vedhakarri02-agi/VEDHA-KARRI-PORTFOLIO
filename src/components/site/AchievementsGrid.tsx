import { Trophy, ExternalLink, Calendar, Building2 } from 'lucide-react';
import type { CustomModuleItem } from '@/lib/types';

export function AchievementsGrid({
  items = [],
  emptyMessage = 'Honors, awards, and milestones in agricultural innovation and academic research.',
}: {
  items?: CustomModuleItem[];
  emptyMessage?: string;
}) {
  const visibleItems = items.filter((item) => item.visible !== false);

  if (visibleItems.length === 0) {
    return (
      <div className="bp-card rounded-[2rem] p-8 sm:p-12 text-center max-w-2xl mx-auto">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
          <Trophy size={28} />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-fg">Milestones & Honors</h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleItems.map((item, idx) => (
        <div
          key={item.id || idx}
          className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.2)]"
        >
          <div className="absolute top-0 right-0 -mr-6 -mt-6 size-28 rounded-full bg-emerald-500/[0.08] blur-2xl transition-all group-hover:scale-150 group-hover:bg-emerald-500/[0.15]" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="grid size-11 place-items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                <Trophy size={20} />
              </span>
              {item.date && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
                  <Calendar size={12} /> {item.date}
                </span>
              )}
            </div>

            <h3 className="font-display text-xl font-semibold text-fg tracking-tight group-hover:text-emerald-300 transition-colors">
              {item.title}
            </h3>

            {item.subtitle && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-mono text-subtle">
                <Building2 size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">{item.subtitle}</span>
              </p>
            )}

            {item.description && (
              <p className="mt-4 text-sm text-muted/90 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {item.link && (
            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <a
                href={item.link}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Verification & details <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
