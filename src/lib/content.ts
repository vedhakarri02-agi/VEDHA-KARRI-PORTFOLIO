import { cache } from 'react';
import { STARTER_CONTENT } from './seed-content';
import { extractThemeColor, normalizeSections } from './site';
import { createServerSupabase } from './supabase/server';
import type {
  Certification,
  ContentSource,
  Education,
  Experience,
  Portfolio,
  Profile,
  Project,
  SectionSetting,
  SiteSettings,
  Skill,
} from './types';

export type PortfolioResult = {
  data: Portfolio;
  source: ContentSource;
  /** Set when the database could not be reached and the starter content is shown instead. */
  error?: string;
};

type ListTable = 'experiences' | 'projects' | 'skills' | 'certifications' | 'education';

/** The starter content, with the phone number removed unless "show phone" is on (like get_public_profile()). */
const PUBLIC_STARTER: Portfolio = {
  ...STARTER_CONTENT,
  profile: {
    ...STARTER_CONTENT.profile,
    phone: STARTER_CONTENT.profile.show_phone ? STARTER_CONTENT.profile.phone : '',
  },
};

function withArrays<T extends object>(rows: T[] | null, arrayFields: (keyof T)[]): T[] {
  return (rows ?? []).map((row) => {
    const copy = { ...row };
    for (const field of arrayFields) if (!Array.isArray(copy[field])) (copy[field] as unknown) = [];
    return copy;
  });
}

/** In-memory cache to prevent slow DNS / network timeouts from blocking every HTTP request */
let cachedPortfolio: { result: PortfolioResult; expiresAt: number } | null = null;

/**
 * Loads everything the public site shows.
 * Falls back to the starter content when Supabase isn't set up or can't be reached.
 * Automatically caches results so the site responds in milliseconds.
 */
export const getPortfolio = cache(async (): Promise<PortfolioResult> => {
  const now = Date.now();
  if (cachedPortfolio && now < cachedPortfolio.expiresAt) {
    return cachedPortfolio.result;
  }

  const supabase = createServerSupabase(3500);
  if (!supabase) {
    const res: PortfolioResult = { data: PUBLIC_STARTER, source: 'starter' };
    cachedPortfolio = { result: res, expiresAt: now + 30_000 };
    return res;
  }

  try {
    const listQuery = (table: ListTable) =>
      supabase
        .from(table)
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

    const [profile, settings, experiences, projects, skills, certifications, education] = await Promise.all([
      supabase.rpc('get_public_profile'),
      supabase.from('site_settings').select('id, sections, content_version').eq('id', 1).maybeSingle(),
      listQuery('experiences'),
      listQuery('projects'),
      listQuery('skills'),
      listQuery('certifications'),
      listQuery('education'),
    ]);

    const failed = [profile, settings, experiences, projects, skills, certifications, education].find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);

    // Database is set up but "Load starter content" hasn't been clicked yet.
    if (!profile.data) {
      const res: PortfolioResult = { data: PUBLIC_STARTER, source: 'starter' };
      cachedPortfolio = { result: res, expiresAt: now + 15_000 };
      return res;
    }

    const siteSettings = settings.data as SiteSettings | null;
    const rawProfile = profile.data as Profile;
    const userProfile: Profile = rawProfile
      ? {
          ...rawProfile,
          linkedin_url:
            !rawProfile.linkedin_url || rawProfile.linkedin_url === 'https://www.linkedin.com/in/vedha-karri'
              ? 'https://www.linkedin.com/in/vedha-karri-5606703a6'
              : rawProfile.linkedin_url,
        }
      : rawProfile;

    const res: PortfolioResult = {
      source: 'live',
      data: {
        profile: userProfile,
        settings: {
          id: 1,
          sections: normalizeSections(siteSettings?.sections),
          theme_color: extractThemeColor(normalizeSections(siteSettings?.sections)),
          content_version: Number(siteSettings?.content_version ?? 0),
        },
        experiences: withArrays(experiences.data as Experience[], ['bullets', 'skills']),
        projects: withArrays(projects.data as Project[], ['tools', 'gallery', 'links']),
        skills: (skills.data as Skill[]) ?? [],
        certifications: (certifications.data as Certification[]) ?? [],
        education: (education.data as Education[]) ?? [],
      },
    };
    cachedPortfolio = { result: res, expiresAt: now + 10_000 };
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[content] Supabase unreachable, serving instant starter content:', message);
    const res: PortfolioResult = { data: PUBLIC_STARTER, source: 'starter', error: message };
    // Cache offline state for 30 seconds so consecutive requests return in ~0ms
    cachedPortfolio = { result: res, expiresAt: now + 30_000 };
    return res;
  }
});

/** Sections that are switched on in the admin and actually have something to show. */
export function visibleSections(data: Portfolio): SectionSetting[] {
  const hasContent: Record<string, boolean> = {
    about: Boolean(data.profile.about.trim()),
    experience: data.experiences.some((e) => e.kind === 'internship'),
    projects: data.projects.length > 0,
    skills: data.skills.length > 0,
    certifications: data.certifications.length > 0,
    achievements: true,
    education: data.education.length > 0,
    leadership: data.experiences.some((e) => e.kind === 'leadership'),
    contact: true,
  };
  return data.settings.sections.filter((s) => s.visible && (hasContent[s.key] ?? true));
}

export type Stat = { value: string; label: string };

/** Hero stats are derived from the content itself, so there is nothing extra to keep updated. */
export function getStats(data: Portfolio): Stat[] {
  const stats: Stat[] = [];
  const cgpa = data.education.find((e) => /cgpa|gpa/i.test(e.score_label) && e.score.trim());
  if (cgpa) stats.push({ value: cgpa.score.split('/')[0]!.trim(), label: cgpa.score_label || 'CGPA' });

  const count = (n: number, one: string, many: string) => {
    if (n > 0) stats.push({ value: String(n), label: n === 1 ? one : many });
  };
  count(data.experiences.filter((e) => e.kind === 'internship').length, 'Internship', 'Internships');
  count(data.projects.length, 'Project', 'Projects');
  count(data.certifications.length, 'Certification', 'Certifications');
  return stats;
}
