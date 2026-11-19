import * as fs from 'fs';
import * as path from 'path';
import { STARTER_CONTENT } from '../src/lib/seed-content';

function escapeSql(str: string): string {
  if (str === null || str === undefined) return "''";
  return "'" + str.replace(/'/g, "''") + "'";
}

function escapeNullable(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === '') return 'null';
  if (typeof val === 'number') return String(val);
  return escapeSql(val);
}

function sqlArray(arr: string[]): string {
  if (!arr || arr.length === 0) return "'{}'";
  const escaped = arr.map((s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"');
  return `array[${arr.map((s) => escapeSql(s)).join(', ')}]`;
}

function generateSql(): string {
  const p = STARTER_CONTENT.profile;
  const lines: string[] = [
    '-- =====================================================================',
    '-- Starter content for Veda Sri Karri (B.Sc. Agriculture Portfolio).',
    '-- Generated directly from src/lib/seed-content.ts.',
    '-- Run in Supabase: SQL Editor -> New query -> paste -> Run.',
    '-- =====================================================================',
    '',
    'begin;',
    '',
    'delete from public.experiences;',
    'delete from public.projects;',
    'delete from public.skills;',
    'delete from public.certifications;',
    'delete from public.education;',
    '',
    'insert into public.profile (',
    '  id, full_name, headline, tagline, about, location, email, phone, show_phone,',
    '  linkedin_url, github_url, avatar_url, resume_url, open_to_work, seo_title, seo_description',
    ') values (',
    `  1, ${escapeSql(p.full_name)}, ${escapeSql(p.headline)}, ${escapeSql(p.tagline)}, ${escapeSql(p.about)}, ${escapeSql(p.location)},`,
    `  ${escapeSql(p.email)}, ${escapeSql(p.phone)}, ${p.show_phone ? 'true' : 'false'}, ${escapeSql(p.linkedin_url)}, ${escapeSql(p.github_url)},`,
    `  ${escapeSql(p.avatar_url)}, ${escapeSql(p.resume_url)}, ${p.open_to_work ? 'true' : 'false'}, ${escapeSql(p.seo_title)}, ${escapeSql(p.seo_description)}`,
    ')',
    'on conflict (id) do update set',
    '  full_name = excluded.full_name, headline = excluded.headline, tagline = excluded.tagline,',
    '  about = excluded.about, location = excluded.location, email = excluded.email, phone = excluded.phone,',
    '  show_phone = excluded.show_phone, linkedin_url = excluded.linkedin_url, github_url = excluded.github_url,',
    '  avatar_url = excluded.avatar_url, resume_url = excluded.resume_url, open_to_work = excluded.open_to_work,',
    '  seo_title = excluded.seo_title, seo_description = excluded.seo_description;',
    '',
    `insert into public.site_settings (id, sections, content_version) values (1, '${JSON.stringify(STARTER_CONTENT.settings.sections).replace(/'/g, "''")}'::jsonb, 1)`,
    'on conflict (id) do update set sections = excluded.sections, content_version = 1;',
    '',
  ];

  // Experiences
  lines.push('insert into public.experiences (kind, role, organization, org_url, logo_url, location, mode, start_date, end_date, bullets, skills, sort_order, is_visible) values');
  const expRows = STARTER_CONTENT.experiences.map((e, idx) => {
    const isLast = idx === STARTER_CONTENT.experiences.length - 1;
    const end = e.end_date ? escapeSql(e.end_date) : 'null';
    return `  (${escapeSql(e.kind)}, ${escapeSql(e.role)}, ${escapeSql(e.organization)}, ${escapeSql(e.org_url || '')}, ${escapeSql(e.logo_url || '')}, ${escapeSql(e.location)}, ${escapeSql(e.mode)}, ${escapeSql(e.start_date)}, ${end}, ${sqlArray(e.bullets)}, ${sqlArray(e.skills)}, ${e.sort_order}, ${e.is_visible ? 'true' : 'false'})${isLast ? ';' : ','}`;
  });
  lines.push(...expRows);
  lines.push('');

  // Projects
  lines.push('insert into public.projects (slug, title, category, summary, description, tools, cover_url, gallery, links, featured, sort_order, is_visible) values');
  const projRows = STARTER_CONTENT.projects.map((pr, idx) => {
    const isLast = idx === STARTER_CONTENT.projects.length - 1;
    const linksJson = `'${JSON.stringify(pr.links || []).replace(/'/g, "''")}'::jsonb`;
    return `  (${escapeSql(pr.slug)}, ${escapeSql(pr.title)}, ${escapeSql(pr.category)}, ${escapeSql(pr.summary)}, ${escapeSql(pr.description)}, ${sqlArray(pr.tools)}, ${escapeSql(pr.cover_url || '')}, ${sqlArray(pr.gallery || [])}, ${linksJson}, ${pr.featured ? 'true' : 'false'}, ${pr.sort_order}, ${pr.is_visible ? 'true' : 'false'})${isLast ? ';' : ','}`;
  });
  lines.push(...projRows);
  lines.push('');

  // Skills
  lines.push('insert into public.skills (category, name, level, sort_order, is_visible) values');
  const skillRows = STARTER_CONTENT.skills.map((s, idx) => {
    const isLast = idx === STARTER_CONTENT.skills.length - 1;
    return `  (${escapeSql(s.category)}, ${escapeSql(s.name)}, ${s.level !== null && s.level !== undefined ? s.level : 'null'}, ${s.sort_order}, ${s.is_visible ? 'true' : 'false'})${isLast ? ';' : ','}`;
  });
  lines.push(...skillRows);
  lines.push('');

  // Certifications
  lines.push('insert into public.certifications (title, issuer, issued_on, credential_url, file_url, sort_order, is_visible) values');
  const certRows = STARTER_CONTENT.certifications.map((c, idx) => {
    const isLast = idx === STARTER_CONTENT.certifications.length - 1;
    return `  (${escapeSql(c.title)}, ${escapeSql(c.issuer)}, ${escapeSql(c.issued_on)}, ${escapeSql(c.credential_url || '')}, ${escapeSql(c.file_url || '')}, ${c.sort_order}, ${c.is_visible ? 'true' : 'false'})${isLast ? ';' : ','}`;
  });
  lines.push(...certRows);
  lines.push('');

  // Education
  lines.push('insert into public.education (institution, qualification, field, start_year, end_year, score_label, score, sort_order, is_visible) values');
  const eduRows = STARTER_CONTENT.education.map((ed, idx) => {
    const isLast = idx === STARTER_CONTENT.education.length - 1;
    return `  (${escapeSql(ed.institution)}, ${escapeSql(ed.qualification)}, ${escapeSql(ed.field)}, ${escapeNullable(ed.start_year)}, ${escapeNullable(ed.end_year)}, ${escapeSql(ed.score_label)}, ${escapeSql(ed.score)}, ${ed.sort_order}, ${ed.is_visible ? 'true' : 'false'})${isLast ? ';' : ','}`;
  });
  lines.push(...eduRows);
  lines.push('');

  lines.push('commit;');
  lines.push('');

  return lines.join('\n');
}

const sql = generateSql();
fs.writeFileSync(path.join(__dirname, '../supabase/seed.sql'), sql, 'utf8');
console.log('Successfully generated supabase/seed.sql for Veda Sri Karri!');
