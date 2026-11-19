import type { SectionKey, SectionSetting } from './types';

/** Short names used in the navigation and the admin. */
export const SECTION_LABELS: Record<SectionKey, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  education: 'Education',
  leadership: 'Leadership',
  contact: 'Contact',
};

/** Default section headings and intros; each can be overridden from Admin → Sections. */
export const SECTION_DEFAULTS: Record<SectionKey, { title: string; intro: string }> = {
  about: { title: 'About & Vision', intro: 'Cultivating sustainable agricultural solutions through science, technology, and field practice.' },
  experience: { title: 'Fieldwork & Practical Experience', intro: 'Hands-on training across agronomic trials, soil laboratories, and rural agricultural ecosystems.' },
  projects: { title: 'Agronomic Research & Projects', intro: 'Applied field studies, soil health diagnostics, and precision farming initiatives.' },
  skills: { title: 'Agricultural Competencies & Tools', intro: 'Core proficiencies across soil science, crop management, farm surveying, and agrotechnology.' },
  certifications: { title: 'Credentials & Certifications', intro: 'Recognitions from the FAO and NPTEL in natural resources and agribusiness.' },
  education: { title: 'Academic Background', intro: 'Formal education in agricultural sciences and natural science foundations.' },
  leadership: { title: 'Leadership & Extracurriculars', intro: 'Student engagement, rural agricultural outreach, and community teamwork.' },
  contact: {
    title: 'Connect with Veda',
    intro: 'Open to agricultural research collaborations, internships, and agritech opportunities. Send a message below.',
  },
};

export const SECTION_KEYS = Object.keys(SECTION_LABELS) as SectionKey[];

/** Keeps known sections in the saved order and appends any section added in a later version. */
export function normalizeSections(raw: unknown): SectionSetting[] {
  const saved = Array.isArray(raw) ? (raw as Partial<SectionSetting>[]) : [];
  const seen = new Set<string>();
  const sections: SectionSetting[] = [];
  for (const item of saved) {
    if (!item?.key || !SECTION_KEYS.includes(item.key) || seen.has(item.key)) continue;
    seen.add(item.key);
    sections.push({
      key: item.key,
      visible: item.visible !== false,
      title: typeof item.title === 'string' ? item.title : '',
      intro: typeof item.intro === 'string' ? item.intro : '',
    });
  }
  for (const key of SECTION_KEYS) if (!seen.has(key)) sections.push({ key, visible: true });
  return sections;
}

export function sectionTitle(section: SectionSetting): string {
  return section.title?.trim() || SECTION_DEFAULTS[section.key].title;
}

export function sectionIntro(section: SectionSetting): string {
  return section.intro?.trim() || SECTION_DEFAULTS[section.key].intro;
}

/** Absolute base URL of the site, for the sitemap, robots.txt and share previews. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}
