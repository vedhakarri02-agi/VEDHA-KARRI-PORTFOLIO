import { ArrowUpRight, Sprout, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { pad2 } from '@/lib/format';
import type { Project } from '@/lib/types';
import { BlueprintArt } from './BlueprintArt';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="bp-card bp-card-hover group flex flex-col overflow-hidden border-emerald-500/20 bg-ink-900/70">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[15px] border-b border-line bg-ink-950">
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={`${project.title} — cover image`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(rgb(16_185_129_/_0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(16_185_129_/_0.06)_1px,transparent_1px)] bg-[size:24px_24px]">
            <BlueprintArt variant={index} className="h-[82%] text-emerald-400/80" />
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-md border border-emerald-500/30 bg-ink-950/80 px-2 py-1 font-mono text-[10px] tracking-widest text-emerald-300/90 backdrop-blur">
          FIELD · {pad2(index + 1)}
        </span>
        {project.featured && (
          <span className="absolute top-3 right-3 rounded-md border border-emerald-400/50 bg-emerald-500/20 px-2.5 py-1 font-mono text-[10px] tracking-widest text-emerald-300 uppercase backdrop-blur flex items-center gap-1 font-semibold">
            <Sparkles size={11} /> Featured Study
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.category && (
          <p className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            {project.category}
          </p>
        )}
        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-fg group-hover:text-emerald-300 transition-colors">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>
        {project.summary && <p className="mt-3 text-[15px] leading-relaxed text-muted">{project.summary}</p>}
        {project.tools.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Methodologies & Tools">
            {project.tools.map((tool) => (
              <li key={tool} className="tag border-emerald-500/20 bg-emerald-500/10 text-emerald-300/90">
                {tool}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-emerald-400 transition-colors group-hover:text-emerald-300">
          Read research case study <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
