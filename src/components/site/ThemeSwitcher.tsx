'use client';

import { Check, Palette, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { THEMES } from '@/lib/site';
import type { ThemeColor } from '@/lib/types';

export function ThemeSwitcher({ initialTheme = 'emerald' }: { initialTheme?: ThemeColor }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(initialTheme);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') as ThemeColor;
      if (saved && THEMES.some((t) => t.id === saved)) {
        setCurrentTheme(saved);
        document.documentElement.dataset.theme = saved;
      } else if (initialTheme) {
        document.documentElement.dataset.theme = initialTheme;
      }
    } catch {
      // Ignore localStorage security exceptions
    }
  }, [initialTheme]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectTheme = (themeId: ThemeColor) => {
    setCurrentTheme(themeId);
    document.documentElement.dataset.theme = themeId;
    try {
      localStorage.setItem('portfolio-theme', themeId);
    } catch {
      // Ignore
    }
    setIsOpen(false);
  };

  const activeThemeMeta = THEMES.find((t) => t.id === currentTheme) ?? THEMES[0];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-3 w-72 rounded-2xl border border-white/[0.12] bg-ink-950/95 p-4 backdrop-blur-2xl shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 font-display text-sm font-semibold text-fg">
              <Sparkles size={16} className="text-accent" />
              <span>Palette & Lighting</span>
            </div>
            <button
              type="button"
              className="text-muted hover:text-fg p-1 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-3 grid gap-1.5">
            {THEMES.map((theme) => {
              const active = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => selectTheme(theme.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs text-left transition-all ${
                    active
                      ? 'bg-white/[0.08] text-fg font-medium shadow-inner'
                      : 'text-muted hover:bg-white/[0.04] hover:text-fg'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-4 rounded-full border border-white/20 shadow-sm"
                      style={{ background: theme.accent, boxShadow: `0 0 10px ${theme.glow}80` }}
                    />
                    <div>
                      <p className="font-medium">{theme.label}</p>
                      <p className="text-[10px] text-subtle leading-tight">{theme.desc}</p>
                    </div>
                  </div>
                  {active && <Check size={14} className="text-accent shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2 rounded-full border border-white/[0.12] bg-ink-900/90 px-3.5 py-2.5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-[0_0_24px_rgba(16,185,129,0.3)]"
        aria-label="Choose portfolio color theme"
        title="Customize portfolio color theme"
      >
        <span
          className="size-3 rounded-full transition-transform duration-300 group-hover:scale-125"
          style={{ background: activeThemeMeta.accent, boxShadow: `0 0 10px ${activeThemeMeta.glow}` }}
        />
        <Palette size={16} className="text-muted group-hover:text-fg transition-colors" />
        <span className="font-mono text-xs text-fg/90 font-medium hidden sm:inline">
          {activeThemeMeta.label.split('&')[0].trim()}
        </span>
      </button>
    </div>
  );
}
