import { ArrowUpRight, Building2, Laptop, MapPin, Sprout } from 'lucide-react';
import Image from 'next/image';
import { formatDateRange, formatDuration } from '@/lib/format';
import type { Experience } from '@/lib/types';

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative ml-2 border-l border-emerald-500/20 sm:ml-3">
      {items.map((item) => {
        const current = item.end_date === null;
        return (
          <li key={item.id} className="relative pb-8 pl-7 last:pb-0 sm:pl-10">
            <span
              aria-hidden="true"
              className={`absolute top-7 -left-[7px] size-3.5 rounded-full border-2 ${
                current
                  ? 'border-emerald-400 bg-emerald-500 shadow-[0_0_0_4px_rgb(16_185_129_/_0.25)]'
                  : 'border-emerald-500/70 bg-ink-950'
              }`}
            />
            <article className="bp-card bp-card-hover p-5 sm:p-7 border-emerald-500/20 bg-ink-900/70">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex min-w-0 items-start gap-4">
                  {item.logo_url && (
                    <Image
                      src={item.logo_url}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 shrink-0 rounded-lg border border-line bg-white object-contain p-1"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-fg">{item.role}</h3>
                    {item.org_url ? (
                      <a
                        href={item.org_url}
                        target="_blank"
                        rel="noopener"
                        className="mt-0.5 inline-flex items-center gap-1 font-medium text-emerald-400 hover:text-emerald-300"
                      >
                        {item.organization} <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <p className="mt-0.5 font-medium text-emerald-400">{item.organization}</p>
                    )}
                  </div>
                </div>
                <div className="font-mono text-xs leading-relaxed text-muted sm:text-right">
                  <p className="text-fg/90">{formatDateRange(item.start_date, item.end_date)}</p>
                  <p className="text-emerald-400/80">{formatDuration(item.start_date, item.end_date)}</p>
                </div>
              </div>

              {(item.location || item.mode) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.location && item.location !== item.mode && (
                    <span className="chip border-line bg-ink-850/80">
                      <MapPin size={13} className="text-emerald-400" /> {item.location}
                    </span>
                  )}
                  {item.mode && (
                    <span className="chip border-line bg-ink-850/80">
                      {item.mode === 'Remote' ? (
                        <Laptop size={13} className="text-emerald-400" />
                      ) : (
                        <Building2 size={13} className="text-emerald-400" />
                      )}
                      {item.mode}
                    </span>
                  )}
                </div>
              )}

              {item.bullets.length > 0 && (
                <ul className="bullet-list mt-5 space-y-2.5 text-[15px] leading-relaxed text-muted">
                  {item.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}

              {item.skills.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills used">
                  {item.skills.map((skill) => (
                    <li key={skill} className="tag border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
