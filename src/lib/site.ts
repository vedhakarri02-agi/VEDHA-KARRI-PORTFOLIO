import type { SectionKey, SectionSetting } from './types';

/** Short names used in the navigation and the admin. */
export const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  achievements: 'Achievements',
  education: 'Education',
  leadership: 'Leadership',
  contact: 'Contact',
};

/** Default section headings and intros; each can be overridden from Admin → Sections. */
export const SECTION_DEFAULTS: Record<string, { title: string; intro: string }> = {
  about: { title: 'About & Vision', intro: 'Cultivating sustainable agricultural solutions through science, technology, and field practice.' },
  experience: { title: 'Fieldwork & Practical Experience', intro: 'Hands-on training across agronomic trials, soil laboratories, and rural agricultural ecosystems.' },
  projects: { title: 'Agronomic Research & Projects', intro: 'Applied field studies, soil health diagnostics, and precision farming initiatives.' },
  skills: { title: 'Agricultural Competencies & Tools', intro: 'Core proficiencies across soil science, crop management, farm surveying, and agrotechnology.' },
  certifications: { title: 'Credentials & Certifications', intro: 'Recognitions from the FAO and NPTEL in natural resources and agribusiness.' },
  achievements: { title: 'Honors & Key Achievements', intro: 'Academic milestones, agritech recognitions, and competitive fieldwork awards.' },
  education: { title: 'Academic Background', intro: 'Formal education in agricultural sciences and natural science foundations.' },
  leadership: { title: 'Leadership & Extracurriculars', intro: 'Student engagement, rural agricultural outreach, and community teamwork.' },
  contact: {
    title: 'Connect with Veda',
    intro: 'Open to agricultural research collaborations, internships, and agritech opportunities. Send a message below.',
  },
};

export const STANDARD_SECTION_KEYS: SectionKey[] = [
  'about',
  'experience',
  'projects',
  'skills',
  'certifications',
  'education',
  'leadership',
  'achievements',
  'contact',
];

export const SECTION_KEYS = STANDARD_SECTION_KEYS;

export function sectionLabel(key: string): string {
  if (SECTION_LABELS[key]) return SECTION_LABELS[key];
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/[-_]/g, ' ');
}

/** Keeps known and custom sections in the saved order and preserves custom items & field visibilities. */
export function normalizeSections(raw: unknown): SectionSetting[] {
  const saved = Array.isArray(raw) ? (raw as Partial<SectionSetting>[]) : [];
  const seen = new Set<string>();
  const sections: SectionSetting[] = [];
  for (const item of saved) {
    if (!item?.key || seen.has(item.key)) continue;
    seen.add(item.key);
    sections.push({
      key: item.key,
      visible: item.visible !== false,
      title: typeof item.title === 'string' ? item.title : '',
      intro: typeof item.intro === 'string' ? item.intro : '',
      items: Array.isArray(item.items) ? item.items : undefined,
      fields_visibility: item.fields_visibility && typeof item.fields_visibility === 'object' ? item.fields_visibility : undefined,
      custom_pillars: Array.isArray(item.custom_pillars) ? item.custom_pillars : undefined,
    });
  }
  // Append any standard sections that weren't present in saved config
  for (const key of STANDARD_SECTION_KEYS) {
    if (!seen.has(key)) {
      sections.push({
        key,
        visible: key === 'achievements' ? false : true, // achievements is opt-in or ready to turn on
      });
    }
  }
  return sections;
}

export function sectionTitle(section: SectionSetting): string {
  return section.title?.trim() || SECTION_DEFAULTS[section.key]?.title || sectionLabel(section.key);
}

export function sectionIntro(section: SectionSetting): string {
  return section.intro?.trim() || SECTION_DEFAULTS[section.key]?.intro || '';
}

/** Absolute base URL of the site, for the sitemap, robots.txt and share previews. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}
