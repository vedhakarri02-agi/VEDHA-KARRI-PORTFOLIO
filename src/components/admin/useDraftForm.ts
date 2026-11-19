'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { removeMediaList, uploadMedia } from '@/lib/admin-api';
import { mediaUrlsOf, type Draft, type FieldConfig } from '@/lib/collections';
import { useAdmin, useUnsavedChanges } from './AdminContext';
import type { UploadFn } from './FormFields';

/**
 * Form state for an admin editor: the draft, validation errors, "unsaved changes"
 * tracking, and bookkeeping for uploads so replaced or abandoned files get deleted
 * from Storage instead of piling up.
 */
export function useDraftForm(fields: FieldConfig[], initial: Draft) {
  const { supabase } = useAdmin();
  const [draft, setDraft] = useState<Draft>(initial);
  const [baseline, setBaseline] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const uploads = useRef(new Set<string>());

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(baseline), [draft, baseline]);
  useUnsavedChanges(dirty);

  const setField = useCallback((name: string, value: unknown) => {
    setDraft((d) => ({ ...d, [name]: value }));
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });
  }, []);

  const upload: UploadFn = useCallback(
    async (file, media) => {
      const url = await uploadMedia(supabase, file, media.folder, media.kind);
      uploads.current.add(url);
      return url;
    },
    [supabase],
  );

  /** Cancel: delete files uploaded in this session that the saved record doesn't use. */
  const discard = useCallback(async () => {
    const keep = mediaUrlsOf(fields, baseline);
    const orphans = [...uploads.current].filter((url) => !keep.has(url));
    uploads.current.clear();
    setDraft(baseline);
    setErrors({});
    await removeMediaList(supabase, orphans);
  }, [fields, baseline, supabase]);

  /** After a successful save: adopt the saved record and delete files it no longer points to. */
  const commit = useCallback(
    async (saved: Draft) => {
      const keep = mediaUrlsOf(fields, saved);
      const stale = [...mediaUrlsOf(fields, baseline), ...uploads.current].filter((url) => !keep.has(url));
      uploads.current.clear();
      setBaseline(saved);
      setDraft(saved);
      await removeMediaList(supabase, new Set(stale));
    },
    [fields, baseline, supabase],
  );

  return { draft, setField, errors, setErrors, dirty, upload, discard, commit };
}
