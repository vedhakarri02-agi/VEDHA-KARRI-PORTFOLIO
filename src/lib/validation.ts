const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isEmail(value: string): boolean {
  return value.length <= 200 && EMAIL.test(value);
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Reads the named text fields from a form, trimmed, with missing fields as ''. */
export function pickFields<K extends string>(formData: FormData, fields: readonly K[]): Record<K, string> {
  const values = {} as Record<K, string>;
  for (const field of fields) {
    const raw = formData.get(field);
    values[field] = typeof raw === 'string' ? raw.trim() : '';
  }
  return values;
}
