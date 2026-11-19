import { Download, Sprout, CheckCircle2, Award, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { paragraphs } from '@/lib/format';
import type { Education, Profile, Skill } from '@/lib/types';

/** About text plus an Agronomic Researcher Dossier & Technical Profile Sheet. */
export function About({
  profile,
  education,
  skills = [],
}: {
  profile: Profile;
  education: Education[];
  skills?: Skill[];
}) {
  const currentEdu = education[0];

  // Group skills by category to generate dynamic pillars, with clean fallback if none
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const fieldHighlights =
    categories.length > 0
      ? categories.slice(0, 4).map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat);
          const topSkillNames = catSkills.map((s) => s.name).slice(0, 3).join(', ');
          return {
            title: cat,
            desc: topSkillNames || 'Specialized agronomic domain and practical fieldwork.',
          };
        })
      : [
          { title: 'Soil Science & Testing', desc: 'Physicochemical evaluation, pH, EC & balanced NPK prescription.' },
          { title: 'Sustainable Agronomy', desc: 'Crop rotation, biofertilizers, IPM & ecological weed stewardship.' },
          { title: 'Agroforestry & Ecology', desc: 'FAO-certified multi-tier tree-crop microclimate modeling.' },
          { title: 'Spatial Precision Ag', desc: 'GIS mapping, satellite NDVI vegetative health tracking.' },
        ];

  const rows: [label: string, value: React.ReactNode][] = [
    ['Candidate', profile.full_name],
    ['Discipline', currentEdu ? currentEdu.qualification : profile.headline.split('·')[0]?.trim() || 'Agricultural Scholar'],
    ['Institution', currentEdu ? currentEdu.institution : 'Centurion University of Technology & Management'],
    ['Academic Standing', currentEdu?.score ? `${currentEdu.score_label}: ${currentEdu.score}` : 'GPA: 8.03 / 10'],
    ['Geographic Base', profile.location],
    ['Availability', profile.open_to_work ? 'Open for Agronomy & Research Projects' : 'Enrolled Scholar'],
    [
      'Curriculum Vitae',
      profile.resume_url ? (
        <a href={profile.resume_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold">
          <Download size={14} /> Download CV (PDF)
        </a>
      ) : (
        <span className="text-subtle font-mono text-xs">Available on request</span>
      ),
    ],
  ];

  return (
    <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-16 items-start">
      <div className="space-y-7 text-lg sm:text-xl leading-relaxed text-pretty text-muted/90 font-normal">
        {paragraphs(profile.about).map((p, i) => (
          <p key={i} className={i === 0 ? 'text-fg font-normal leading-relaxed' : undefined}>
            {p}
          </p>
        ))}

        {/* Core pillars of competence - dynamically populated from skills */}
        <div className="pt-6">
          <h4 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            <Sparkles size={14} /> Core Competence Pillars
          </h4>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fieldHighlights.map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-emerald-500/[0.08] hover:shadow-[0_8px_24px_-6px_rgba(16,185,129,0.25)]"
              >
                <CheckCircle2 size={18} className="mt-0.5 text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:text-emerald-300" />
                <div>
                  <p className="text-base font-semibold text-fg transition-colors group-hover:text-emerald-300">{f.title}</p>
                  <p className="mt-1 text-xs text-subtle leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Dossier Card */}
      <div className="bp-card self-start overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl p-7 sm:p-8">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 font-mono text-xs tracking-wider text-emerald-400 uppercase">
          <span className="flex items-center gap-2 font-semibold">
            <Sprout size={16} /> Researcher Dossier
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-300">
            {currentEdu?.start_year ? `${currentEdu.start_year}–${currentEdu.end_year ?? 'PRES'}` : 'VERIFIED'}
          </span>
        </div>
        <dl className="divide-y divide-white/[0.06]">
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="grid grid-cols-[8.5rem_1fr] gap-3 py-4 text-sm sm:text-base">
                <dt className="font-mono text-xs tracking-wider text-subtle uppercase">{label}</dt>
                <dd className="text-fg/90 font-medium">{value}</dd>
              </div>
            ))}
        </dl>
      </div>
    </div>
  );
}
