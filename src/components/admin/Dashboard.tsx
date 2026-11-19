'use client';

import { ArrowRight, CheckCircle2, Circle, Database, ExternalLink, Inbox, Loader2, Radio } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { loadDashboard, loadStarterContent, type DashboardData } from '@/lib/admin-api';
import { useAdmin, useAdminQuery } from './AdminContext';
import { useToast } from './Toast';
import { Card, PageHeader, QueryStatus } from './ui';

const SECTIONS: { key: keyof DashboardData['counts']; label: string; href: string }[] = [
  { key: 'internships', label: 'Internships', href: '/admin/experience' },
  { key: 'projects', label: 'Projects', href: '/admin/projects' },
  { key: 'skills', label: 'Skills', href: '/admin/skills' },
  { key: 'certifications', label: 'Certifications', href: '/admin/certifications' },
  { key: 'education', label: 'Education', href: '/admin/education' },
  { key: 'leadership', label: 'Leadership', href: '/admin/leadership' },
];

export function Dashboard() {
  const { data, error, loading, reload } = useAdminQuery(loadDashboard);
  // Offer the starter content until the lists have something in them — saving the
  // profile first must not hide the button and leave the site nearly blank.
  const needsStarter = data && (!data.profile || Object.values(data.counts).every((c) => c.total === 0));

  return (
    <>
      <QueryStatus loading={loading && !data} error={error} onRetry={reload} />
      {needsStarter && <StarterContent onLoaded={reload} hasProfile={Boolean(data.profile)} />}
      {data?.profile && !needsStarter && <Overview data={data} />}
    </>
  );
}

function StarterContent({ onLoaded, hasProfile }: { onLoaded: () => void; hasProfile: boolean }) {
  const { supabase } = useAdmin();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (hasProfile && !window.confirm('This fills every section with the résumé content and replaces what’s currently saved in Profile. Continue?')) {
      return;
    }
    setBusy(true);
    try {
      await loadStarterContent(supabase);
      toast.success('Starter content loaded — your site is live.');
      onLoaded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t load the starter content.');
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Welcome 👋"
        description={hasProfile ? 'Your profile is saved, but the other sections are still empty.' : 'Your database is connected but empty.'}
      />
      <Card className="p-6 sm:p-8">
        <Database size={28} className="text-accent-soft" />
        <h2 className="mt-4 font-display text-xl font-semibold">Load your starter content</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          This copies your résumé and LinkedIn details — internships, projects, skills, certifications, education and campus roles — into the
          database. After that, everything on the site is edited from this dashboard and updates live.
        </p>
        <button type="button" className="btn btn-primary mt-6" onClick={load} disabled={busy}>
          {busy ? <Loader2 size={16} className="spin" /> : <Database size={16} />} Load starter content
        </button>
      </Card>
    </>
  );
}

function Overview({ data }: { data: DashboardData }) {
  const profile = data.profile!;
  const firstName = profile.full_name.split(/\s+/)[0] || 'there';
  const checklist = [
    { done: Boolean(profile.avatar_url), label: 'Upload a profile photo', href: '/admin/profile' },
    { done: Boolean(profile.resume_url), label: 'Upload your résumé PDF', href: '/admin/profile' },
    {
      done: data.internshipsWithoutBullets === 0,
      label:
        data.internshipsWithoutBullets === 0
          ? 'Every internship has a description'
          : `Describe ${data.internshipsWithoutBullets} internship${data.internshipsWithoutBullets > 1 ? 's' : ''} (what you did, with numbers)`,
      href: '/admin/experience',
    },
    {
      done: data.projectsWithoutCover === 0 && data.counts.projects.total > 0,
      label:
        data.counts.projects.total === 0
          ? 'Add your first project'
          : data.projectsWithoutCover === 0
            ? 'Every project has a cover image'
            : `Add cover images to ${data.projectsWithoutCover} project${data.projectsWithoutCover > 1 ? 's' : ''} (field photos or diagrams work great)`,
      href: '/admin/projects',
    },
  ];
  const remaining = checklist.filter((c) => !c.done).length;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Everything you save here appears on the live site within a second — no redeploy needed."
        action={
          <a href="/" target="_blank" rel="noopener" className="btn btn-outline">
            <ExternalLink size={16} /> View live site
          </a>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ key, label, href }) => {
          const count = data.counts[key];
          return (
            <Link key={key} href={href} className="group rounded-2xl border border-line bg-ink-900/70 p-5 transition-colors hover:border-accent/40">
              <p className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">{label}</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold">{count.total}</span>
                {count.hidden > 0 && <span className="text-xs text-subtle">{count.hidden} hidden</span>}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-accent-soft group-hover:text-accent-glow">
                Manage <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Profile checklist</h2>
            <span className="font-mono text-xs text-subtle">{remaining === 0 ? 'All done' : `${remaining} to go`}</span>
          </div>
          <ul className="mt-4 grid gap-1">
            {checklist.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5">
                  {item.done ? <CheckCircle2 size={18} className="shrink-0 text-accent-soft" /> : <Circle size={18} className="shrink-0 text-subtle" />}
                  <span className={item.done ? 'text-muted line-through decoration-subtle' : 'text-fg/90'}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4">
          <Link href="/admin/messages" className="group rounded-2xl border border-line bg-ink-900/70 p-5 transition-colors hover:border-accent/40">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-soft">
                <Inbox size={18} />
              </span>
              <div>
                <p className="font-medium">Messages</p>
                <p className="text-sm text-muted">{data.unreadMessages === 0 ? 'No unread messages' : `${data.unreadMessages} unread`}</p>
              </div>
            </div>
          </Link>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Radio size={18} className="mt-0.5 shrink-0 text-accent-soft" />
              <p className="text-sm leading-relaxed text-muted">
                <span className="text-fg">Live editing is on.</span> Open your site in another tab (or turn on the live preview in the sidebar on a wide
                screen) and watch it update as you save.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
