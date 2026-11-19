import { ArrowUpRight, Building2, Laptop, MapPin, Sprout } from 'lucide-react';
import Image from 'next/image';
import { formatDateRange, formatDuration } from '@/lib/format';
import type { Experience } from '@/lib/types';

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative ml-3 border-l-2 border-emerald-500/25 sm:ml-4">
      {items.map((item) => {
        const current = item.end_date === null;

        return (
          <li key={item.id} className="relative pb-12 pl-8 last:pb-0 sm:pb-16 sm:pl-12">
            {/* Glowing Timeline Marker */}
            <span
              aria-hidden="true"
              className={`absolute top-8 -left-[9px] size-4 rounded-full border-2 ${
                current
                  ? 'border-emerald-300 bg-emerald-400 shadow-[0_0_16px_rgb(52_211_153_/_0.8)] ring-4 ring-emerald-500/20'
                  : 'border-emerald-500 bg-ink-950 shadow-[0_0_8px_rgb(16_185_129_/_0.4)]'
              }`}
            />

            <article className="bp-card bp-card-hover p-7 sm:p-9 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl">
              <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                <div className="flex min-w-0 items-start gap-4">
                  {item.logo_url && (
                    <Image
                      src={item.logo_url}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-xl border border-white/[0.1] bg-white object-contain p-1.5 shadow-md"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-fg leading-snug">
                      {item.role}
                    </h3>
                    {item.org_url ? (
                      <a
                        href={item.org_url}
                        target="_blank"
                        rel="noopener"
                        className="mt-1 inline-flex items-center gap-1.5 font-medium text-emerald-400 hover:text-emerald-300 text-base"
                      >
                        {item.organization} <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <p className="mt-1 font-medium text-emerald-400 text-base">
                        {item.organization}
                      </p>
                    )}
                  </div>
                </div>

                <div className="font-mono text-xs leading-relaxed text-muted sm:text-right">
                  <p className="text-fg/90 font-medium text-sm">
                    {formatDateRange(item.start_date, item.end_date)}
                  </p>
                  <p className="text-emerald-400/90 mt-0.5">
                    {formatDuration(item.start_date, item.end_date)}
                  </p>
                </div>
              </div>

              {(item.location || item.mode) && (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {item.location && item.location !== item.mode && (
                    <span className="chip border-white/[0.08] bg-white/[0.02]">
                      <MapPin size={13} className="text-emerald-400" /> {item.location}
                    </span>
                  )}
                  {item.mode && (
                    <span className="chip border-white/[0.08] bg-white/[0.02]">
                      <Laptop size={13} className="text-emerald-400" /> {item.mode}
                    </span>
                  )}
                </div>
              )}

              {item.bullets.length > 0 && (
                <ul className="mt-6 space-y-3 text-base text-muted/90 font-normal leading-relaxed">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.skills.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2 pt-6 border-t border-white/[0.06]">
                  {item.skills.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
