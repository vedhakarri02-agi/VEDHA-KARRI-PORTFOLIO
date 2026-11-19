'use client';

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Loader2,
  Palette,
  Plus,
  Save,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { fetchSettings, saveSections } from '@/lib/admin-api';
import { SECTION_DEFAULTS, sectionLabel, THEMES, extractThemeColor } from '@/lib/site';
import type { SectionSetting, ThemeColor } from '@/lib/types';
import { useAdmin, useAdminQuery, useUnsavedChanges } from './AdminContext';
import { useToast } from './Toast';
import { PageHeader, QueryStatus } from './ui';

const DOSSIER_FIELDS = [
  { key: 'candidate', label: 'Candidate Full Name' },
  { key: 'discipline', label: 'Discipline / Degree' },
  { key: 'institution', label: 'Institution / Board' },
  { key: 'academic_standing', label: 'Academic Standing / GPA' },
  { key: 'geographic_base', label: 'Geographic Location' },
  { key: 'availability', label: 'Availability Status' },
  { key: 'cv_download', label: 'Curriculum Vitae (CV) Download' },
  { key: 'pillars', label: 'Core Competence Pillars' },
];

export function SectionsEditor() {
  const { data, error, loading, reload } = useAdminQuery(fetchSettings);
  return (
    <>
      <QueryStatus loading={loading} error={error} onRetry={reload} />
      {data && <SectionsForm key={JSON.stringify(data.sections)} initial={data.sections} />}
    </>
  );
}

export function SectionsForm({ initial }: { initial: SectionSetting[] }) {
  const { supabase } = useAdmin();
  const toast = useToast();
  const [sections, setSections] = useState<SectionSetting[]>(initial);
  const [baseline, setBaseline] = useState<SectionSetting[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(() => extractThemeColor(initial));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newIntro, setNewIntro] = useState('');

  const dirty = useMemo(() => JSON.stringify(sections) !== JSON.stringify(baseline), [sections, baseline]);
  useUnsavedChanges(dirty);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = currentTheme;
      try {
        localStorage.setItem('portfolio-theme', currentTheme);
      } catch {}
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId: ThemeColor) => {
    setCurrentTheme(themeId);
    setSections((list) => {
      const updated = list.map((s, idx) => (idx === 0 ? { ...s, theme: themeId } : s));
      const hasThemeItem = updated.some((s) => s.key === '__theme');
      if (hasThemeItem) {
        return updated.map((s) => (s.key === '__theme' ? { ...s, title: themeId } : s));
      }
      return [{ key: '__theme', title: themeId, visible: false }, ...updated];
    });
  };

  const update = (index: number, patch: Partial<SectionSetting>) =>
    setSections((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const move = (index: number, delta: number) =>
    setSections((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item!);
      return next;
    });

  const removeSection = (index: number) => {
    const target = sections[index];
    if (!target) return;
    if (!window.confirm(`Are you sure you want to remove the "${sectionLabel(target.key)}" section?`)) return;
    setSections((list) => list.filter((_, i) => i !== index));
    if (open === target.key) setOpen(null);
  };

  const addCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = (newKey || newTitle)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    if (!cleanKey) return;

    if (sections.some((s) => s.key === cleanKey)) {
      toast.error(`A section with key "${cleanKey}" already exists.`);
      return;
    }

    const newSection: SectionSetting = {
      key: cleanKey,
      visible: true,
      title: newTitle.trim() || sectionLabel(cleanKey),
      intro: newIntro.trim(),
      items: [],
    };

    setSections((list) => [...list, newSection]);
    setOpen(cleanKey);
    setShowAddModal(false);
    setNewTitle('');
    setNewKey('');
    setNewIntro('');
    toast.success(`Added "${newSection.title}" module. You can now add items and toggle visibility.`);
  };

  const save = async () => {
    setSaving(true);
    try {
      const cleaned = sections.map((s, idx) => ({
        ...s,
        title: s.title?.trim() ?? '',
        intro: s.intro?.trim() ?? '',
        theme: idx === 0 ? currentTheme : s.theme,
        items: s.items ?? [],
        fields_visibility: s.fields_visibility ?? {},
        custom_pillars: s.custom_pillars ?? [],
      }));
      await saveSections(supabase, cleaned);
      setSections(cleaned);
      setBaseline(cleaned);
      toast.success('Sections & modules saved. The live site has been updated.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t save sections.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Sections & Modules"
        description="Choose which homepage sections appear, select your portfolio color atmosphere, add custom modules, and toggle field visibility."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setShowAddModal(true);
                setNewTitle('');
                setNewKey('');
                setNewIntro('');
              }}
            >
              <Plus size={16} /> Add Module / Section
            </button>
          </div>
        }
      />

      {/* Portfolio Color Atmosphere Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-ink-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-soft">
              <Palette size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-fg">Portfolio Color Atmosphere</h3>
              <p className="text-xs text-muted">Select the primary radiant color palette and lighting for your entire portfolio.</p>
            </div>
          </div>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs font-semibold text-accent-glow capitalize">
            {THEMES.find((t) => t.id === currentTheme)?.label}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleThemeChange(theme.id)}
                className={`group flex flex-col items-center gap-2.5 rounded-xl border p-3.5 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'border-line bg-ink-950/60 hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div
                  className="size-7 rounded-full border-2 border-white/20 transition-transform group-hover:scale-110 flex items-center justify-center shadow-sm"
                  style={{ background: theme.accent, boxShadow: `0 0 12px ${theme.glow}80` }}
                >
                  {isSelected && <Check size={14} className="text-white drop-shadow" />}
                </div>
                <div>
                  <p className="font-medium text-xs text-fg">{theme.label.split('&')[0].trim()}</p>
                  <p className="text-[10px] text-subtle leading-tight mt-0.5">{theme.desc.split('&')[0]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add New Section Modal / Dialog */}
      {showAddModal && (
        <div className="rounded-2xl border border-emerald-500/30 bg-ink-900/95 p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div>
              <h3 className="font-display text-lg font-semibold text-fg">Add New Module / Section</h3>
              <p className="text-xs text-muted mt-0.5">
                Create a custom module (e.g. Achievements, Publications, Awards, Fieldwork Highlights).
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-icon size-8"
              onClick={() => setShowAddModal(false)}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={addCustomSection} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs" htmlFor="module-title">
                Module Title
              </label>
              <input
                id="module-title"
                className="input"
                placeholder="e.g. Achievements & Honors"
                required
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (!newKey) {
                    setNewKey(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]/g, '-')
                    );
                  }
                }}
              />
            </div>
            <div>
              <label className="label text-xs" htmlFor="module-key">
                System Identifier (Slug)
              </label>
              <input
                id="module-key"
                className="input"
                placeholder="e.g. achievements"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label text-xs" htmlFor="module-intro">
                Intro line (Optional)
              </label>
              <input
                id="module-intro"
                className="input"
                placeholder="e.g. Competitive agritech awards, academic milestones, and fieldwork recognition."
                value={newIntro}
                onChange={(e) => setNewIntro(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-xs">
                <Plus size={14} /> Create Module
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ordered List of Modules */}
      <ol className="grid gap-3">
        {sections.map((section, i) => {
          const expanded = open === section.key;
          const isCustom = !['about', 'experience', 'projects', 'skills', 'certifications', 'education', 'leadership', 'contact'].includes(section.key);

          return (
            <li
              key={section.key}
              className={`rounded-2xl border transition-all ${
                expanded
                  ? 'border-emerald-500/40 bg-ink-900/90 shadow-xl'
                  : section.visible
                    ? 'border-line bg-ink-900/70 hover:border-emerald-500/25'
                    : 'border-line/40 bg-ink-950/40 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3 p-3 pr-4">
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon size-7 text-muted hover:text-fg"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    aria-label={`Move ${sectionLabel(section.key)} up`}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon size-7 text-muted hover:text-fg"
                    disabled={i === sections.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label={`Move ${sectionLabel(section.key)} down`}
                  >
                    <ArrowDown size={14} />
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
                    <span className="flex items-center gap-2 font-medium text-fg">
                      {sectionLabel(section.key)}
                      {section.key === 'achievements' && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                          Milestones
                        </span>
                      )}
                      {isCustom && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                          Custom
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-muted mt-0.5">
                      {section.title?.trim() || SECTION_DEFAULTS[section.key]?.title || 'Module'} —{' '}
                      {section.intro?.trim() || SECTION_DEFAULTS[section.key]?.intro || 'No intro line'}
                    </span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`ml-auto shrink-0 text-subtle transition-transform ${expanded ? 'rotate-180 text-emerald-400' : ''}`}
                  />
                </button>

                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                    <span className={`font-mono text-[11px] ${section.visible ? 'text-emerald-400' : 'text-subtle'}`}>
                      {section.visible ? 'Visible' : 'Hidden'}
                    </span>
                    <input
                      type="checkbox"
                      className="switch"
                      checked={section.visible}
                      onChange={(e) => update(i, { visible: e.target.checked })}
                      aria-label={`Show ${sectionLabel(section.key)} section`}
                    />
                  </label>

                  {isCustom && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon size-7 text-danger/80 hover:text-danger hover:bg-danger/10"
                      onClick={() => removeSection(i)}
                      title="Delete module"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {expanded && (
                <div className="border-t border-line/70 p-5 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label text-xs" htmlFor={`title-${section.key}`}>
                        Section Heading
                      </label>
                      <input
                        id={`title-${section.key}`}
                        className="input"
                        maxLength={80}
                        placeholder={SECTION_DEFAULTS[section.key]?.title || sectionLabel(section.key)}
                        value={section.title ?? ''}
                        onChange={(e) => update(i, { title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label text-xs" htmlFor={`intro-${section.key}`}>
                        Intro line
                      </label>
                      <input
                        id={`intro-${section.key}`}
                        className="input"
                        maxLength={200}
                        placeholder={SECTION_DEFAULTS[section.key]?.intro || 'Optional introductory text'}
                        value={section.intro ?? ''}
                        onChange={(e) => update(i, { intro: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* SPECIAL FOR ABOUT SECTION: Field Visibility & Manual Pillars */}
                  {section.key === 'about' && (
                    <div className="space-y-6 pt-4 border-t border-line/50">
                      {/* Dossier Field Visibility */}
                      <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:p-5">
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                          <div>
                            <h4 className="font-display text-sm font-semibold text-fg">Researcher Dossier Field Visibility</h4>
                            <p className="text-xs text-subtle mt-0.5">Turn on or off any specific field displayed in the About dossier card.</p>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400">Live on / off</span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {DOSSIER_FIELDS.map((field) => {
                            const isVisible = (section.fields_visibility ?? {})[field.key] !== false;
                            return (
                              <label
                                key={field.key}
                                className="flex items-center justify-between rounded-xl bg-white/[0.025] border border-white/[0.06] p-3 text-xs text-muted hover:text-fg hover:border-emerald-500/30 transition-colors cursor-pointer"
                              >
                                <span className="font-medium">{field.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono text-[10px] ${isVisible ? 'text-emerald-400' : 'text-subtle'}`}>
                                    {isVisible ? 'On' : 'Off'}
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="switch"
                                    checked={isVisible}
                                    onChange={(e) => {
                                      const current = { ...(section.fields_visibility ?? {}) };
                                      current[field.key] = e.target.checked;
                                      update(i, { fields_visibility: current });
                                    }}
                                  />
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Manual Highlights / Competence Pillars */}
                      <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
                          <div>
                            <h4 className="font-display text-sm font-semibold text-fg">Manual Highlights & Competence Pillars</h4>
                            <p className="text-xs text-subtle mt-0.5">
                              Add custom milestone cards or pillars manually (leave empty to automatically compute from your Skills).
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm text-xs"
                            onClick={() => {
                              const current = [...(section.custom_pillars ?? [])];
                              current.push({
                                id: 'pil-' + Date.now(),
                                title: '',
                                subtitle: '',
                                description: '',
                                visible: true,
                              });
                              update(i, { custom_pillars: current });
                            }}
                          >
                            <Plus size={14} /> Add Highlight
                          </button>
                        </div>

                        <div className="mt-4 space-y-3">
                          {(!section.custom_pillars || section.custom_pillars.length === 0) && (
                            <p className="text-xs text-subtle italic py-2">
                              No manual pillars defined — currently displaying dynamic skills categories as pillars. Click &quot;Add Highlight&quot; to override manually.
                            </p>
                          )}
                          {(section.custom_pillars ?? []).map((pil, pilIdx) => (
                            <div key={pil.id || pilIdx} className="rounded-xl border border-line bg-ink-900/60 p-3.5 space-y-2.5 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  className="input input-sm flex-1 font-medium"
                                  placeholder="Pillar title (e.g. Soil Science & Testing)"
                                  value={pil.title}
                                  onChange={(e) => {
                                    const current = [...(section.custom_pillars ?? [])];
                                    current[pilIdx] = { ...current[pilIdx], title: e.target.value };
                                    update(i, { custom_pillars: current });
                                  }}
                                />
                                <label className="flex items-center gap-1.5 shrink-0 text-muted">
                                  <span className={`text-[11px] font-mono ${pil.visible ? 'text-emerald-400' : 'text-subtle'}`}>
                                    {pil.visible ? 'Visible' : 'Hidden'}
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="switch"
                                    checked={pil.visible}
                                    onChange={(e) => {
                                      const current = [...(section.custom_pillars ?? [])];
                                      current[pilIdx] = { ...current[pilIdx], visible: e.target.checked };
                                      update(i, { custom_pillars: current });
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon size-7 text-danger hover:bg-danger/10"
                                  onClick={() => {
                                    const current = (section.custom_pillars ?? []).filter((_, idx) => idx !== pilIdx);
                                    update(i, { custom_pillars: current });
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <input
                                className="input input-sm w-full text-muted"
                                placeholder="Description (e.g. Physicochemical evaluation, pH, EC & balanced NPK prescription)"
                                value={pil.description || pil.subtitle || ''}
                                onChange={(e) => {
                                  const current = [...(section.custom_pillars ?? [])];
                                  current[pilIdx] = { ...current[pilIdx], description: e.target.value };
                                  update(i, { custom_pillars: current });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FOR ACHIEVEMENTS & CUSTOM MODULES: Items Manager with Visibility Toggles */}
                  {(section.key === 'achievements' || isCustom) && (
                    <div className="space-y-4 pt-4 border-t border-line/50">
                      <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
                          <div>
                            <h4 className="font-display text-sm font-semibold text-fg flex items-center gap-2">
                              <Trophy size={16} className="text-amber-400" />
                              {section.key === 'achievements' ? 'Achievements & Honors List' : `${sectionLabel(section.key)} Items`}
                            </h4>
                            <p className="text-xs text-subtle mt-0.5">
                              Add items manually and toggle the visibility on or off for each one.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm text-xs"
                            onClick={() => {
                              const current = [...(section.items ?? [])];
                              current.push({
                                id: 'item-' + Date.now(),
                                title: '',
                                subtitle: '',
                                date: '',
                                description: '',
                                link: '',
                                visible: true,
                              });
                              update(i, { items: current });
                            }}
                          >
                            <Plus size={14} /> Add Item
                          </button>
                        </div>

                        <div className="mt-4 space-y-3">
                          {(!section.items || section.items.length === 0) && (
                            <p className="text-xs text-subtle italic py-3 text-center">
                              No items added yet. Click &quot;Add Item&quot; to add your first milestone or achievement.
                            </p>
                          )}
                          {(section.items ?? []).map((item, itemIdx) => (
                            <div key={item.id || itemIdx} className="rounded-xl border border-line bg-ink-900/60 p-4 space-y-3 text-xs">
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-mono text-xs text-emerald-400 font-semibold">#{itemIdx + 1}</span>
                                <div className="flex items-center gap-3 ml-auto">
                                  <label className="flex items-center gap-2 shrink-0 text-muted cursor-pointer">
                                    <span className={`text-[11px] font-mono ${item.visible ? 'text-emerald-400' : 'text-subtle'}`}>
                                      {item.visible ? 'Visible' : 'Hidden'}
                                    </span>
                                    <input
                                      type="checkbox"
                                      className="switch"
                                      checked={item.visible}
                                      onChange={(e) => {
                                        const current = [...(section.items ?? [])];
                                        current[itemIdx] = { ...current[itemIdx], visible: e.target.checked };
                                        update(i, { items: current });
                                      }}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-icon size-7 text-danger hover:bg-danger/10"
                                    onClick={() => {
                                      const current = (section.items ?? []).filter((_, idx) => idx !== itemIdx);
                                      update(i, { items: current });
                                    }}
                                    title="Delete item"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="label text-[11px]">Title</label>
                                  <input
                                    className="input input-sm font-medium"
                                    placeholder="Achievement or award title"
                                    value={item.title}
                                    onChange={(e) => {
                                      const current = [...(section.items ?? [])];
                                      current[itemIdx] = { ...current[itemIdx], title: e.target.value };
                                      update(i, { items: current });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="label text-[11px]">Organization / Issuer</label>
                                  <input
                                    className="input input-sm"
                                    placeholder="e.g. ICAR, Centurion University, FAO"
                                    value={item.subtitle ?? ''}
                                    onChange={(e) => {
                                      const current = [...(section.items ?? [])];
                                      current[itemIdx] = { ...current[itemIdx], subtitle: e.target.value };
                                      update(i, { items: current });
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="label text-[11px]">Date / Year</label>
                                  <input
                                    className="input input-sm"
                                    placeholder="e.g. 2025 or Jan 2026"
                                    value={item.date ?? ''}
                                    onChange={(e) => {
                                      const current = [...(section.items ?? [])];
                                      current[itemIdx] = { ...current[itemIdx], date: e.target.value };
                                      update(i, { items: current });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="label text-[11px]">Verification Link (Optional)</label>
                                  <input
                                    className="input input-sm"
                                    placeholder="https://..."
                                    value={item.link ?? ''}
                                    onChange={(e) => {
                                      const current = [...(section.items ?? [])];
                                      current[itemIdx] = { ...current[itemIdx], link: e.target.value };
                                      update(i, { items: current });
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="label text-[11px]">Description</label>
                                <textarea
                                  className="input input-sm h-16 resize-y"
                                  placeholder="Brief summary of the achievement, competition results, or impact..."
                                  value={item.description ?? ''}
                                  onChange={(e) => {
                                    const current = [...(section.items ?? [])];
                                    current[itemIdx] = { ...current[itemIdx], description: e.target.value };
                                    update(i, { items: current });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-6 z-20 flex justify-end gap-3 rounded-2xl border border-line bg-ink-950/80 p-4 backdrop-blur-xl shadow-2xl">
        {dirty && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setSections(baseline)}
            disabled={saving}
          >
            Discard Changes
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={save}
          disabled={!dirty || saving}
        >
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save Sections & Modules
        </button>
      </div>
    </div>
  );
}
