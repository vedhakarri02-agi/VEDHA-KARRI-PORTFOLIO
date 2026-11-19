import {
  Code2,
  Cpu,
  DraftingCompass,
  Gauge,
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
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
      {group(skills).map(([category, items]) => {
        const Icon = iconFor(category);
        const rated = items.filter((s) => s.level !== null);
        const plain = items.filter((s) => s.level === null);
        return (
          <section key={category} aria-label={category} className="bp-card bp-card-hover group p-6 border-emerald-500/20 bg-ink-900/70">
            <header className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Icon size={19} />
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight text-fg group-hover:text-emerald-300 transition-colors">{category}</h3>
            </header>

            {rated.length > 0 && (
              <ul className="mt-5 space-y-3.5">
                {rated.map((skill) => (
                  <li key={skill.id} className="group/item">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-fg/90 transition-colors group-hover/item:text-emerald-300">{skill.name}</span>
                      <span className="font-mono text-xs text-emerald-400/80 transition-colors group-hover/item:text-emerald-300 font-semibold">{skill.level}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-400 transition-all duration-500 group-hover/item:brightness-125 group-hover/item:shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {plain.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {plain.map((skill) => (
                  <li key={skill.id} className="chip border-emerald-500/20 bg-ink-850/80 text-muted">
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
