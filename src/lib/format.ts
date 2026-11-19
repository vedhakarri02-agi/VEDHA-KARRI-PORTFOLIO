const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Reads 'YYYY-MM-DD' (or 'YYYY-MM') without going through Date, so time zones can't shift the month. */
function parseMonth(iso: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})/.exec(iso);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) };
}

/** '2025-05-01' → 'May 2025'. */
export function formatMonth(iso: string | null | undefined): string {
  if (!iso) return '';
  const parsed = parseMonth(iso);
  return parsed ? `${MONTHS[parsed.month - 1]} ${parsed.year}` : '';
}

/** 'May 2025 – Jun 2025', or 'Jul 2025 – Present' when there is no end date. */
export function formatDateRange(start: string, end: string | null): string {
  const from = formatMonth(start);
  const to = end ? formatMonth(end) : 'Present';
  return from === to ? from : `${from} – ${to}`;
}

/** LinkedIn-style inclusive duration: May–Jun 2025 → '2 mos'. */
export function formatDuration(start: string, end: string | null, now = new Date()): string {
  const from = parseMonth(start);
  const to = end ? parseMonth(end) : { year: now.getFullYear(), month: now.getMonth() + 1 };
  if (!from || !to) return '';
  const total = Math.max(1, (to.year - from.year) * 12 + (to.month - from.month) + 1);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  return parts.join(' ');
}

/** '2023 – 2027', or just '2022' when only one year is known. */
export function formatYears(start: number | null, end: number | null): string {
  if (start && end) return start === end ? String(end) : `${start} – ${end}`;
  return String(end ?? start ?? '');
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Splits long text into paragraphs on blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Two-digit section index used in the engineering-drawing style labels: 1 → '01'. */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
