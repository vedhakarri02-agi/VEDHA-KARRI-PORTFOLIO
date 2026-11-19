import { ArrowDown, Download, Mail, MapPin, Sprout } from 'lucide-react';
import Image from 'next/image';
import type { Stat } from '@/lib/content';
import { initials } from '@/lib/format';
import type { Portfolio, Profile } from '@/lib/types';
import { BlueprintArt } from './BlueprintArt';
import { GitHubIcon, LinkedInIcon } from './icons';
import { VantaHeroBackground } from './VantaHeroBackground';
import { BlurText } from './BlurText';

type Props = {
  profile: Profile;
  stats: Stat[];
  /** Anchor of the first "work" section for the main call to action. */
  primaryHref: string | null;
  contactHref: string | null;
  portfolio?: Portfolio;
};

export function Hero({ profile, stats, primaryHref, contactHref, portfolio }: Props) {
  const [first, ...rest] = profile.full_name.trim().split(/\s+/);
  const disciplineTag = portfolio?.education?.[0]?.qualification || profile.headline.split('·')[0]?.trim();

  return (
    <section aria-label="Introduction" className="relative min-h-[85vh] pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden flex flex-col justify-center">
      {/* 3D Interactive WebGL Vanta Background */}
      <VantaHeroBackground />

      <div className="container-x relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div>
          {/* Top Status & Accreditation Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {profile.open_to_work && (
              <span className="chip border-emerald-500/35 bg-emerald-500/15 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <span className="pulse-dot bg-emerald-400" /> Available for Opportunities
              </span>
            )}
            {profile.location && (
              <span className="chip border-white/[0.08] bg-white/[0.03] text-muted">
                <MapPin size={14} className="text-emerald-400" /> {profile.location}
              </span>
            )}
            {disciplineTag && (
              <span className="chip border-white/[0.08] bg-white/[0.03] text-muted hidden sm:inline-flex">
                <Sprout size={14} className="text-emerald-400" />
                {disciplineTag}
              </span>
            )}
          </div>

          {/* Grand Name Display */}
          <h1 className="mt-8 font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] font-bold tracking-tight">
            <span className="text-fg">{first}</span>{' '}
            <span className="text-gradient">{rest.join(' ')}</span>
          </h1>

          {/* Dynamic Headline with React Bits BlurText */}
          {profile.headline && (
            <div className="mt-6 max-w-xl text-lg text-pretty text-muted sm:text-2xl font-normal leading-relaxed">
              <BlurText text={profile.headline} delay={25} />
            </div>
          )}

          {/* Tagline Quotation */}
          {profile.tagline && (
            <p className="mt-6 max-w-xl border-l-2 border-emerald-500/60 pl-4 font-mono text-sm leading-relaxed text-emerald-300/90 italic">
              “{profile.tagline}”
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {primaryHref && (
              <a href={primaryHref} className="btn btn-primary group">
                Explore Projects & Research{' '}
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

          {/* Social Channels */}
          <div className="mt-10 flex items-center gap-3">
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
            {profile.email && (
              <span className="font-mono text-xs text-subtle pl-2">
                {profile.email}
              </span>
            )}
          </div>
        </div>

        {/* Ethereal Floating Portrait / Bio Vessel */}
        <PortraitFrame profile={profile} />
      </div>

      {/* Spacious Stats Display */}
      {stats.length > 0 && (
        <div className="container-x relative z-10 mt-14 sm:mt-18">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bp-card bp-card-hover group p-6 sm:p-7 text-center cursor-default"
              >
                <dt className="font-mono text-xs tracking-wider text-emerald-400/90 uppercase transition-colors group-hover:text-emerald-300">
                  {stat.label}
                </dt>
                <dd className="mt-2.5 font-display text-4xl sm:text-5xl font-bold text-fg transition-all duration-300 group-hover:text-emerald-300">
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

/** Ethereal frosted glass portrait vessel with organic ambient glow. */
function PortraitFrame({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:justify-self-end animate-float">
      {/* Radiant ambient aura */}
      <div
        className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-emerald-500/25 via-emerald-400/10 to-amber-500/10 blur-2xl rounded-[3rem] opacity-70"
        aria-hidden="true"
      />

      <div className="relative aspect-square p-3 rounded-[2.5rem] border border-white/[0.12] bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent backdrop-blur-2xl shadow-[0_30px_90px_-20px_rgba(16,185,129,0.3)]">
        <div className="relative size-full overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-ink-950/90">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={`Photo of ${profile.full_name}`}
              fill
              priority
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-cover"
            />
          ) : (
            <BlueprintArt label={initials(profile.full_name)} animate className="size-full p-8 text-emerald-400" />
          )}
        </div>
      </div>

      <div className="absolute -bottom-4 left-8 rounded-full border border-emerald-500/35 bg-ink-900/95 px-4 py-1.5 font-mono text-xs tracking-wider text-emerald-300 uppercase shadow-xl backdrop-blur-md flex items-center gap-2">
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{profile.full_name}</span>
      </div>
    </div>
  );
}
