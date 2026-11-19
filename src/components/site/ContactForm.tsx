'use client';

import { CircleAlert, CircleCheck, Loader2, Send } from 'lucide-react';
import { useActionState } from 'react';
import { sendMessage } from '@/actions/contact';
import type { FormState } from '@/lib/types';

const initialState: FormState = { status: 'idle' };

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  if (state.status === 'success') {
    return (
      <div className="alert alert-success" role="status">
        <CircleCheck size={18} />
        <span>{state.message}</span>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <input type="hidden" name="fallback_email" value={fallbackEmail} />
      {/* Spam trap: hidden from people, filled in by bots. */}
      <div className="trap" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" autoComplete="name" defaultValue={values.name} error={errors.name} maxLength={100} />
        <Field name="email" label="Email" type="email" autoComplete="email" defaultValue={values.email} error={errors.email} />
      </div>
      <Field
        name="message"
        label="Message"
        multiline
        defaultValue={values.message}
        error={errors.message}
        maxLength={5000}
        placeholder="Tell me about the role, project or question…"
      />

      {state.status === 'error' && state.message && (
        <div className="alert alert-error" role="alert">
          <CircleAlert size={18} />
          <span>{state.message}</span>
        </div>
      )}

      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? (
            <>
              <Loader2 size={17} className="spin" /> Sending…
            </>
          ) : (
            <>
              Send message <Send size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  defaultValue?: string;
  error?: string;
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
};

function Field({ name, label, type = 'text', multiline, defaultValue, error, ...rest }: FieldProps) {
  const id = `contact-${name}`;
  const common = {
    id,
    name,
    defaultValue,
    required: true,
    className: 'input',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    ...rest,
  };
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {multiline ? <textarea rows={6} {...common} /> : <input type={type} {...common} />}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
