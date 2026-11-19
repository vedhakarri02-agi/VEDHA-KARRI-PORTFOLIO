'use client';

import { Calendar, ExternalLink, Loader2, Plus, Save, Trash2, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { fetchSettings, saveSections } from '@/lib/admin-api';
import type { CustomModuleItem, SectionSetting } from '@/lib/types';
import { useAdmin, useAdminQuery, useUnsavedChanges } from './AdminContext';
import { useToast } from './Toast';
import { Card, PageHeader, QueryStatus } from './ui';

export function AchievementsEditor() {
  const { data, error, loading, reload } = useAdminQuery(fetchSettings);
  return (
    <>
      <QueryStatus loading={loading} error={error} onRetry={reload} />
      {data && <AchievementsForm key={JSON.stringify(data.sections)} allSections={data.sections} />}
    </>
  );
}

function AchievementsForm({ allSections }: { allSections: SectionSetting[] }) {
  const { supabase } = useAdmin();
  const toast = useToast();

  // Find existing achievements section or initialize with default
  const [sections, setSections] = useState<SectionSetting[]>(() => {
    const exists = allSections.some((s) => s.key === 'achievements');
    if (exists) return allSections;
    const newSection: SectionSetting = {
      key: 'achievements',
      visible: true,
      title: 'Honors & Key Achievements',
      intro: 'Academic milestones, agritech recognitions, and competitive fieldwork awards.',
      items: [
        {
          id: 'ach-1',
          title: 'ICAR Agri-Innovation Recognition',
          subtitle: 'Indian Council of Agricultural Research',
          date: '2025',
          description: 'Recognized for fieldwork trials on integrated nutrient management and balanced soil profile assessment.',
          link: '',
          visible: true,
        },
      ],
    };
    return [...allSections, newSection];
  });

  const [baseline, setBaseline] = useState<SectionSetting[]>(sections);
  const [saving, setSaving] = useState(false);

  const achievementIndex = sections.findIndex((s) => s.key === 'achievements');
  const achievementSection = sections[achievementIndex] ?? {
    key: 'achievements',
    visible: true,
    title: 'Honors & Key Achievements',
    intro: 'Academic milestones, agritech recognitions, and competitive fieldwork awards.',
    items: [],
  };

  const dirty = useMemo(() => JSON.stringify(sections) !== JSON.stringify(baseline), [sections, baseline]);
  useUnsavedChanges(dirty);

  const updateAchievementSection = (patch: Partial<SectionSetting>) => {
    setSections((list) => {
      const idx = list.findIndex((s) => s.key === 'achievements');
      if (idx === -1) {
        return [...list, { ...achievementSection, ...patch }];
      }
      return list.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    });
  };

  const addItem = () => {
    const current = [...(achievementSection.items ?? [])];
    current.push({
      id: 'item-' + Date.now(),
      title: '',
      subtitle: '',
      date: '',
      description: '',
      link: '',
      visible: true,
    });
    updateAchievementSection({ items: current });
  };

  const updateItem = (itemIdx: number, patch: Partial<CustomModuleItem>) => {
    const current = [...(achievementSection.items ?? [])];
    current[itemIdx] = { ...current[itemIdx], ...patch };
    updateAchievementSection({ items: current });
  };

  const removeItem = (itemIdx: number) => {
    const current = (achievementSection.items ?? []).filter((_, idx) => idx !== itemIdx);
    updateAchievementSection({ items: current });
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveSections(supabase, sections);
      setBaseline(sections);
      toast.success('Achievements saved. Your changes are live on the site.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t save achievements.');
    } finally {
      setSaving(false);
    }
  };

  const items = achievementSection.items ?? [];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Achievements & Honors"
        description="Add academic awards, hackathon/competition recognitions, and milestones. Toggle the visibility of the whole section or individual items anytime."
        action={
          <button type="button" className="btn btn-outline" onClick={addItem}>
            <Plus size={16} /> Add Achievement
          </button>
        }
      />

      {/* Main Section Controls Card */}
      <Card className="p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Trophy size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-fg">Homepage Visibility</h3>
              <p className="text-xs text-muted">Show or hide the Achievements section on your live portfolio.</p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className={`font-mono text-xs font-semibold ${achievementSection.visible ? 'text-emerald-400' : 'text-subtle'}`}>
              {achievementSection.visible ? 'Section Visible' : 'Section Hidden'}
            </span>
            <input
              type="checkbox"
              className="switch"
              checked={achievementSection.visible}
              onChange={(e) => updateAchievementSection({ visible: e.target.checked })}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs" htmlFor="section-heading">
              Section Heading
            </label>
            <input
              id="section-heading"
              className="input"
              value={achievementSection.title ?? ''}
              onChange={(e) => updateAchievementSection({ title: e.target.value })}
              placeholder="Honors & Key Achievements"
            />
          </div>
          <div>
            <label className="label text-xs" htmlFor="section-intro">
              Intro Description
            </label>
            <input
              id="section-intro"
              className="input"
              value={achievementSection.intro ?? ''}
              onChange={(e) => updateAchievementSection({ intro: e.target.value })}
              placeholder="Academic milestones, agritech recognitions, and competitive fieldwork awards."
            />
          </div>
        </div>
      </Card>

      {/* Achievement Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-fg">
            Honors & Achievements List ({items.length})
          </h3>
          <span className="text-xs font-mono text-subtle">
            {items.filter((it) => it.visible !== false).length} visible on site
          </span>
        </div>

        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy size={32} className="mx-auto text-subtle mb-3" />
            <h4 className="font-medium text-fg">No achievements added yet</h4>
            <p className="text-xs text-muted mt-1 max-w-md mx-auto">
              Add your academic prizes, competitive trial recognitions, scholarships, or certifications to highlight your excellence.
            </p>
            <button type="button" className="btn btn-primary btn-sm mt-4" onClick={addItem}>
              <Plus size={14} /> Add First Achievement
            </button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((item, idx) => (
              <Card
                key={item.id || idx}
                className={`p-5 sm:p-6 transition-all space-y-4 ${
                  item.visible !== false
                    ? 'border-line hover:border-emerald-500/30'
                    : 'border-line/40 bg-ink-950/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-emerald-400 font-semibold">#{idx + 1}</span>
                    <span className="font-medium text-fg text-sm">{item.title || 'Untitled Achievement'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-muted">
                      <span className={`font-mono text-[11px] ${item.visible !== false ? 'text-emerald-400' : 'text-subtle'}`}>
                        {item.visible !== false ? 'Shown' : 'Hidden'}
                      </span>
                      <input
                        type="checkbox"
                        className="switch"
                        checked={item.visible !== false}
                        onChange={(e) => updateItem(idx, { visible: e.target.checked })}
                      />
                    </label>

                    <button
                      type="button"
                      className="btn btn-ghost btn-icon size-8 text-danger hover:bg-danger/10"
                      onClick={() => removeItem(idx)}
                      title="Delete achievement"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label text-xs">Achievement Title</label>
                    <input
                      className="input font-medium"
                      placeholder="e.g. 1st Place — National Agri-Hackathon"
                      value={item.title}
                      onChange={(e) => updateItem(idx, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Organization / Issuer / Institution</label>
                    <input
                      className="input"
                      placeholder="e.g. Centurion University / ICAR"
                      value={item.subtitle ?? ''}
                      onChange={(e) => updateItem(idx, { subtitle: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label text-xs">Date / Year</label>
                    <input
                      className="input"
                      placeholder="e.g. 2025 or Dec 2025"
                      value={item.date ?? ''}
                      onChange={(e) => updateItem(idx, { date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Verification Link (Optional)</label>
                    <input
                      className="input"
                      placeholder="https://..."
                      value={item.link ?? ''}
                      onChange={(e) => updateItem(idx, { link: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-xs">Description</label>
                  <textarea
                    className="input h-20 resize-y"
                    placeholder="Describe the research, competition criteria, or agricultural impact of this achievement..."
                    value={item.description ?? ''}
                    onChange={(e) => updateItem(idx, { description: e.target.value })}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
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
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save Achievements
        </button>
      </div>
    </div>
  );
}
