'use client';

import {
  Award,
  Briefcase,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  PanelRight,
  Rows3,
  UserRound,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { countUnread } from '@/lib/admin-api';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import { AdminContext } from './AdminContext';
import { PreviewPane } from './PreviewPane';
import { ToastProvider } from './Toast';
import { SetupNotice } from './ui';

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const NAV: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/profile', label: 'Profile', icon: UserRound },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/leadership', label: 'Leadership', icon: Users },
  { href: '/admin/sections', label: 'Sections', icon: Rows3 },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/account', label: 'Account', icon: KeyRound },
];

const PREVIEW_KEY = 'admin-preview';

/**
 * Guards every dashboard page: only signed-in users listed in the `admins` table get through.
 * Real protection is enforced by Row Level Security in the database — this just keeps the UI honest.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const supabase = getBrowserSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // The shell shows a spinner until the session is verified on the client, so reading
  // localStorage here can't cause a hydration mismatch.
  const [preview, setPreview] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem(PREVIEW_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [unread, setUnread] = useState(0);
  const unsavedRef = useRef(false);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    async function verify() {
      const {
        data: { session },
      } = await supabase!.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
        return;
      }
      const { data: isAdmin, error } = await supabase!.rpc('is_admin');
      if (!active) return;
      if (error || !isAdmin) {
        await supabase!.auth.signOut();
        router.replace('/admin/login?error=forbidden');
        return;
      }
      setEmail(session.user.email ?? 'Admin');
    }

    verify();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/admin/login');
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Unread-messages badge, kept live with Realtime.
  useEffect(() => {
    if (!supabase || !email) return;
    const refresh = () => countUnread(supabase).then(setUnread, () => undefined);
    refresh();
    const channel = supabase
      .channel('admin-unread')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, refresh)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, email]);

  const togglePreview = useCallback(() => {
    setPreview((open) => {
      try {
        localStorage.setItem(PREVIEW_KEY, open ? '0' : '1');
      } catch {
        // ignore
      }
      return !open;
    });
  }, []);

  const confirmLeave = useCallback((event: React.MouseEvent) => {
    if (unsavedRef.current && !window.confirm('You have unsaved changes. Leave this page and discard them?')) {
      event.preventDefault();
      return;
    }
    setMenuOpen(false);
  }, []);

  if (!supabase) return <SetupNotice />;

  if (!email) {
    return (
      <div className="grid min-h-dvh place-items-center text-muted" aria-busy="true">
        <Loader2 size={28} className="spin" />
      </div>
    );
  }

  const nav = (
    <nav aria-label="Admin" className="grid gap-0.5">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={confirmLeave}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active ? 'bg-accent/15 font-medium text-accent-glow' : 'text-muted hover:bg-white/5 hover:text-fg'
            }`}
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {href === '/admin/messages' && unread > 0 && (
              <span className="rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] leading-none text-white">{unread}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="grid gap-1 border-t border-line pt-4">
      <p className="truncate px-3 pb-2 text-xs text-subtle" title={email}>
        Signed in as <span className="text-muted">{email}</span>
      </p>
      <button
        type="button"
        onClick={togglePreview}
        className="hidden items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg xl:flex"
        aria-pressed={preview}
      >
        <PanelRight size={17} /> {preview ? 'Hide live preview' : 'Show live preview'}
      </button>
      <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg">
        <ExternalLink size={17} /> View site
      </a>
      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg"
      >
        <LogOut size={17} /> Sign out
      </button>
    </div>
  );

  const brand = (
    <Link href="/admin" onClick={confirmLeave} className="flex items-center gap-3 px-3">
      <span className="grid size-8 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-xs font-semibold text-accent-glow">BT</span>
      <span className="font-display font-semibold">
        Portfolio <span className="text-subtle">Admin</span>
      </span>
    </Link>
  );

  return (
    <AdminContext.Provider value={{ supabase, email, unsavedRef }}>
      <ToastProvider>
        <div className={`min-h-dvh lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] ${preview ? 'xl:grid-cols-[15rem_minmax(0,1fr)_26rem]' : ''}`}>
          <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto border-r border-line bg-ink-900 px-3 py-5 lg:flex">
            {brand}
            <div className="flex-1">{nav}</div>
            {footer}
          </aside>

          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-ink-900/90 px-3 backdrop-blur lg:hidden">
            {brand}
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </header>
          {menuOpen && (
            <div className="sticky top-14 z-30 grid max-h-[calc(100dvh-3.5rem)] gap-4 overflow-y-auto border-b border-line bg-ink-900 px-3 py-4 lg:hidden">
              {nav}
              {footer}
            </div>
          )}

          <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-4xl">{children}</div>
          </main>

          {preview && <PreviewPane onClose={togglePreview} />}
        </div>
      </ToastProvider>
    </AdminContext.Provider>
  );
}
