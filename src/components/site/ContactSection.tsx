import { Mail, MapPin, Phone } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { ContactForm } from './ContactForm';
import { GitHubIcon, LinkedInIcon } from './icons';

export function ContactSection({ profile }: { profile: Profile }) {
  const channels = [
    profile.email && { icon: <Mail size={20} />, label: 'Email Inquiry', value: profile.email, href: `mailto:${profile.email}` },
    profile.linkedin_url && {
      icon: <LinkedInIcon size={20} />,
      label: 'LinkedIn Network',
      value: profile.linkedin_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      href: profile.linkedin_url,
    },
    profile.github_url && {
      icon: <GitHubIcon size={20} />,
      label: 'GitHub Profile',
      value: profile.github_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      href: profile.github_url,
    },
    profile.show_phone && profile.phone && { icon: <Phone size={20} />, label: 'Direct Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    profile.location && { icon: <MapPin size={20} />, label: 'Geographic Base', value: profile.location, href: '' },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string }[];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16 items-start">
      <ul className="grid grid-cols-1 content-start gap-4">
        {channels.map((channel) => {
          const body = (
            <>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                {channel.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] tracking-wider text-emerald-400 uppercase font-semibold transition-colors group-hover:text-emerald-300">
                  {channel.label}
                </span>
                <span className="block truncate text-base font-medium text-fg/90 transition-colors group-hover:text-emerald-300 mt-0.5">
                  {channel.value}
                </span>
              </span>
            </>
          );
          return (
            <li key={channel.label}>
              {channel.href ? (
                <a
                  href={channel.href}
                  target={channel.href.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href.startsWith('http') ? 'noopener' : undefined}
                  className="bp-card bp-card-hover group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-white/[0.01]"
                >
                  {body}
                </a>
              ) : (
                <div className="bp-card group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-white/[0.01]">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="bp-card p-8 sm:p-10 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl">
        <ContactForm fallbackEmail={profile.email} />
      </div>
    </div>
  );
}
