'use client';

import { ArrowDown, ArrowUp, ChevronDown, Loader2, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { fetchSettings, saveSections } from '@/lib/admin-api';
import { SECTION_DEFAULTS, SECTION_LABELS } from '@/lib/site';
import type { SectionSetting } from '@/lib/types';
import { useAdmin, useAdminQuery, useUnsavedChanges } from './AdminContext';
import { useToast } from './Toast';
import { PageHeader, QueryStatus } from './ui';

export function SectionsEditor() {
  const { data, error, loading, reload } = useAdminQuery(fetchSettings);
  return (
    <>
      <PageHeader
        title="Sections"
        description="Choose which homepage sections appear, their order, and optionally rename their headings. The hero is always first."
      />
      <QueryStatus loading={loading} error={error} onRetry={reload} />
      {data && <SectionsForm key={JSON.stringify(data.sections)} initial={data.sections} />}
    </>
  );
}

function SectionsForm({ initial }: { initial: SectionSetting[] }) {
  const { supabase } = useAdmin();
  const toast = useToast();
  const [sections, setSections] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(sections) !== JSON.stringify(baseline), [sections, baseline]);
  useUnsavedChanges(dirty);

  const update = (index: number, patch: Partial<SectionSetting>) => setSections((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  const move = (index: number, delta: number) =>
    setSections((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item!);
      return next;
    });

  const save = async () => {
    setSaving(true);
    try {
      const cleaned = sections.map((s) => ({ ...s, title: s.title?.trim() ?? '', intro: s.intro?.trim() ?? '' }));
      await saveSections(supabase, cleaned);
      setSections(cleaned);
      setBaseline(cleaned);
      toast.success('Sections saved. The site has been updated.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t save sections.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      <ol className="grid gap-2">
        {sections.map((section, i) => {
          const expanded = open === section.key;
          return (
            <li key={section.key} className={`rounded-xl border border-line bg-ink-900/70 ${section.visible ? '' : 'opacity-70'}`}>
              <div className="flex items-center gap-3 p-2.5 pr-3">
                <div className="flex flex-col">
                  <button type="button" className="btn btn-ghost btn-icon size-7" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${SECTION_LABELS[section.key]} up`}>
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon size-7"
                    disabled={i === sections.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label={`Move ${SECTION_LABELS[section.key]} down`}
                  >
                    <ArrowDown size={15} />
                  </button>
                </div>
                <span className="w-7 font-mono text-xs text-subtle">{String(i + 1).padStart(2, '0')}</span>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => setOpen(expanded ? null : section.key)}
                  aria-expanded={expanded}
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{SECTION_LABELS[section.key]}</span>
                    <span className="block truncate text-sm text-muted">{section.title?.trim() || SECTION_DEFAULTS[section.key].title}</span>
                  </span>
                  <ChevronDown size={16} className={`ml-auto shrink-0 text-subtle transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-muted">
                  <span className="hidden sm:inline">{section.visible ? 'Shown' : 'Hidden'}</span>
                  <input
                    type="checkbox"
                    className="switch"
                    checked={section.visible}
                    onChange={(e) => update(i, { visible: e.target.checked })}
                    aria-label={`Show ${SECTION_LABELS[section.key]} section`}
                  />
                </label>
              </div>
              {expanded && (
                <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor={`title-${section.key}`}>
                      Heading
                    </label>
                    <input
                      id={`title-${section.key}`}
                      className="input"
                      maxLength={80}
                      placeholder={SECTION_DEFAULTS[section.key].title}
                      value={section.title ?? ''}
                      onChange={(e) => update(i, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor={`intro-${section.key}`}>
                      Intro line
                    </label>
                    <input
                      id={`intro-${section.key}`}
                      className="input"
                      maxLength={200}
                      placeholder={SECTION_DEFAULTS[section.key].intro || 'Optional'}
                      value={section.intro ?? ''}
                      onChange={(e) => update(i, { intro: e.target.value })}
                    />
                  </div>
                  <p className="help sm:col-span-2">Leave empty to use the default shown in grey.</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex justify-end gap-2">
        {dirty && (
          <button type="button" className="btn btn-ghost" onClick={() => setSections(baseline)} disabled={saving}>
            Discard
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={save} disabled={!dirty || saving}>
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save sections
        </button>
      </div>
    </div>
  );
}
