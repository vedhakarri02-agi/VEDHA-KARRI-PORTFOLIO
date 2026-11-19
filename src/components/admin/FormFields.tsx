'use client';

import { ArrowDown, ArrowUp, FileText, ImagePlus, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import type { Draft, FieldConfig } from '@/lib/collections';

export type UploadFn = (file: File, media: NonNullable<FieldConfig['media']>) => Promise<string>;

type FieldProps = {
  field: FieldConfig;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onUpload: UploadFn;
};

const FULL_WIDTH: FieldConfig['type'][] = ['list', 'tags', 'links', 'gallery', 'textarea'];

/** Renders a whole form from field settings in a responsive two-column grid. */
export function FormGrid({
  fields,
  draft,
  errors,
  setField,
  onUpload,
}: {
  fields: FieldConfig[];
  draft: Draft;
  errors: Record<string, string>;
  setField: (name: string, value: unknown) => void;
  onUpload: UploadFn;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.wide || FULL_WIDTH.includes(field.type) ? 'sm:col-span-2' : undefined}>
          <FieldInput field={field} value={draft[field.name]} error={errors[field.name]} onChange={(v) => setField(field.name, v)} onUpload={onUpload} />
        </div>
      ))}
    </div>
  );
}

export function FieldInput({ field, value, error, onChange, onUpload }: FieldProps) {
  const id = `field-${field.name}`;
  const described = [error ? `${id}-error` : '', field.help ? `${id}-help` : ''].filter(Boolean).join(' ') || undefined;
  const common = {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': described,
  } as const;

  if (field.type === 'toggle') {
    return (
      <div>
        <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-white/[0.02] px-4 py-3">
          <span className="text-sm text-fg/90">{field.label}</span>
          <input type="checkbox" className="switch" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} {...common} />
        </label>
        <Hint id={id} help={field.help} error={error} />
      </div>
    );
  }

  let control: React.ReactNode;
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          className="input"
          rows={field.rows ?? 4}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          {...common}
        />
      );
      break;
    case 'number':
      control = (
        <input
          type="number"
          inputMode="numeric"
          className="input"
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
          {...common}
        />
      );
      break;
    case 'select':
      control = (
        <select className="input" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} {...common}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option || 'Not specified'}
            </option>
          ))}
        </select>
      );
      break;
    case 'month':
      control = <MonthPicker id={id} value={String(value ?? '')} onChange={onChange} invalid={Boolean(error)} />;
      break;
    case 'month-or-present':
      control = <MonthOrPresent id={id} value={value as string | null} onChange={onChange} invalid={Boolean(error)} />;
      break;
    case 'list':
      control = <ListInput id={id} value={(value as string[]) ?? []} onChange={onChange} />;
      break;
    case 'tags':
      control = <TagsInput id={id} value={(value as string[]) ?? []} onChange={onChange} placeholder={field.placeholder} />;
      break;
    case 'links':
      control = <LinksInput id={id} value={(value as { label: string; url: string }[]) ?? []} onChange={onChange} />;
      break;
    case 'image':
      control = <ImageInput id={id} field={field} value={String(value ?? '')} onChange={onChange} onUpload={onUpload} />;
      break;
    case 'file':
      control = <FileInput id={id} field={field} value={String(value ?? '')} onChange={onChange} onUpload={onUpload} />;
      break;
    case 'gallery':
      control = <GalleryInput id={id} field={field} value={(value as string[]) ?? []} onChange={onChange} onUpload={onUpload} />;
      break;
    default:
      control = (
        <input
          type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
          className="input"
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          {...common}
        />
      );
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {field.label}
        {field.required && <span className="text-accent-soft"> *</span>}
      </label>
      {control}
      <Hint id={id} help={field.help} error={error} />
    </div>
  );
}

function Hint({ id, help, error }: { id: string; help?: string; error?: string }) {
  return (
    <>
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
      {help && !error && (
        <p id={`${id}-help`} className="help">
          {help}
        </p>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Month pickers (two selects work in every browser, unlike <input type="month">)
// ---------------------------------------------------------------------------

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function MonthPicker({ id, value, onChange, invalid }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean }) {
  const [year = '', month = ''] = value ? value.split('-') : [];
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: thisYear + 3 - 2010 + 1 }, (_, i) => String(thisYear + 3 - i));
  const [pending, setPending] = useState<{ year: string; month: string }>({ year, month });
  const current = value ? { year, month } : pending;

  const update = (next: { year: string; month: string }) => {
    setPending(next);
    onChange(next.year && next.month ? `${next.year}-${next.month}-01` : '');
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        id={id}
        aria-label="Month"
        aria-invalid={invalid || undefined}
        className="input"
        value={current.month}
        onChange={(e) => update({ ...current, month: e.target.value })}
      >
        <option value="">Month</option>
        {MONTH_NAMES.map((name, i) => (
          <option key={name} value={String(i + 1).padStart(2, '0')}>
            {name}
          </option>
        ))}
      </select>
      <select aria-label="Year" aria-invalid={invalid || undefined} className="input" value={current.year} onChange={(e) => update({ ...current, year: e.target.value })}>
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

/** `null` means "Present"; '' means an end month still has to be chosen. */
function MonthOrPresent({ id, value, onChange, invalid }: { id: string; value: string | null; onChange: (v: string | null) => void; invalid?: boolean }) {
  const present = value === null;
  return (
    <div className="grid gap-2">
      {!present && <MonthPicker id={id} value={value ?? ''} onChange={onChange} invalid={invalid} />}
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
        <input type="checkbox" className="switch" checked={present} onChange={(e) => onChange(e.target.checked ? null : '')} />
        Present (I’m still here)
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

function ListInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  const refs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const set = (index: number, text: string) => onChange(value.map((v, i) => (i === index ? text : v)));
  const insertAfter = (index: number) => {
    const next = [...value];
    next.splice(index + 1, 0, '');
    onChange(next);
    requestAnimationFrame(() => refs.current[index + 1]?.focus());
  };
  const move = (index: number, delta: number) => {
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item!);
    onChange(next);
  };

  return (
    <div id={id} className="grid gap-2">
      {value.map((line, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-3.5 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
          <textarea
            ref={(el) => {
              refs.current[i] = el;
            }}
            aria-label={`Line ${i + 1}`}
            className="input min-h-0 py-2"
            rows={2}
            value={line}
            onChange={(e) => set(i, e.target.value.replace(/\n/g, ' '))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                insertAfter(i);
              }
            }}
          />
          <div className="flex shrink-0 flex-col">
            <button type="button" className="btn btn-ghost btn-icon size-7" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move line up">
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-icon size-7"
              disabled={i === value.length - 1}
              onClick={() => move(i, 1)}
              aria-label="Move line down"
            >
              <ArrowDown size={14} />
            </button>
          </div>
          <button type="button" className="btn btn-ghost btn-icon mt-1 shrink-0" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove line ${i + 1}`}>
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => insertAfter(value.length - 1)}>
          <Plus size={15} /> Add line
        </button>
      </div>
    </div>
  );
}

function TagsInput({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const parts = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return setText('');
    const next = [...value];
    for (const part of parts) if (!next.some((v) => v.toLowerCase() === part.toLowerCase())) next.push(part);
    onChange(next);
    setText('');
  };

  return (
    <div
      className="input flex min-h-11 cursor-text flex-wrap items-center gap-2 py-2 focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/25"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span key={tag} className="tag gap-1.5">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`} className="opacity-70 hover:opacity-100">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        className="min-w-[8rem] flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-subtle"
        value={text}
        placeholder={value.length ? '' : (placeholder ?? 'Type and press Enter')}
        onChange={(e) => (e.target.value.includes(',') ? add(e.target.value) : setText(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add(text);
          } else if (e.key === 'Backspace' && !text && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(text)}
      />
    </div>
  );
}

function LinksInput({ id, value, onChange }: { id: string; value: { label: string; url: string }[]; onChange: (v: { label: string; url: string }[]) => void }) {
  const set = (index: number, patch: Partial<{ label: string; url: string }>) => onChange(value.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  return (
    <div id={id} className="grid gap-2">
      {value.map((link, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[12rem_1fr_auto]">
          <input className="input col-span-2 sm:col-span-1" placeholder="Label (e.g. Drawing PDF)" aria-label={`Link ${i + 1} label`} value={link.label} onChange={(e) => set(i, { label: e.target.value })} />
          <input className="input" type="url" placeholder="https://…" aria-label={`Link ${i + 1} address`} value={link.url} onChange={(e) => set(i, { url: e.target.value })} />
          <button type="button" className="btn btn-ghost btn-icon self-center" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove link ${i + 1}`}>
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...value, { label: '', url: '' }])}>
          <Plus size={15} /> Add link
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------

const ACCEPT = { image: 'image/jpeg,image/png,image/webp,image/gif,image/avif', pdf: 'application/pdf', 'image-or-pdf': 'image/jpeg,image/png,image/webp,application/pdf' };

function useUpload(field: FieldConfig, onUpload: UploadFn) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = async (files: File[], handle: (urls: string[]) => void) => {
    if (!field.media || files.length === 0) return;
    setBusy(true);
    setError(null);
    const urls: string[] = [];
    try {
      for (const file of files) urls.push(await onUpload(file, field.media));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      if (urls.length) handle(urls);
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const picker = (multiple: boolean, onFiles: (files: File[]) => void) => (
    <input
      ref={inputRef}
      type="file"
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
      multiple={multiple}
      accept={field.media ? ACCEPT[field.media.kind] : undefined}
      onChange={(e) => onFiles([...(e.target.files ?? [])])}
    />
  );

  return { busy, error, inputRef, run, picker };
}

function UploadError({ error }: { error: string | null }) {
  return error ? (
    <p className="field-error" role="alert">
      {error}
    </p>
  ) : null;
}

function ImageInput({ id, field, value, onChange, onUpload }: { id: string; field: FieldConfig; value: string; onChange: (v: string) => void; onUpload: UploadFn }) {
  const { busy, error, inputRef, run, picker } = useUpload(field, onUpload);
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-ink-950 text-subtle">
          {value ? <Image src={value} alt="" fill sizes="96px" className="object-cover" /> : <ImagePlus size={22} />}
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-ink-950/70">
              <Loader2 size={20} className="spin text-accent-soft" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button id={id} type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
            <Upload size={15} /> {value ? 'Replace' : 'Upload'}
          </button>
          {value && (
            <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        {picker(false, (files) => run(files, ([url]) => onChange(url!)))}
      </div>
      <UploadError error={error} />
    </div>
  );
}

function fileName(url: string): string {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() ?? url);
  } catch {
    return url;
  }
}

function FileInput({ id, field, value, onChange, onUpload }: { id: string; field: FieldConfig; value: string; onChange: (v: string) => void; onUpload: UploadFn }) {
  const { busy, error, inputRef, run, picker } = useUpload(field, onUpload);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white/[0.02] p-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-ink-950 text-accent-soft">
          {busy ? <Loader2 size={18} className="spin" /> : <FileText size={18} />}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm">
          {value ? (
            <a href={value} target="_blank" rel="noopener" className="text-accent-soft hover:text-accent-glow">
              {fileName(value)}
            </a>
          ) : (
            <span className="text-subtle">No file uploaded</span>
          )}
        </span>
        <div className="flex gap-2">
          <button id={id} type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
            <Upload size={15} /> {value ? 'Replace' : 'Upload'}
          </button>
          {value && (
            <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        {picker(false, (files) => run(files, ([url]) => onChange(url!)))}
      </div>
      <UploadError error={error} />
    </div>
  );
}

function GalleryInput({ id, field, value, onChange, onUpload }: { id: string; field: FieldConfig; value: string[]; onChange: (v: string[]) => void; onUpload: UploadFn }) {
  const { busy, error, inputRef, run, picker } = useUpload(field, onUpload);
  const labelId = useId();
  return (
    <div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4" aria-labelledby={labelId}>
        {value.map((src, i) => (
          <li key={src} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-ink-950">
            <Image src={src} alt={`Gallery image ${i + 1}`} fill sizes="160px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== src))}
              className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-ink-950/85 text-fg opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
              aria-label={`Remove image ${i + 1}`}
            >
              <X size={14} />
            </button>
          </li>
        ))}
        <li>
          <button
            id={id}
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="grid aspect-square w-full place-items-center rounded-xl border border-dashed border-line-strong text-subtle transition-colors hover:border-accent hover:text-accent-soft"
          >
            {busy ? <Loader2 size={20} className="spin" /> : <span className="grid place-items-center gap-1 text-xs"><ImagePlus size={20} /> Add images</span>}
          </button>
        </li>
      </ul>
      <span id={labelId} className="sr-only">
        {field.label}
      </span>
      {picker(true, (files) => run(files, (urls) => onChange([...value, ...urls])))}
      <UploadError error={error} />
    </div>
  );
}
