'use server';

import { createServerSupabase } from '@/lib/supabase/server';
import type { FormState } from '@/lib/types';
import { isEmail, pickFields } from '@/lib/validation';

/** Saves a contact-form message to the admin inbox (Admin → Messages). */
export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = pickFields(formData, ['name', 'email', 'message'] as const);
  const fallbackEmail = String(formData.get('fallback_email') ?? '');

  // Bots fill every field, including the hidden one. Pretend it worked.
  if (String(formData.get('company') ?? '').trim()) {
    return { status: 'success', message: 'Thanks! Your message has been sent.' };
  }

  const fieldErrors: Record<string, string> = {};
  if (!values.name || values.name.length > 100) fieldErrors.name = 'Enter your name (up to 100 characters).';
  if (!isEmail(values.email)) fieldErrors.email = 'Enter a valid email address.';
  if (values.message.length < 10 || values.message.length > 5000) {
    fieldErrors.message = 'Your message should be between 10 and 5,000 characters.';
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors, values };
  }

  const offline = fallbackEmail
    ? `The contact form is offline right now. Please email ${fallbackEmail} instead.`
    : 'The contact form is offline right now. Please try again later.';

  const supabase = createServerSupabase();
  if (!supabase) return { status: 'error', message: offline, values };

  const { error } = await supabase.from('messages').insert(values);
  if (error) {
    console.error('[contact] Failed to save message:', error.message);
    return { status: 'error', message: offline, values };
  }

  return { status: 'success', message: 'Thanks! Your message has been sent — I’ll get back to you soon.' };
}
