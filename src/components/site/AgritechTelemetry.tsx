'use client';

import { Sprout, Activity, Globe, Award, Droplets, Compass } from 'lucide-react';

export function AgritechTelemetry() {
  const metrics = [
    {
      icon: Sprout,
      label: 'Focus Area',
      value: 'Sustainable Agronomy',
      sub: 'Agroecology & Crop Science',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Activity,
      label: 'Soil Testing Lab',
      value: 'NPK & pH Profiling',
      sub: '120+ Plot Samples Tested',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Globe,
      label: 'Spatial Agtech',
      value: 'GIS & NDVI Mapping',
      sub: 'Multispectral Vegetative Health',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      icon: Award,
      label: 'Global Credential',
      value: 'FAO Certified',
      sub: 'Agroforestry Agrifood Systems',
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
          <span className="hidden sm:inline-flex items-center gap-1">
            <Compass size={13} className="text-emerald-400" />
            18.80° N, 84.42° E
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400/80">
            <Droplets size={13} /> Soil Moisture: Optimal
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
              <div className={`mt-0.5 rounded-lg p-2 ${item.color} bg-ink-950/80 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] tracking-wider text-subtle uppercase transition-colors group-hover:text-emerald-400/90">{item.label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-fg transition-colors group-hover:text-emerald-300">{item.value}</p>
                <p className="truncate text-xs text-muted">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
