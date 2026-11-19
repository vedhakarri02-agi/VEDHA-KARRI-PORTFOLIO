import { Download, Sprout, CheckCircle2, Award, BookOpen, MapPin } from 'lucide-react';
import { paragraphs } from '@/lib/format';
import type { Education, Profile } from '@/lib/types';

/** About text plus an Agronomic Researcher Dossier & Technical Profile Sheet. */
export function About({ profile, education }: { profile: Profile; education: Education[] }) {
  const currentEdu = education[0];

  const fieldHighlights = [
    { title: 'Soil Science & Testing', desc: 'Physicochemical evaluation, pH, EC & balanced NPK prescription.' },
    { title: 'Sustainable Agronomy', desc: 'Crop rotation, biofertilizers, IPM & ecological weed stewardship.' },
    { title: 'Agroforestry & Ecology', desc: 'FAO-certified multi-tier tree-crop microclimate modeling.' },
    { title: 'Spatial Precision Ag', desc: 'GIS mapping, satellite NDVI vegetative health tracking.' },
  ];

  const rows: [label: string, value: React.ReactNode][] = [
    ['Candidate', profile.full_name],
    ['Discipline', 'B.Sc. (Hons) Agriculture'],
    ['Institution', currentEdu ? currentEdu.institution : 'Centurion University of Technology & Management'],
    ['Current Standing', currentEdu ? `${currentEdu.score_label}: ${currentEdu.score}` : 'GPA: 8.03 / 10'],
    ['Geographic Base', profile.location],
    ['Languages', 'English (Proficient) · Telugu (Native)'],
    ['Availability', profile.open_to_work ? 'Open for Agronomy & Research Projects' : 'Enrolled Scholar'],
    [
      'Curriculum Vitae',
      profile.resume_url ? (
        <a href={profile.resume_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium">
          <Download size={14} /> Download PDF
        </a>
      ) : (
        <span className="text-subtle font-mono text-xs">Available on request</span>
      ),
    ],
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14 items-start">
      <div className="space-y-6 text-lg leading-relaxed text-pretty text-muted">
        {paragraphs(profile.about).map((p, i) => (
          <p key={i} className={i === 0 ? 'text-fg font-normal' : undefined}>
            {p}
          </p>
        ))}

        {/* Core pillars of competence */}
        <div className="pt-4">
          <h4 className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            Core Agricultural Pillars
          </h4>
          <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fieldHighlights.map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-2.5 rounded-xl border border-line bg-ink-900/60 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-ink-850/90 hover:shadow-[0_4px_16px_-4px_rgba(16,185,129,0.25)]"
              >
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:text-emerald-300" />
                <div>
                  <p className="text-sm font-semibold text-fg transition-colors group-hover:text-emerald-300">{f.title}</p>
                  <p className="text-xs text-subtle">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bp-card self-start overflow-hidden border-emerald-500/20 bg-ink-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] tracking-[0.18em] text-emerald-400 uppercase">
          <span className="flex items-center gap-1.5">
            <Sprout size={13} /> Researcher Dossier
          </span>
          <span className="text-subtle">ACAD · 2024–2028</span>
        </div>
        <dl className="divide-y divide-line">
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3.5 text-sm">
                <dt className="font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">{label}</dt>
                <dd className="text-fg/90">{value}</dd>
              </div>
            ))}
        </dl>
      </div>
    </div>
  );
}
