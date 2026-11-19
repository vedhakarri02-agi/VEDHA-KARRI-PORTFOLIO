import type { CollectionTable, MediaKind, RowFilter } from './admin-api';
import { formatDateRange, formatYears, slugify } from './format';
import type { Certification, Education, Experience, Profile, Project, RowBase, Skill } from './types';

// Field settings that drive the admin forms. One generic editor renders every list
// (internships, leadership, projects, skills, certifications, education) from these.

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'email'
  | 'number'
  | 'select'
  | 'toggle'
  | 'month'
  | 'month-or-present'
  | 'list'
  | 'tags'
  | 'links'
  | 'image'
  | 'gallery'
  | 'file';

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  maxLength?: number;
  rows?: number;
  min?: number;
  max?: number;
  /** For image/file/gallery uploads. */
  media?: { kind: MediaKind; folder: string };
  /** Spans both columns of the form grid. */
  wide?: boolean;
};

export type Draft = Record<string, unknown>;

export type RowSummary = { title: string; subtitle?: string; meta?: string; image?: string };

export type CollectionConfig = {
  key: CollectionKey;
  table: CollectionTable;
  filter?: RowFilter;
  title: string;
  singular: string;
  description: string;
  fields: FieldConfig[];
  defaults: Draft;
  summary: (row: Draft) => RowSummary;
  /** Extra checks beyond required/URL fields; returns field → message. */
  validate?: (draft: Draft) => Record<string, string>;
  /** Last-moment adjustments before saving (e.g. fill in a slug). */
  prepare?: (draft: Draft) => Draft;
};

export type CollectionKey = 'internships' | 'leadership' | 'projects' | 'skills' | 'certifications' | 'education';

const experienceFields = (kind: 'internship' | 'leadership'): FieldConfig[] => [
  { name: 'role', label: kind === 'internship' ? 'Role / title' : 'Role', type: 'text', required: true, maxLength: 120, placeholder: 'Field Agronomist & Soil Analyst' },
  { name: 'organization', label: 'Organisation', type: 'text', required: true, maxLength: 160, placeholder: 'Agronomy Research Station' },
  { name: 'start_date', label: 'Start month', type: 'month', required: true },
  { name: 'end_date', label: 'End month', type: 'month-or-present' },
  { name: 'location', label: 'Location', type: 'text', maxLength: 120, placeholder: 'Palasa, Andhra Pradesh' },
  { name: 'mode', label: 'Work mode', type: 'select', options: ['', 'On-site', 'Remote', 'Hybrid'] },
  {
    name: 'bullets',
    label: 'What you did',
    type: 'list',
    wide: true,
    help: 'One achievement per line. Start with a verb and add numbers where you can (e.g. “Analyzed 24 soil profile samples…”).',
  },
  ...(kind === 'internship'
    ? ([
        { name: 'skills', label: 'Skills used', type: 'tags', wide: true, help: 'Press Enter or comma after each skill.' },
        { name: 'org_url', label: 'Organisation website', type: 'url', placeholder: 'https://…' },
        { name: 'logo_url', label: 'Organisation logo', type: 'image', media: { kind: 'image', folder: 'logos' } },
      ] satisfies FieldConfig[])
    : []),
];

const experienceSummary = (row: Draft): RowSummary => {
  const exp = row as Experience;
  return {
    title: exp.role,
    subtitle: exp.organization,
    meta: exp.start_date ? formatDateRange(exp.start_date, exp.end_date) : '',
    image: exp.logo_url || undefined,
  };
};

const validateDates = (draft: Draft): Record<string, string> => {
  const start = String(draft.start_date ?? '');
  const end = draft.end_date ? String(draft.end_date) : '';
  return end && start && end < start ? { end_date: 'The end month can’t be before the start month.' } : {};
};

const experienceDefaults = (kind: 'internship' | 'leadership'): Draft => ({
  kind,
  role: '',
  organization: '',
  org_url: '',
  logo_url: '',
  location: '',
  mode: kind === 'internship' ? 'On-site' : '',
  start_date: '',
  end_date: null,
  bullets: [],
  skills: [],
});

export const COLLECTIONS: Record<CollectionKey, CollectionConfig> = {
  internships: {
    key: 'internships',
    table: 'experiences',
    filter: { column: 'kind', value: 'internship' },
    title: 'Experience',
    singular: 'internship',
    description: 'Internships and jobs, shown as a timeline in the order below.',
    fields: experienceFields('internship'),
    defaults: experienceDefaults('internship'),
    summary: experienceSummary,
    validate: validateDates,
  },
  leadership: {
    key: 'leadership',
    table: 'experiences',
    filter: { column: 'kind', value: 'leadership' },
    title: 'Leadership & activities',
    singular: 'role',
    description: 'Student council, clubs, NSS and other roles outside internships.',
    fields: experienceFields('leadership'),
    defaults: experienceDefaults('leadership'),
    summary: experienceSummary,
    validate: validateDates,
  },
  projects: {
    key: 'projects',
    table: 'projects',
    title: 'Projects',
    singular: 'project',
    description: 'Each project gets a card on the homepage and its own page.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 160, wide: true },
      { name: 'category', label: 'Category', type: 'text', maxLength: 120, placeholder: 'Agronomic Research · Soil Health' },
      { name: 'slug', label: 'URL slug', type: 'text', maxLength: 80, placeholder: 'soil-health-npk-profiling', help: 'Leave empty to create it from the title.' },
      { name: 'summary', label: 'Short summary', type: 'textarea', rows: 2, maxLength: 400, wide: true, help: 'Shown on the project card.' },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 8, maxLength: 10000, wide: true, help: 'Leave a blank line between paragraphs.' },
      { name: 'tools', label: 'Tools & skills', type: 'tags', wide: true, help: 'Press Enter or comma after each one.' },
      { name: 'cover_url', label: 'Cover image', type: 'image', media: { kind: 'image', folder: 'projects' }, help: 'A field photograph or research graphic, ideally 16:10.' },
      { name: 'featured', label: 'Featured project', type: 'toggle' },
      { name: 'gallery', label: 'Gallery', type: 'gallery', wide: true, media: { kind: 'image', folder: 'projects' }, help: 'Field photos, charts, data graphics — up to 5 MB each.' },
      { name: 'links', label: 'Links', type: 'links', wide: true, help: 'e.g. a research paper PDF, report, or presentation.' },
    ],
    defaults: { title: '', slug: '', category: '', summary: '', description: '', tools: [], cover_url: '', gallery: [], links: [], featured: false },
    summary: (row) => {
      const p = row as Project;
      return { title: p.title, subtitle: p.category, meta: p.featured ? 'Featured' : '', image: p.cover_url || undefined };
    },
    validate: (draft): Record<string, string> => {
      const slug = String(draft.slug ?? '').trim();
      return slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
        ? { slug: 'Use lowercase letters, numbers and single dashes only (e.g. study-lamp-design).' }
        : {};
    },
    prepare: (draft) => ({ ...draft, slug: String(draft.slug ?? '').trim() || slugify(String(draft.title ?? '')) }),
  },
  skills: {
    key: 'skills',
    table: 'skills',
    title: 'Skills',
    singular: 'skill',
    description: 'Skills are grouped by category on the site, in the order below.',
    fields: [
      { name: 'name', label: 'Skill', type: 'text', required: true, maxLength: 80, placeholder: 'Soil Testing & NPK Profiling' },
      { name: 'category', label: 'Category', type: 'text', required: true, maxLength: 60, placeholder: 'Soil & Nutrient Science' },
      {
        name: 'level',
        label: 'Proficiency (optional)',
        type: 'number',
        min: 0,
        max: 100,
        help: '0–100. Leave empty to show the skill as a simple tag.',
      },
    ],
    defaults: { name: '', category: '', level: null },
    summary: (row) => {
      const s = row as Skill;
      return { title: s.name, subtitle: s.category, meta: s.level !== null ? `${s.level}%` : '' };
    },
  },
  certifications: {
    key: 'certifications',
    table: 'certifications',
    title: 'Certifications',
    singular: 'certification',
    description: 'Certificates, courses and workshops.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 200, wide: true },
      { name: 'issuer', label: 'Issued by', type: 'text', maxLength: 160, placeholder: 'FAO eLearning Academy' },
      { name: 'issued_on', label: 'Date', type: 'text', maxLength: 40, placeholder: '2026 or Jan 2026' },
      { name: 'credential_url', label: 'Verification link', type: 'url', placeholder: 'https://…' },
      { name: 'file_url', label: 'Certificate file', type: 'file', media: { kind: 'image-or-pdf', folder: 'certificates' }, help: 'PDF or image.' },
    ],
    defaults: { title: '', issuer: '', issued_on: '', credential_url: '', file_url: '' },
    summary: (row) => {
      const c = row as Certification;
      return { title: c.title, subtitle: c.issuer, meta: c.issued_on };
    },
  },
  education: {
    key: 'education',
    table: 'education',
    title: 'Education',
    singular: 'qualification',
    description: 'Degrees and school qualifications. The first CGPA shown here also appears in the hero stats.',
    fields: [
      { name: 'qualification', label: 'Qualification', type: 'text', maxLength: 160, placeholder: 'B.Sc. (Hons.) Agriculture', wide: true },
      { name: 'institution', label: 'Institution / board', type: 'text', required: true, maxLength: 200, wide: true },
      { name: 'field', label: 'Field / stream', type: 'text', maxLength: 160, placeholder: 'Agricultural Sciences & Agronomy', wide: true },
      { name: 'start_year', label: 'Start year', type: 'number', min: 1950, max: 2100 },
      { name: 'end_year', label: 'End / passing year', type: 'number', min: 1950, max: 2100 },
      { name: 'score_label', label: 'Score label', type: 'text', maxLength: 40, placeholder: 'GPA' },
      { name: 'score', label: 'Score', type: 'text', maxLength: 40, placeholder: '8.03 / 10' },
    ],
    defaults: { institution: '', qualification: '', field: '', start_year: null, end_year: null, score_label: 'CGPA', score: '' },
    summary: (row) => {
      const e = row as Education;
      return {
        title: e.qualification || e.institution,
        subtitle: e.qualification ? e.institution : e.field,
        meta: [formatYears(e.start_year, e.end_year), e.score].filter(Boolean).join(' · '),
      };
    },
    validate: (draft): Record<string, string> =>
      draft.start_year && draft.end_year && Number(draft.end_year) < Number(draft.start_year)
        ? { end_year: 'The end year can’t be before the start year.' }
        : {},
  },
};

// ---------------------------------------------------------------------------
// Profile form (a single row, grouped into sections)
// ---------------------------------------------------------------------------

export const PROFILE_GROUPS: { title: string; description: string; fields: FieldConfig[] }[] = [
  {
    title: 'Hero',
    description: 'The first thing visitors see.',
    fields: [
      { name: 'full_name', label: 'Full name', type: 'text', required: true, maxLength: 120 },
      { name: 'open_to_work', label: 'Show “Open to work” badge', type: 'toggle' },
      { name: 'headline', label: 'Headline', type: 'text', maxLength: 220, wide: true, placeholder: 'B.Sc. (Hons) Agriculture Scholar · Sustainable Agronomy & Natural Resource Management' },
      { name: 'tagline', label: 'Tagline / quote', type: 'textarea', rows: 2, maxLength: 300, wide: true },
      { name: 'avatar_url', label: 'Profile photo', type: 'image', media: { kind: 'image', folder: 'profile' }, wide: true, help: 'A square, well-lit headshot works best.' },
    ],
  },
  {
    title: 'About',
    description: 'Your story, shown in the About section.',
    fields: [{ name: 'about', label: 'About text', type: 'textarea', rows: 9, maxLength: 6000, wide: true, help: 'Leave a blank line between paragraphs. The first paragraph is highlighted.' }],
  },
  {
    title: 'Contact',
    description: 'How recruiters reach you.',
    fields: [
      { name: 'email', label: 'Email', type: 'email', maxLength: 200 },
      { name: 'location', label: 'Location', type: 'text', maxLength: 120 },
      { name: 'phone', label: 'Phone', type: 'text', maxLength: 40 },
      { name: 'show_phone', label: 'Show phone number publicly', type: 'toggle', help: 'When off, the number never leaves the database.' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url', placeholder: 'https://www.linkedin.com/in/…' },
      { name: 'github_url', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/…' },
    ],
  },
  {
    title: 'Résumé',
    description: 'Adds “Résumé” buttons across the site.',
    fields: [
      {
        name: 'resume_url',
        label: 'Résumé PDF',
        type: 'file',
        media: { kind: 'pdf', folder: 'resume' },
        wide: true,
        help: 'Export from Word with File → Save As → PDF so the links inside stay clickable.',
      },
    ],
  },
  {
    title: 'Search & sharing',
    description: 'How the site appears on Google and when shared on LinkedIn or WhatsApp.',
    fields: [
      { name: 'seo_title', label: 'Page title', type: 'text', maxLength: 120, wide: true },
      { name: 'seo_description', label: 'Description', type: 'textarea', rows: 3, maxLength: 320, wide: true },
    ],
  },
];

export const PROFILE_FIELDS = PROFILE_GROUPS.flatMap((g) => g.fields);

export const EMPTY_PROFILE: Omit<Profile, 'id'> = {
  full_name: '',
  headline: '',
  tagline: '',
  about: '',
  location: '',
  email: '',
  phone: '',
  show_phone: false,
  linkedin_url: '',
  github_url: '',
  avatar_url: '',
  resume_url: '',
  open_to_work: true,
  seo_title: '',
  seo_description: '',
};

// ---------------------------------------------------------------------------
// Helpers shared by the forms
// ---------------------------------------------------------------------------

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Required fields, URL/email formats and number ranges. */
export function validateFields(fields: FieldConfig[], draft: Draft): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = draft[field.name];
    const text = typeof value === 'string' ? value.trim() : '';
    if (field.required && (value === null || value === undefined || (typeof value === 'string' && !text))) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (field.type === 'month-or-present' && value === '') errors[field.name] = 'Choose an end month, or tick “Present”.';
    if (field.type === 'url' && text && !isHttpUrl(text)) errors[field.name] = 'Enter a full link starting with https://';
    if (field.type === 'email' && text && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text)) errors[field.name] = 'Enter a valid email address.';
    if (field.type === 'number' && value !== null && value !== undefined && value !== '') {
      const n = Number(value);
      if (!Number.isFinite(n) || (field.min !== undefined && n < field.min) || (field.max !== undefined && n > field.max)) {
        errors[field.name] = `Enter a number between ${field.min} and ${field.max}.`;
      }
    }
    if (field.type === 'links' && Array.isArray(value)) {
      const bad = (value as { url: string }[]).some((l) => l.url.trim() && !isHttpUrl(l.url.trim()));
      if (bad) errors[field.name] = 'Every link needs a full address starting with https://';
    }
  }
  return errors;
}

/** Trims text, drops empty list entries and turns empty numbers into null — ready for the database. */
export function cleanDraft(fields: FieldConfig[], draft: Draft): Draft {
  const out: Draft = {};
  for (const field of fields) {
    const value = draft[field.name];
    switch (field.type) {
      case 'list':
      case 'tags':
      case 'gallery':
        out[field.name] = ((value as string[]) ?? []).map((v) => v.trim()).filter(Boolean);
        break;
      case 'links':
        out[field.name] = ((value as { label: string; url: string }[]) ?? [])
          .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
          .filter((l) => l.url);
        break;
      case 'number':
        out[field.name] = value === null || value === undefined || value === '' ? null : Number(value);
        break;
      case 'toggle':
        out[field.name] = Boolean(value);
        break;
      case 'month-or-present':
        out[field.name] = value ? String(value) : null;
        break;
      default:
        out[field.name] = typeof value === 'string' ? value.trim() : (value ?? '');
    }
  }
  return out;
}

/** Every uploaded-file URL a record points to (for cleaning up replaced or deleted files). */
export function mediaUrlsOf(fields: FieldConfig[], record: Draft | RowBase | null | undefined): Set<string> {
  const urls = new Set<string>();
  if (!record) return urls;
  const values = record as Draft;
  for (const field of fields) {
    const value = values[field.name];
    if ((field.type === 'image' || field.type === 'file') && typeof value === 'string' && value) urls.add(value);
    if (field.type === 'gallery' && Array.isArray(value)) for (const url of value as string[]) if (url) urls.add(url);
  }
  return urls;
}
