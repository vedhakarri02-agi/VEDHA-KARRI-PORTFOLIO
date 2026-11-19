'use client';

import { ArrowLeft, CircleAlert, CircleCheck, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import { SetupNotice } from './ui';

export function LoginForm({ forbidden }: { forbidden: boolean }) {
  const supabase = getBrowserSupabase();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'reset'>('signin');
  const [error, setError] = useState<string | null>(forbidden ? 'That account doesn’t have admin access.' : null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in as the admin? Skip straight to the dashboard.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (isAdmin) router.replace('/admin');
    });
  }, [supabase, router]);

  if (!supabase) return <SetupNotice />;

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase!.auth.signInWithPassword({
      email: String(form.get('email') ?? '').trim(),
      password: String(form.get('password') ?? ''),
    });

    if (signInError) {
      setSubmitting(false);
      setError(
        signInError.message.toLowerCase().includes('fetch')
          ? 'Can’t reach the database. Check your Supabase URL and internet connection.'
          : 'Incorrect email or password.',
      );
      return;
    }

    const { data: isAdmin } = await supabase!.rpc('is_admin');
    if (!isAdmin) {
      await supabase!.auth.signOut();
      setSubmitting(false);
      setError('That account doesn’t have admin access.');
      return;
    }
    router.replace('/admin');
  }

  async function sendReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim();
    setSubmitting(true);
    setError(null);
    const { error: resetError } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/account?reset=1`,
    });
    setSubmitting(false);
    if (resetError) return setError(resetError.message);
    setNotice('If that email belongs to the admin account, a reset link is on its way. Check your inbox.');
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="blueprint-bg" aria-hidden="true" />
      <div className="bp-card w-full max-w-sm p-7 sm:p-8">
        <span className="grid size-12 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent-soft">
          <Lock size={22} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">{mode === 'signin' ? 'Admin sign in' : 'Reset password'}</h1>
        <p className="mt-1 text-sm text-muted">
          {mode === 'signin' ? 'Edit your portfolio. Changes go live instantly.' : 'We’ll email you a link to choose a new password.'}
        </p>

        <form className="mt-7 grid gap-4" onSubmit={mode === 'signin' ? signIn : sendReset}>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input id="email" name="email" type="email" className="input" autoComplete="username" required />
          </div>
          {mode === 'signin' && (
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-accent-soft hover:text-accent-glow"
                  onClick={() => {
                    setMode('reset');
                    setError(null);
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
            </div>
          )}

          {error && (
            <div className="alert alert-error" role="alert">
              <CircleAlert size={18} />
              <span>{error}</span>
            </div>
          )}
          {notice && mode === 'reset' && (
            <div className="alert alert-success" role="status">
              <CircleCheck size={18} />
              <span>{notice}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={17} className="spin" /> {mode === 'signin' ? 'Signing in…' : 'Sending…'}
              </>
            ) : mode === 'signin' ? (
              'Sign in'
            ) : (
              'Send reset link'
            )}
          </button>
          {mode === 'reset' ? (
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={() => {
                setMode('signin');
                setNotice(null);
                setError(null);
              }}
            >
              <ArrowLeft size={16} /> Back to sign in
            </button>
          ) : (
            <Link href="/" className="btn btn-ghost w-full">
              <ArrowLeft size={16} /> Back to the site
            </Link>
          )}
        </form>
      </div>
    </main>
  );
}
