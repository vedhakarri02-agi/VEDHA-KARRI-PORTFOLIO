import { Mail, MapPin, Phone } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { ContactForm } from './ContactForm';
import { GitHubIcon, LinkedInIcon } from './icons';

export function ContactSection({ profile }: { profile: Profile }) {
  const channels = [
    profile.email && { icon: <Mail size={18} />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile.linkedin_url && {
      icon: <LinkedInIcon />,
      label: 'LinkedIn',
      value: profile.linkedin_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      href: profile.linkedin_url,
    },
    profile.github_url && {
      icon: <GitHubIcon />,
      label: 'GitHub',
      value: profile.github_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      href: profile.github_url,
    },
    profile.show_phone && profile.phone && { icon: <Phone size={18} />, label: 'Direct Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    profile.location && { icon: <MapPin size={18} />, label: 'Current Base', value: profile.location, href: '' },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string }[];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
      <ul className="grid grid-cols-1 content-start gap-3">
        {channels.map((channel) => {
          const body = (
            <>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {channel.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.18em] text-emerald-400/80 uppercase transition-colors group-hover:text-emerald-300">{channel.label}</span>
                <span className="block truncate text-[15px] font-medium text-fg/90 transition-colors group-hover:text-emerald-300">{channel.value}</span>
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
                  className="bp-card bp-card-hover group flex items-center gap-4 p-4 border-emerald-500/20 bg-ink-900/70"
                >
                  {body}
                </a>
              ) : (
                <div className="bp-card group flex items-center gap-4 p-4 border-emerald-500/20 bg-ink-900/70">{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="bp-card p-6 sm:p-8 border-emerald-500/20 bg-ink-900/70">
        <ContactForm fallbackEmail={profile.email} />
      </div>
    </div>
  );
}
