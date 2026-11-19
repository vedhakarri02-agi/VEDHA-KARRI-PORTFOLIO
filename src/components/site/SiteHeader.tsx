'use client';

import { Download, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type NavLink = { href: string; label: string };

type Props = {
  name?: string;
  monogram?: string;
  links: NavLink[];
  resumeUrl: string;
};

export function SiteHeader({ name, monogram, links, resumeUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? 'border-b border-emerald-500/20 bg-ink-950/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <nav aria-label="Main" className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl lg:flex shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-muted/90 transition-all duration-200 hover:bg-emerald-500/15 hover:text-emerald-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener" className="btn btn-outline btn-sm hidden sm:inline-flex hover:border-emerald-500/40 hover:text-emerald-300">
              <Download size={14} /> CV
            </a>
          )}
          <a href="#contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Get in Touch
          </a>
          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="btn btn-ghost btn-icon lg:hidden text-fg"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="container-x border-t border-emerald-500/20 bg-ink-950/95 py-5 backdrop-blur-2xl lg:hidden"
        >
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base text-muted hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {resumeUrl && (
              <li className="pt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline w-full justify-start"
                >
                  <Download size={16} /> Download Curriculum Vitae
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
