'use client';

import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { fetchProfile, saveProfile } from '@/lib/admin-api';
import { cleanDraft, EMPTY_PROFILE, PROFILE_FIELDS, PROFILE_GROUPS, validateFields, type Draft } from '@/lib/collections';
import type { Profile } from '@/lib/types';
import { useAdmin, useAdminQuery } from './AdminContext';
import { FormGrid } from './FormFields';
import { useToast } from './Toast';
import { Card, PageHeader, QueryStatus } from './ui';
import { useDraftForm } from './useDraftForm';

export function ProfileEditor() {
  const { data, error, loading, reload } = useAdminQuery(fetchProfile);

  return (
    <>
      <PageHeader title="Profile" description="Your name, headline, photo, about text, contact details and résumé." />
      <QueryStatus loading={loading} error={error} onRetry={reload} />
      {!loading && !error && <ProfileForm initial={(data ?? { id: 1, ...EMPTY_PROFILE }) as Profile} />}
    </>
  );
}

function ProfileForm({ initial }: { initial: Profile }) {
  const { supabase } = useAdmin();
  const toast = useToast();
  const { draft, setField, errors, setErrors, dirty, upload, discard, commit } = useDraftForm(PROFILE_FIELDS, initial as unknown as Draft);
  const [saving, setSaving] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const fieldErrors = validateFields(PROFILE_FIELDS, draft);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setSaving(true);
    try {
      const saved = await saveProfile(supabase, cleanDraft(PROFILE_FIELDS, draft) as Omit<Profile, 'id'>);
      await commit(saved as unknown as Draft);
      toast.success('Profile saved. Your changes are live.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t save the profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} noValidate className="grid gap-6 pb-24">
      {PROFILE_GROUPS.map((group) => (
        <Card key={group.title} className="p-5 sm:p-7">
          <h2 className="font-display text-lg font-semibold">{group.title}</h2>
          <p className="mt-1 mb-6 text-sm text-muted">{group.description}</p>
          <FormGrid fields={group.fields} draft={draft} errors={errors} setField={setField} onUpload={upload} />
        </Card>
      ))}

      {/* Sticky save bar appears as soon as something changes. */}
      <div
        className={`sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-2xl border border-line-strong bg-ink-800/95 px-5 py-3 shadow-2xl backdrop-blur transition-all ${
          dirty ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-hidden={!dirty}
      >
        <span className="text-sm text-muted">You have unsaved changes</span>
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => discard()} disabled={saving} tabIndex={dirty ? 0 : -1}>
            Discard
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving} tabIndex={dirty ? 0 : -1}>
            {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />} Save profile
          </button>
        </div>
      </div>
    </form>
  );
}
