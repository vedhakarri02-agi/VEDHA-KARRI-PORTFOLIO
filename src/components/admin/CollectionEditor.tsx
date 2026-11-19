'use client';

import type { SupabaseClient } from '@supabase/supabase-js';
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteRow, insertRow, listRows, removeMediaList, saveOrder, setRowVisible, updateRow } from '@/lib/admin-api';
import { cleanDraft, COLLECTIONS, mediaUrlsOf, validateFields, type CollectionConfig, type CollectionKey, type Draft } from '@/lib/collections';
import type { RowBase } from '@/lib/types';
import { useAdmin, useAdminQuery } from './AdminContext';
import { FormGrid } from './FormFields';
import { useToast } from './Toast';
import { PageHeader, QueryStatus } from './ui';
import { useDraftForm } from './useDraftForm';

type Row = RowBase & Draft;

// Module-level loader so useAdminQuery gets a stable function.
const loadCollection = (supabase: SupabaseClient, key: CollectionKey) => {
  const config = COLLECTIONS[key];
  return listRows<Row>(supabase, config.table, config.filter);
};

/** List + editor for one content collection, driven entirely by its field settings. */
export function CollectionEditor({ collection }: { collection: CollectionKey }) {
  const config = COLLECTIONS[collection];
  const { supabase } = useAdmin();
  const toast = useToast();
  const { data: rows, error, loading, reload, setData } = useAdminQuery(loadCollection, collection);
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const move = async (index: number, delta: number) => {
    if (!rows) return;
    const next = [...rows];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item!);
    setData(() => next);
    try {
      const saved = await saveOrder(supabase, config.table, next);
      setData(() => saved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t save the new order.');
      reload();
    }
  };

  const toggleVisible = async (row: Row) => {
    setBusyId(row.id);
    try {
      await setRowVisible(supabase, config.table, row.id, !row.is_visible);
      setData((list) => list.map((r) => (r.id === row.id ? { ...r, is_visible: !row.is_visible } : r)));
      toast.success(row.is_visible ? 'Hidden from the site.' : 'Now visible on the site.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t update visibility.');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row: Row) => {
    const { title } = config.summary(row);
    if (!window.confirm(`Delete “${title}”? This can’t be undone.`)) return;
    setBusyId(row.id);
    try {
      await deleteRow(supabase, config.table, row.id);
      await removeMediaList(supabase, mediaUrlsOf(config.fields, row));
      setData((list) => list.filter((r) => r.id !== row.id));
      toast.success(`Deleted “${title}”.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t delete.');
    } finally {
      setBusyId(null);
    }
  };

  const onSaved = (saved: Row, isNew: boolean) => {
    setData((list) => (isNew ? [...list, saved] : list.map((r) => (r.id === saved.id ? saved : r))));
    setEditing(null);
    toast.success(isNew ? `Added “${config.summary(saved).title}”. It’s live on the site.` : 'Saved. Your changes are live.');
  };

  return (
    <>
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
            <Plus size={17} /> Add {config.singular}
          </button>
        }
      />

      <QueryStatus loading={loading && !rows} error={error} onRetry={reload} />

      {rows && rows.length === 0 && (
        <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted">Add your first {config.singular} and it will appear on the site straight away.</p>
          <button type="button" className="btn btn-outline mt-5" onClick={() => setEditing('new')}>
            <Plus size={16} /> Add {config.singular}
          </button>
        </div>
      )}

      {rows && rows.length > 0 && (
        <ul className="grid gap-2">
          {rows.map((row, i) => {
            const summary = config.summary(row);
            const busy = busyId === row.id;
            return (
              <li
                key={row.id}
                className={`flex items-center gap-3 rounded-xl border border-line bg-ink-900/70 p-2.5 pr-3 transition-colors hover:border-line-strong ${
                  row.is_visible ? '' : 'opacity-60'
                }`}
              >
                <div className="flex flex-col">
                  <button type="button" className="btn btn-ghost btn-icon size-7" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${summary.title} up`}>
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon size-7"
                    disabled={i === rows.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label={`Move ${summary.title} down`}
                  >
                    <ArrowDown size={15} />
                  </button>
                </div>

                {summary.image && (
                  <span className="relative hidden size-11 shrink-0 overflow-hidden rounded-lg border border-line bg-ink-950 sm:block">
                    <Image src={summary.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                )}

                <button type="button" onClick={() => setEditing(row)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate font-medium">{summary.title || 'Untitled'}</span>
                  <span className="block truncate text-sm text-muted">
                    {[summary.subtitle, summary.meta].filter(Boolean).join(' · ')}
                  </span>
                </button>

                {!row.is_visible && (
                  <span className="hidden rounded-full border border-line px-2 py-0.5 font-mono text-[10px] tracking-widest text-subtle uppercase sm:inline">
                    Hidden
                  </span>
                )}

                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    disabled={busy}
                    onClick={() => toggleVisible(row)}
                    aria-label={row.is_visible ? `Hide ${summary.title}` : `Show ${summary.title}`}
                    title={row.is_visible ? 'Hide from site' : 'Show on site'}
                  >
                    {busy ? <Loader2 size={16} className="spin" /> : row.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditing(row)} aria-label={`Edit ${summary.title}`} title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon hover:text-danger"
                    disabled={busy}
                    onClick={() => remove(row)}
                    aria-label={`Delete ${summary.title}`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <EditorDrawer
          key={editing === 'new' ? 'new' : editing.id}
          config={config}
          row={editing === 'new' ? null : editing}
          nextSortOrder={((rows ?? []).reduce((max, r) => Math.max(max, r.sort_order), 0) || 0) + 10}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </>
  );
}

function EditorDrawer({
  config,
  row,
  nextSortOrder,
  onClose,
  onSaved,
}: {
  config: CollectionConfig;
  row: Row | null;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: (row: Row, isNew: boolean) => void;
}) {
  const { supabase } = useAdmin();
  const toast = useToast();
  const initial: Draft = row ?? { ...config.defaults, is_visible: true };
  const { draft, setField, errors, setErrors, dirty, upload, discard, commit } = useDraftForm(config.fields, initial);
  const [saving, setSaving] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const title = row ? `Edit ${config.singular}` : `Add ${config.singular}`;

  const requestClose = useCallback(async () => {
    if (dirty && !window.confirm('Discard your unsaved changes?')) return;
    await discard();
    onClose();
  }, [dirty, discard, onClose]);

  // Escape closes; the page behind doesn't scroll while the drawer is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && requestClose();
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [requestClose]);

  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>('input:not([type=checkbox]), textarea, select')?.focus();
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const fieldErrors = { ...validateFields(config.fields, draft), ...(config.validate?.(draft) ?? {}) };
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const prepared = config.prepare ? config.prepare(draft) : draft;
    const record: Draft = { ...cleanDraft(config.fields, prepared), is_visible: draft.is_visible !== false };
    if (config.filter) record[config.filter.column] = config.filter.value;

    setSaving(true);
    try {
      const saved = row
        ? await updateRow<Row>(supabase, config.table, row.id, record)
        : await insertRow<Row>(supabase, config.table, { ...record, sort_order: nextSortOrder });
      await commit(saved);
      onSaved(saved, !row);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t save.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={requestClose} aria-hidden="true" />
      <div ref={panelRef} className="animate-in relative flex h-full w-full max-w-2xl flex-col border-l border-line bg-ink-900 shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">{config.title}</p>
            <h2 id="drawer-title" className="font-display text-xl font-semibold">
              {title}
            </h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={requestClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <form id="drawer-form" onSubmit={save} className="flex-1 overflow-y-auto px-5 py-6 sm:px-7" noValidate>
          <FormGrid fields={config.fields} draft={draft} errors={errors} setField={setField} onUpload={upload} />
        </form>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-7">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
            <input type="checkbox" className="switch" checked={draft.is_visible !== false} onChange={(e) => setField('is_visible', e.target.checked)} />
            Visible on site
          </label>
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={requestClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="drawer-form" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={17} className="spin" /> Saving…
                </>
              ) : row ? (
                'Save changes'
              ) : (
                `Add ${config.singular}`
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
