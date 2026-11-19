import type { SupabaseClient } from '@supabase/supabase-js';
import { slugify } from './format';
import { STARTER_CONTENT } from './seed-content';
import { normalizeSections } from './site';
import { MEDIA_BUCKET } from './supabase/env';
import type { ContactMessage, Profile, RowBase, SectionSetting, SiteSettings, ThemeColor } from './types';

// Data access for the admin dashboard. Every call runs as the signed-in admin,
// and the database's Row Level Security rejects it for anyone else.

export type CollectionTable = 'experiences' | 'projects' | 'skills' | 'certifications' | 'education';
export type RowFilter = { column: string; value: string } | undefined;

type Result<T> = { data: T | null; error: { message: string } | null };

function unwrap<T>({ data, error }: Result<T>): T {
  if (error) throw new Error(friendlyError(error.message));
  return data as T;
}

function friendlyError(message: string): string {
  if (/duplicate key value.*slug/i.test(message)) return 'Another project already uses this URL slug. Choose a different one.';
  if (/row-level security/i.test(message)) return 'You don’t have permission to do that. Try signing out and in again.';
  if (/failed to fetch/i.test(message)) return 'Can’t reach the database. Check your internet connection.';
  return message;
}

// ---------------------------------------------------------------------------
// List tables (experience, projects, skills, certifications, education)
// ---------------------------------------------------------------------------

export async function listRows<T extends RowBase>(supabase: SupabaseClient, table: CollectionTable, filter?: RowFilter): Promise<T[]> {
  let query = supabase.from(table).select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true });
  if (filter) query = query.eq(filter.column, filter.value);
  return unwrap(await query) as T[];
}

export async function insertRow<T extends RowBase>(supabase: SupabaseClient, table: CollectionTable, record: Record<string, unknown>): Promise<T> {
  return unwrap(await supabase.from(table).insert(record).select('*').single()) as T;
}

export async function updateRow<T extends RowBase>(
  supabase: SupabaseClient,
  table: CollectionTable,
  id: string,
  record: Record<string, unknown>,
): Promise<T> {
  return unwrap(await supabase.from(table).update(record).eq('id', id).select('*').single()) as T;
}

export async function deleteRow(supabase: SupabaseClient, table: CollectionTable, id: string) {
  unwrap(await supabase.from(table).delete().eq('id', id));
}

export async function setRowVisible(supabase: SupabaseClient, table: CollectionTable, id: string, isVisible: boolean) {
  unwrap(await supabase.from(table).update({ is_visible: isVisible }).eq('id', id));
}

/** Saves a new order: rows get sort_order 10, 20, 30… and only changed rows are written. */
export async function saveOrder<T extends RowBase>(supabase: SupabaseClient, table: CollectionTable, rows: T[]): Promise<T[]> {
  const next = rows.map((row, i) => ({ ...row, sort_order: (i + 1) * 10 }));
  const changed = next.filter((row, i) => row.sort_order !== rows[i]!.sort_order);
  const results = await Promise.all(changed.map((row) => supabase.from(table).update({ sort_order: row.sort_order }).eq('id', row.id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(friendlyError(failed.error.message));
  return next;
}

// ---------------------------------------------------------------------------
// Profile & site settings (single rows)
// ---------------------------------------------------------------------------

export async function fetchProfile(supabase: SupabaseClient): Promise<Profile | null> {
  const profile = unwrap(await supabase.from('profile').select('*').eq('id', 1).maybeSingle()) as Profile | null;
  if (profile && (!profile.linkedin_url || profile.linkedin_url === 'https://www.linkedin.com/in/vedha-karri')) {
    profile.linkedin_url = 'https://www.linkedin.com/in/vedha-karri-5606703a6';
  }
  return profile;
}

export async function saveProfile(supabase: SupabaseClient, profile: Omit<Profile, 'id'>): Promise<Profile> {
  return unwrap(await supabase.from('profile').upsert({ ...profile, id: 1 }).select('*').single()) as Profile;
}

export async function fetchSettings(supabase: SupabaseClient): Promise<SiteSettings> {
  const row = unwrap(await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()) as SiteSettings | null;
  return { id: 1, sections: normalizeSections(row?.sections), content_version: Number(row?.content_version ?? 0) };
}

export async function saveSections(supabase: SupabaseClient, sections: SectionSetting[]) {
  unwrap(await supabase.from('site_settings').upsert({ id: 1, sections }));
}

export async function saveThemeColor(supabase: SupabaseClient, themeId: ThemeColor): Promise<ThemeColor> {
  const current = await fetchSettings(supabase);
  const updated = current.sections.map((s, idx) => (idx === 0 ? { ...s, theme: themeId } : s));
  const hasThemeItem = updated.some((s) => s.key === '__theme');
  const sections = hasThemeItem
    ? updated.map((s) => (s.key === '__theme' ? { ...s, title: themeId } : s))
    : [{ key: '__theme', title: themeId, visible: false }, ...updated];
  await saveSections(supabase, sections);
  return themeId;
}

// ---------------------------------------------------------------------------
// Dashboard & starter content
// ---------------------------------------------------------------------------

export type DashboardData = {
  profile: Profile | null;
  counts: Record<'internships' | 'leadership' | 'projects' | 'skills' | 'certifications' | 'education', { total: number; hidden: number }>;
  unreadMessages: number;
  internshipsWithoutBullets: number;
  projectsWithoutCover: number;
};

export async function loadDashboard(supabase: SupabaseClient): Promise<DashboardData> {
  const [profile, experiences, projects, skills, certifications, education, unread] = await Promise.all([
    supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
    supabase.from('experiences').select('kind, is_visible, bullets'),
    supabase.from('projects').select('is_visible, cover_url'),
    supabase.from('skills').select('is_visible'),
    supabase.from('certifications').select('is_visible'),
    supabase.from('education').select('is_visible'),
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  const exp = unwrap(experiences) as { kind: string; is_visible: boolean; bullets: string[] }[];
  const proj = unwrap(projects) as { is_visible: boolean; cover_url: string }[];
  const tally = (rows: { is_visible: boolean }[]) => ({ total: rows.length, hidden: rows.filter((r) => !r.is_visible).length });
  if (unread.error) throw new Error(friendlyError(unread.error.message));

  return {
    profile: unwrap(profile) as Profile | null,
    counts: {
      internships: tally(exp.filter((e) => e.kind === 'internship')),
      leadership: tally(exp.filter((e) => e.kind === 'leadership')),
      projects: tally(proj),
      skills: tally(unwrap(skills) as { is_visible: boolean }[]),
      certifications: tally(unwrap(certifications) as { is_visible: boolean }[]),
      education: tally(unwrap(education) as { is_visible: boolean }[]),
    },
    unreadMessages: unread.count ?? 0,
    internshipsWithoutBullets: exp.filter((e) => e.kind === 'internship' && (e.bullets ?? []).length === 0).length,
    projectsWithoutCover: proj.filter((p) => !p.cover_url).length,
  };
}

/** Removes the starter-content ids and timestamps so the database generates its own. */
function forInsert<T extends RowBase>(rows: T[]): Record<string, unknown>[] {
  return rows.map((row) => {
    const copy: Record<string, unknown> = { ...row };
    delete copy.id;
    delete copy.created_at;
    delete copy.updated_at;
    return copy;
  });
}

/**
 * Copies seed-content.ts into an empty database. Lists are cleared first so a retry after
 * a failed attempt never duplicates rows; the profile is written last because the site
 * treats "no profile" as "not set up yet".
 */
export async function loadStarterContent(supabase: SupabaseClient) {
  const tables: [CollectionTable, RowBase[]][] = [
    ['experiences', STARTER_CONTENT.experiences],
    ['projects', STARTER_CONTENT.projects],
    ['skills', STARTER_CONTENT.skills],
    ['certifications', STARTER_CONTENT.certifications],
    ['education', STARTER_CONTENT.education],
  ];
  for (const [table, rows] of tables) {
    unwrap(await supabase.from(table).delete().not('id', 'is', null));
    unwrap(await supabase.from(table).insert(forInsert(rows)));
  }
  unwrap(await supabase.from('site_settings').upsert({ id: 1, sections: STARTER_CONTENT.settings.sections }));
  unwrap(await supabase.from('profile').upsert(STARTER_CONTENT.profile));
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function listMessages(supabase: SupabaseClient): Promise<ContactMessage[]> {
  return unwrap(await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(300)) as ContactMessage[];
}

export async function countUnread(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false);
  if (error) throw new Error(friendlyError(error.message));
  return count ?? 0;
}

export async function setMessageRead(supabase: SupabaseClient, id: string, isRead: boolean) {
  unwrap(await supabase.from('messages').update({ is_read: isRead }).eq('id', id));
}

export async function deleteMessage(supabase: SupabaseClient, id: string) {
  unwrap(await supabase.from('messages').delete().eq('id', id));
}

// ---------------------------------------------------------------------------
// Media (Supabase Storage)
// ---------------------------------------------------------------------------

export type MediaKind = 'image' | 'pdf' | 'image-or-pdf';

const LIMITS = { image: 5 * 1024 * 1024, pdf: 10 * 1024 * 1024 };
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

function checkFile(file: File, kind: MediaKind) {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isPdf = file.type === 'application/pdf';
  if (kind === 'image' && !isImage) throw new Error('Please choose a JPG, PNG, WebP, GIF or AVIF image.');
  if (kind === 'pdf' && !isPdf) throw new Error('Please choose a PDF file.');
  if (kind === 'image-or-pdf' && !isImage && !isPdf) throw new Error('Please choose an image or a PDF.');
  const limit = isPdf ? LIMITS.pdf : LIMITS.image;
  if (file.size > limit) throw new Error(`Files must be ${limit / 1024 / 1024} MB or smaller.`);
}

/** Uploads a file and returns its public URL. Names keep the original file name for nicer downloads. */
export async function uploadMedia(supabase: SupabaseClient, file: File, folder: string, kind: MediaKind): Promise<string> {
  checkFile(file, kind);
  const dot = file.name.lastIndexOf('.');
  const extension = (dot > 0 ? file.name.slice(dot + 1) : '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name).slice(0, 50) || 'file';
  const path = `${folder}/${base}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  unwrap(await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000' }));
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

const MEDIA_MARKER = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

/** Deletes a file from our bucket; ignores URLs that point anywhere else. Never throws. */
export async function removeMedia(supabase: SupabaseClient, url: string) {
  const index = url.indexOf(MEDIA_MARKER);
  if (index === -1) return;
  const path = decodeURIComponent(url.slice(index + MEDIA_MARKER.length));
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) console.warn('[admin] Could not remove file:', error.message);
}

export async function removeMediaList(supabase: SupabaseClient, urls: Iterable<string>) {
  await Promise.all([...urls].map((url) => removeMedia(supabase, url)));
}
