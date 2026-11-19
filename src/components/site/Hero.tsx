import { ArrowDown, Download, Mail, MapPin, Sprout, Award, BookOpen } from 'lucide-react';
import Image from 'next/image';
import type { Stat } from '@/lib/content';
import { initials } from '@/lib/format';
import type { Profile } from '@/lib/types';
import { BlueprintArt } from './BlueprintArt';
import { GitHubIcon, LinkedInIcon } from './icons';
import { VantaHeroBackground } from './VantaHeroBackground';
import { AgritechTelemetry } from './AgritechTelemetry';
import { BlurText } from './BlurText';

type Props = {
  profile: Profile;
  stats: Stat[];
  /** Anchor of the first "work" section for the main call to action. */
  primaryHref: string | null;
  contactHref: string | null;
};

export function Hero({ profile, stats, primaryHref, contactHref }: Props) {
  const [first, ...rest] = profile.full_name.trim().split(/\s+/);

  return (
    <section aria-label="Introduction" className="relative min-h-[90vh] pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
      {/* 3D Interactive WebGL Vanta Background */}
      <VantaHeroBackground />

      <div className="container-x relative z-10 grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {profile.open_to_work && (
              <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                <span className="pulse-dot bg-emerald-400" /> Open for Research & Agronomy Roles
              </span>
            )}
            {profile.location && (
              <span className="chip border-line bg-ink-900/60 text-muted">
                <MapPin size={14} className="text-emerald-400" /> {profile.location}
              </span>
            )}
            <span className="chip border-line bg-ink-900/60 text-muted hidden sm:inline-flex">
              <Sprout size={14} className="text-emerald-400" /> B.Sc. (Hons) Agriculture
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-7xl">
            <span className="text-fg">{first}</span>{' '}
            <span className="text-gradient">{rest.join(' ')}</span>
          </h1>

          {profile.headline && (
            <div className="mt-5 max-w-xl text-lg text-pretty text-muted sm:text-xl font-normal">
              <BlurText text={profile.headline} delay={25} />
            </div>
          )}

          {profile.tagline && (
            <p className="mt-6 max-w-xl border-l-2 border-emerald-500/60 pl-4 font-mono text-sm leading-relaxed text-emerald-300/90 italic">
              “{profile.tagline}”
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            {primaryHref && (
              <a href={primaryHref} className="btn btn-primary group">
                Explore Fieldwork & Research{' '}
                <ArrowDown size={16} className="transition-transform duration-200 group-hover:translate-y-1" />
              </a>
            )}
            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noopener" className="btn btn-outline group">
                <Download size={16} className="transition-transform duration-200 group-hover:-translate-y-0.5" /> Curriculum Vitae
              </a>
            )}
            {contactHref && (
              <a href={contactHref} className="btn btn-ghost hover:text-emerald-300 group">
                <Mail size={16} className="transition-transform duration-200 group-hover:scale-110" /> Get in Touch
              </a>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn profile"
                className="btn btn-ghost btn-icon hover:border-emerald-500/40 hover:text-emerald-300"
              >
                <LinkedInIcon />
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener"
                aria-label="GitHub profile"
                className="btn btn-ghost btn-icon hover:border-emerald-500/40 hover:text-emerald-300"
              >
                <GitHubIcon />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="btn btn-ghost btn-icon hover:border-emerald-500/40 hover:text-emerald-300"
              >
                <Mail size={18} />
              </a>
            )}
            <span className="font-mono text-xs text-subtle pl-2">
              vedhakarri25@gmail.com
            </span>
          </div>
        </div>

        <PortraitFrame profile={profile} />
      </div>

      {/* Real-time Agricultural Telemetry Dashboard Bar */}
      <div className="container-x relative z-10">
        <AgritechTelemetry />
      </div>

      {stats.length > 0 && (
        <div className="container-x relative z-10 mt-12 sm:mt-16">
          <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-emerald-500/20 bg-ink-950/80 backdrop-blur-sm sm:grid-cols-4" style={{ gap: 1 }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group bg-ink-900/90 px-5 py-6 sm:px-6 transition-all duration-300 hover:bg-emerald-950/40 hover:shadow-[inset_0_0_24px_rgba(16,185,129,0.12)] cursor-default"
              >
                <dt className="font-mono text-[11px] tracking-[0.18em] text-emerald-400/80 uppercase transition-colors group-hover:text-emerald-300">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-3xl font-semibold text-fg transition-all duration-300 group-hover:text-emerald-300 group-hover:translate-x-0.5 sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

/** Photo or Agronomic scientific monogram framed with GPS & scale marks. */
function PortraitFrame({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:mx-0 lg:justify-self-end animate-float">
      {/* Top GPS scale */}
      <div className="absolute -top-8 right-6 left-6 flex items-center gap-2 font-mono text-[10px] text-emerald-400/60" aria-hidden="true">
        <span className="h-3 w-px bg-emerald-500/60" />
        <span className="h-px flex-1 bg-emerald-500/30" />
        <span>PARALAKHEMUNDI · CAMPUS</span>
        <span className="h-px flex-1 bg-emerald-500/30" />
        <span className="h-3 w-px bg-emerald-500/60" />
      </div>

      <div className="bp-card relative aspect-square p-3 border-emerald-500/30 bg-ink-900/80 shadow-2xl backdrop-blur-md">
        <div className="relative size-full overflow-hidden rounded-[20px] border border-emerald-500/20 bg-ink-950/90">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={`Photo of ${profile.full_name}`}
              fill
              priority
              sizes="(min-width: 1024px) 400px, 90vw"
              className="object-cover"
            />
          ) : (
            <BlueprintArt label={initials(profile.full_name)} animate className="size-full p-6 text-emerald-400" />
          )}
        </div>
      </div>

      <div className="absolute -bottom-4 left-6 rounded-md border border-emerald-500/30 bg-ink-900 px-3 py-1.5 font-mono text-[10px] tracking-widest text-emerald-300 uppercase shadow-lg">
        PLT · {profile.full_name} · B.Sc.(Ag)
      </div>
    </div>
  );
}
