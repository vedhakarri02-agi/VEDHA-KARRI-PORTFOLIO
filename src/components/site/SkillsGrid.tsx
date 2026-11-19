import {
  Code2,
  Cpu,
  DraftingCompass,
  Sparkles,
  Users,
  Wrench,
  Sprout,
  FlaskConical,
  Trees,
  Globe,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import type { Skill } from '@/lib/types';

const ICONS: [pattern: RegExp, icon: LucideIcon][] = [
  [/soil|nutrient|chem|fertiliz|lab/i, FlaskConical],
  [/crop|agronomy|seed|plant|protect|pest/i, Sprout],
  [/field|survey|natural|forest|water|agro/i, Trees],
  [/gis|remote|sensing|precis|tech|map|data/i, Globe],
  [/business|econom|manage|entrepreneur/i, TrendingUp],
  [/cad|design|draft|model/i, DraftingCompass],
  [/program|cod|software/i, Code2],
  [/electr|embedded|robot/i, Cpu],
  [/tool|office/i, Wrench],
  [/profession|soft|leader/i, Users],
];

function iconFor(category: string): LucideIcon {
  return ICONS.find(([pattern]) => pattern.test(category))?.[1] ?? Sparkles;
}

/** Groups skills by category, keeping the order they were arranged in from the admin. */
function group(skills: Skill[]): [string, Skill[]][] {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const key = skill.category.trim() || 'Other';
    groups.set(key, [...(groups.get(key) ?? []), skill]);
  }
  return [...groups.entries()];
}

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const grouped = group(skills);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {grouped.map(([category, items]) => {
        const Icon = iconFor(category);

        return (
          <section
            key={category}
            aria-label={category}
            className="bp-card bp-card-hover group flex flex-col p-8 sm:p-9 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl"
          >
            <header className="flex items-center gap-4 border-b border-white/[0.06] pb-6">
              <span className="grid size-12 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_24px_rgba(16,185,129,0.15)]">
                <Icon size={22} />
              </span>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-fg group-hover:text-emerald-300 transition-colors">
                  {category}
                </h3>
                <p className="font-mono text-xs text-muted/80 mt-0.5">
                  {items.length} {items.length === 1 ? 'Competency' : 'Competencies'}
                </p>
              </div>
            </header>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {items.map((s) => (
                <div
                  key={s.id}
                  className="group/item flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-fg/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                  <span className="size-1.5 rounded-full bg-emerald-400/80 transition-colors group-hover/item:bg-emerald-300" />
                  <span className="font-medium">{s.name}</span>
                  {s.level !== null && (
                    <span className="ml-1 font-mono text-[11px] text-muted group-hover/item:text-emerald-300/80">
                      {s.level}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
