'use client';

import { CircleAlert, KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useToast } from './Toast';
import { Card, PageHeader } from './ui';

export function AccountForm({ fromReset }: { fromReset: boolean }) {
  const { supabase, email } = useAdmin();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 10) return setError('Use at least 10 characters.');
    if (password !== confirm) return setError('The two passwords don’t match.');
    setError(null);
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) return setError(updateError.message);
    setPassword('');
    setConfirm('');
    toast.success('Password changed.');
  };

  return (
    <>
      <PageHeader title="Account" description="Only this account can sign in to the admin." />

      {fromReset && (
        <div className="alert alert-success mb-6" role="status">
          <KeyRound size={18} />
          <span>You’re signed in from a password-reset link. Choose a new password below.</span>
        </div>
      )}

      <Card className="p-5 sm:p-7">
        <p className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">Signed in as</p>
        <p className="mt-1 font-medium">{email}</p>

        <form onSubmit={save} className="mt-8 grid max-w-md gap-5" noValidate>
          <h2 className="font-display text-lg font-semibold">Change password</h2>
          <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />
          <div>
            <label className="label" htmlFor="new-password">
              New password
            </label>
            <input id="new-password" type="password" className="input" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="help">At least 10 characters. A short sentence is easy to remember and hard to guess.</p>
          </div>
          <div>
            <label className="label" htmlFor="confirm-password">
              Confirm new password
            </label>
            <input id="confirm-password" type="password" className="input" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && (
            <div className="alert alert-error" role="alert">
              <CircleAlert size={18} />
              <span>{error}</span>
            </div>
          )}
          <div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />} Update password
            </button>
          </div>
        </form>

        <div className="mt-10 border-t border-line pt-6">
          <h2 className="font-display text-lg font-semibold">Sign out everywhere</h2>
          <p className="mt-1 text-sm text-muted">Signs this account out on every device, e.g. after using a shared computer.</p>
          <button type="button" className="btn btn-outline mt-4" onClick={() => supabase.auth.signOut({ scope: 'global' })}>
            Sign out of all devices
          </button>
        </div>
      </Card>
    </>
  );
}
