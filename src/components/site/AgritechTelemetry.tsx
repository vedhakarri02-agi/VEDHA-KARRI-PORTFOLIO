'use client';

import { Sprout, Activity, Globe, Award, Droplets, Compass } from 'lucide-react';
import type { Portfolio } from '@/lib/types';

export function AgritechTelemetry({ data }: { data?: Portfolio }) {
  const projectsCount = data?.projects?.length ?? 4;
  const skillsCount = data?.skills?.length ?? 16;
  const certsCount = data?.certifications?.length ?? 3;
  const expCount = data?.experiences?.filter((e) => e.kind === 'internship')?.length ?? 2;

  // Derive dynamic focus from headline or top skill category
  const primaryFocus =
    data?.profile?.headline?.split('·')[0]?.trim() || 'Sustainable Agronomy';

  const latestCert = data?.certifications?.[0]?.issuer?.split('—')[0]?.trim() || 'FAO Certified';
  const latestCertTitle = data?.certifications?.[0]?.title?.split('—')[0]?.trim() || 'Agroforestry Transformation';

  const metrics = [
    {
      icon: Sprout,
      label: 'Active Domain',
      value: primaryFocus.length > 24 ? primaryFocus.slice(0, 24) + '...' : primaryFocus,
      sub: `${skillsCount} Verified Competencies`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Activity,
      label: 'Field Research',
      value: `${projectsCount} Agronomic Studies`,
      sub: `${expCount} Fieldwork & Lab Positions`,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Globe,
      label: 'Core Specialization',
      value: data?.skills?.[0]?.category || 'Soil Science & Testing',
      sub: `${data?.skills?.[0]?.name || 'NPK Profiling'} & Diagnostics`,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      icon: Award,
      label: 'Recognitions',
      value: `${certsCount} Credentials`,
      sub: latestCert,
      color: 'text-emerald-300',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
    },
  ];

  return (
    <div className="relative mt-12 overflow-hidden rounded-2xl border border-emerald-500/20 bg-ink-900/60 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-medium tracking-wider text-emerald-400/90 uppercase">
            Field Science & Precision Agronomy Telemetry
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-subtle">
          {data?.profile?.location && (
            <span className="hidden sm:inline-flex items-center gap-1">
              <Compass size={13} className="text-emerald-400" />
              {data.profile.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-emerald-400/80">
            <Droplets size={13} /> Status: Active Fieldwork
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`group flex items-start gap-3.5 rounded-xl border p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-ink-850/90 hover:shadow-[0_8px_24px_-6px_rgba(16,185,129,0.3)] cursor-default ${item.bg}`}
            >
              <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-ink-950/70 border border-emerald-500/20 text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                <Icon size={18} className={item.color} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] tracking-wider text-muted uppercase">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-fg transition-colors group-hover:text-emerald-300">
                  {item.value}
                </p>
                <p className="mt-0.5 truncate text-xs text-subtle">
                  {item.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
