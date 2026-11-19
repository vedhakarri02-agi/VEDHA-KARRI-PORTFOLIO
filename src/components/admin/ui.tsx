import { CircleAlert, Loader2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

/** Title row at the top of every admin page. */
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}

/** Loading spinner or error message for admin data; renders nothing once data is ready. */
export function QueryStatus({ loading, error, onRetry }: { loading: boolean; error?: string; onRetry: () => void }) {
  if (error) {
    return (
      <div className="alert alert-error items-center" role="alert">
        <CircleAlert size={18} />
        <span className="flex-1">Couldn’t load data: {error}</span>
        <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="grid place-items-center py-16 text-muted" aria-busy="true">
        <Loader2 size={28} className="spin" />
      </div>
    );
  }
  return null;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-ink-900/70 ${className}`}>{children}</div>;
}

/** Shown in the admin area until Supabase environment variables are configured. */
export function SetupNotice() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <Card className="max-w-lg p-8">
        <TriangleAlert size={32} className="text-warning" />
        <h1 className="mt-4 font-display text-2xl font-semibold">Connect your database</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The admin dashboard needs Supabase. Add <code className="text-accent-glow">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="text-accent-glow">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code className="text-accent-glow">.env.local</code>, run{' '}
          <code className="text-accent-glow">supabase/setup_all.sql</code> in the Supabase SQL editor, then restart the dev server. README.md has the
          step-by-step setup.
        </p>
        <Link href="/" className="btn btn-outline mt-6">
          Back to the site
        </Link>
      </Card>
    </div>
  );
}
