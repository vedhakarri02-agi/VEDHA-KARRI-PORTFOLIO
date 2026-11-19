import { ArrowUpRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { pad2 } from '@/lib/format';
import type { Project } from '@/lib/types';
import { BlueprintArt } from './BlueprintArt';

export function ProjectCard({
  project,
  index,
  className = '',
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  const isLarge = index === 0 || project.featured;

  return (
    <article
      className={`bp-card bp-card-hover group flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl ${className}`}
    >
      <div className={`relative overflow-hidden border-b border-white/[0.08] bg-ink-950 ${isLarge ? 'aspect-[16/9] sm:aspect-[21/10]' : 'aspect-[16/10]'}`}>
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={`${project.title} — cover image`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_70%)]">
            <BlueprintArt variant={index} className="h-[75%] text-emerald-400/70" />
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="rounded-full border border-emerald-500/30 bg-ink-950/85 px-3 py-1 font-mono text-[11px] tracking-widest text-emerald-300 backdrop-blur-md">
            FIELD · {pad2(index + 1)}
          </span>
          {project.featured && (
            <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 font-mono text-[11px] tracking-wider text-amber-300 uppercase backdrop-blur-md flex items-center gap-1 font-semibold">
              <Sparkles size={12} /> Key Research
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-9">
        {project.category && (
          <p className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            {project.category}
          </p>
        )}

        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg group-hover:text-emerald-300 transition-colors leading-snug">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>

        {project.summary && (
          <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-muted font-normal">
            {project.summary}
          </p>
        )}

        {project.tools.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Methodologies & Tools">
            {project.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-300/90 transition-colors group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15"
              >
                {tool}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/[0.06]">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-colors group-hover:text-emerald-300">
            Read Case Study & Protocols
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
