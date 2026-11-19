import { GraduationCap } from 'lucide-react';
import { formatYears } from '@/lib/format';
import type { Education } from '@/lib/types';

export function EducationList({ items }: { items: Education[] }) {
  return (
    <ol className="grid gap-6">
      {items.map((edu, i) => (
        <li
          key={edu.id}
          className="bp-card bp-card-hover group grid grid-cols-1 gap-5 p-7 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center sm:gap-8 sm:p-8 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl"
        >
          <p className="font-mono text-sm font-semibold text-emerald-400">
            {formatYears(edu.start_year, edu.end_year)}
          </p>

          <div className="flex min-w-0 items-start gap-5">
            <span
              className={`hidden size-13 shrink-0 place-items-center rounded-2xl border sm:grid transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md ${
                i === 0
                  ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                  : 'border-white/[0.1] bg-white/[0.03] text-muted'
              }`}
            >
              <GraduationCap size={22} />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-fg group-hover:text-emerald-300 transition-colors">
                  {edu.qualification || edu.institution}
                </h3>
                {i === 0 && (
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-0.5 text-xs font-mono font-semibold text-emerald-300 uppercase">
                    Active Scholar
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-base text-muted font-normal leading-relaxed">
                {[edu.qualification ? edu.institution : '', edu.field].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>

          {edu.score && (
            <div className="justify-self-start rounded-2xl border border-white/[0.1] bg-white/[0.03] px-5 py-3 text-left sm:justify-self-end sm:text-right backdrop-blur-md transition-all duration-300 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10">
              <p className="font-mono text-[11px] tracking-wider text-emerald-400 uppercase font-semibold">
                {edu.score_label || 'Score'}
              </p>
              <p className="font-display text-xl font-bold text-fg group-hover:text-emerald-300 transition-colors mt-0.5">
                {edu.score}
              </p>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
