import { GraduationCap, Award } from 'lucide-react';
import { formatYears } from '@/lib/format';
import type { Education } from '@/lib/types';

export function EducationList({ items }: { items: Education[] }) {
  return (
    <ol className="grid gap-4">
      {items.map((edu, i) => (
        <li
          key={edu.id}
          className="bp-card bp-card-hover group grid grid-cols-1 gap-4 p-5 sm:grid-cols-[7.5rem_1fr_auto] sm:items-center sm:gap-6 sm:p-6 border-emerald-500/20 bg-ink-900/70"
        >
          <p className="font-mono text-sm font-medium text-emerald-400/90">{formatYears(edu.start_year, edu.end_year)}</p>
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={`hidden size-11 shrink-0 place-items-center rounded-xl border sm:grid transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                i === 0
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                  : 'border-line bg-white/[0.03] text-muted'
              }`}
            >
              <GraduationCap size={20} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg leading-snug font-semibold tracking-tight text-fg group-hover:text-emerald-300 transition-colors">
                  {edu.qualification || edu.institution}
                </h3>
                {i === 0 && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300 uppercase">
                    Current Program
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">
                {[edu.qualification ? edu.institution : '', edu.field].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
          {edu.score && (
            <div className="justify-self-start rounded-xl border border-emerald-500/20 bg-ink-950/70 px-4 py-2 text-left sm:justify-self-end sm:text-right transition-all duration-300 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/30">
              <p className="font-mono text-[10px] tracking-[0.18em] text-emerald-400 uppercase">{edu.score_label || 'Score'}</p>
              <p className="font-display text-lg font-semibold text-fg group-hover:text-emerald-300 transition-colors">{edu.score}</p>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
