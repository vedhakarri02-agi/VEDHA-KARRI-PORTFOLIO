'use client';

import { pad2 } from '@/lib/format';
import type { Profile } from '@/lib/types';
import {
  ArrowUp,
  Compass,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Sprout,
} from 'lucide-react';
import Link from 'next/link';
import { LinkedInIcon } from './icons';

type SiteFooterProps = {
  name: string;
  revision: number;
  profile?: Profile;
};

export function SiteFooter({ name, revision, profile }: SiteFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'About & Vision', href: '#about' },
    { label: 'Fieldwork Experience', href: '#experience' },
    { label: 'Agronomic Projects', href: '#projects' },
    { label: 'Agricultural Skills', href: '#skills' },
    { label: 'Certifications & FAO', href: '#certifications' },
    { label: 'Academic Background', href: '#education' },
    { label: 'Contact Veda', href: '#contact' },
  ];

  const focusAreas = [
    'Soil Health & NPK Diagnostics',
    'Sustainable Agroforestry (FAO)',
    'GIS & Satellite NDVI Mapping',
    'Seed Viability & Biopriming',
    'Integrated Pest Management (IPM)',
    'Watershed & Natural Resources',
  ];

  const email = profile?.email || 'vedhakarri25@gmail.com';
  const linkedin = profile?.linkedin_url || 'https://www.linkedin.com/in/vedha-karri';
  const location = profile?.location || 'Palasa, Andhra Pradesh, India';

  return (
    <footer className="relative border-t border-emerald-500/20 bg-gradient-to-b from-ink-950/90 to-ink-950 text-fg overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/[0.04] blur-3xl rounded-full"
        aria-hidden="true"
      />

      <div className="container-x relative pt-16 pb-12">
        {/* Top Highlight Banner: Identity + Back to top */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-12 border-b border-emerald-500/15">
          <div className="flex items-center gap-4">
            <div className="relative grid size-12 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <Sprout size={24} className="text-emerald-400 animate-float" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-display text-xl font-bold tracking-tight text-fg">
                  {name}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open to Agronomy Opportunities
                </span>
              </div>
              <p className="text-xs text-muted mt-1">
                B.Sc. (Hons) Agriculture · Centurion University of Technology and Management
              </p>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center gap-2 self-start md:self-auto rounded-full border border-emerald-500/25 bg-ink-900/80 px-4 py-2 text-xs font-mono text-emerald-300/90 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-200"
          >
            <span>Back to top</span>
            <ArrowUp
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </button>
        </div>

        {/* Multi-column Grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 border-b border-emerald-500/15">
          {/* Col 1: Scholar Bio & Location */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              <GraduationCap size={15} />
              About Scholar
            </h4>
            <p className="text-sm text-subtle leading-relaxed">
              Advancing sustainable farming through soil chemistry profiling, precision agronomy, and agroforestry transformation aligned with FAO standards.
            </p>
            <div className="space-y-2 text-xs text-muted pt-1">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-400/80 mt-0.5 shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Compass size={14} className="text-emerald-400/80 mt-0.5 shrink-0" />
                <span>CUTM Paralakhemundi, Odisha</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-emerald-300"
                  >
                    <span className="size-1 rounded-full bg-emerald-500/40 transition-all group-hover:w-2 group-hover:bg-emerald-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Focus & Research Areas */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              <Sparkles size={14} />
              Agronomy Focus
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              {focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-lg border border-emerald-500/10 bg-ink-900/40 px-2.5 py-1.5 transition-colors hover:border-emerald-500/25 hover:bg-emerald-500/5 hover:text-fg/90"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Direct Channels */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Direct Contact
            </h4>
            <p className="text-xs text-subtle">
              Open to research internships, fieldwork projects, and agricultural collaborations.
            </p>
            <div className="space-y-2.5 pt-1">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-ink-900/60 p-3 text-xs text-fg/90 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <div className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                  <Mail size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted uppercase font-mono tracking-wider">Email Inquiry</p>
                  <p className="truncate font-medium">{email}</p>
                </div>
              </a>

              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-ink-900/60 p-3 text-xs text-fg/90 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                  <div className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                    <LinkedInIcon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted uppercase font-mono tracking-wider">Professional Network</p>
                    <p className="truncate font-medium">LinkedIn Profile</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright Bar */}
        <div className="pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-medium text-fg/80">
              © 2026 d2w. All rights reserved.
            </span>
            <span className="hidden sm:inline text-emerald-500/30">|</span>
            <span className="text-[11px] text-muted">
              Designed & Developed for Veda Sri Karri · B.Sc. (Hons) Agriculture
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-400/80">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            <span>Registry v{pad2(revision)}.0</span>
            <span className="text-emerald-500/30">·</span>
            <span>Centurion Univ.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
