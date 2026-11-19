// Shapes of the rows stored in Supabase (see supabase/schema.sql).
// Dates are ISO strings ('YYYY-MM-DD'); month-precision fields always use the 1st of the month.

export type StandardSectionKey =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'education'
  | 'leadership'
  | 'achievements'
  | 'contact';

export type SectionKey = StandardSectionKey | (string & {});

export type CustomModuleItem = {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  link?: string;
  visible: boolean;
};

export type FieldVisibility = Record<string, boolean>;

export type ThemeColor = 'emerald' | 'amber' | 'ocean' | 'amethyst' | 'rose' | 'titanium';

export type SectionSetting = {
  key: SectionKey;
  visible: boolean;
  /** Optional custom heading/intro; the defaults in site.ts are used when empty. */
  title?: string;
  intro?: string;
  /** Optional theme override */
  theme?: ThemeColor;
  /** Custom items / achievements for custom or dedicated modules */
  items?: CustomModuleItem[];
  /** Field visibility switches within sections (e.g. Candidate, GPA, Location, CV) */
  fields_visibility?: FieldVisibility;
  /** Custom competence pillars / highlights in About */
  custom_pillars?: CustomModuleItem[];
};

export type Profile = {
  id: number;
  full_name: string;
  headline: string;
  tagline: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  show_phone: boolean;
  linkedin_url: string;
  github_url: string;
  avatar_url: string;
  resume_url: string;
  open_to_work: boolean;
  seo_title: string;
  seo_description: string;
};

export type SiteSettings = {
  id: number;
  sections: SectionSetting[];
  theme_color?: ThemeColor;
  /** Bumped by a database trigger on every content change; the site listens to it for live updates. */
  content_version: number;
};

/** Columns shared by every list table. */
export type RowBase = {
  id: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ExperienceKind = 'internship' | 'leadership';
export type WorkMode = '' | 'On-site' | 'Remote' | 'Hybrid';

export type Experience = RowBase & {
  kind: ExperienceKind;
  role: string;
  organization: string;
  org_url: string;
  logo_url: string;
  location: string;
  mode: WorkMode;
  start_date: string;
  /** null means "Present". */
  end_date: string | null;
  bullets: string[];
  skills: string[];
};

export type ProjectLink = { label: string; url: string };

export type Project = RowBase & {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  tools: string[];
  cover_url: string;
  gallery: string[];
  links: ProjectLink[];
  featured: boolean;
};

export type Skill = RowBase & {
  category: string;
  name: string;
  /** Optional 0–100 proficiency; hidden on the site when empty. */
  level: number | null;
};

export type Certification = RowBase & {
  title: string;
  issuer: string;
  issued_on: string;
  credential_url: string;
  file_url: string;
};

export type Education = RowBase & {
  institution: string;
  qualification: string;
  field: string;
  start_year: number | null;
  end_year: number | null;
  score_label: string;
  score: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Portfolio = {
  profile: Profile;
  settings: SiteSettings;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  education: Education[];
};

/** 'live' = loaded from Supabase; 'starter' = the bundled content in seed-content.ts. */
export type ContentSource = 'live' | 'starter';

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Submitted values, echoed back so the form can be re-filled after an error. */
  values?: Record<string, string>;
};
