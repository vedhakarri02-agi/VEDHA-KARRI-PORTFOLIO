'use client';

import type { SupabaseClient } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type RefObject } from 'react';

type AdminContextValue = {
  supabase: SupabaseClient;
  email: string;
  /** True while a form has unsaved changes; the sidebar asks before navigating away. */
  unsavedRef: RefObject<boolean>;
};

export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin must be used inside the admin dashboard layout');
  return value;
}

type QueryState<T> = { data?: T; error?: string; loading: boolean };

/**
 * Loads data for an admin page with the signed-in admin's client.
 * `loader` must be a stable (module-level) function; `arg` is passed through to it.
 */
export function useAdminQuery<T, A = undefined>(loader: (supabase: SupabaseClient, arg: A) => Promise<T>, arg?: A) {
  const { supabase } = useAdmin();
  const [state, setState] = useState<QueryState<T>>({ loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    loader(supabase, arg as A).then(
      (data) => active && setState({ data, loading: false }),
      (err: { message?: string }) => active && setState({ error: err?.message ?? 'Something went wrong', loading: false }),
    );
    return () => {
      active = false;
    };
  }, [supabase, loader, arg, version]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    setVersion((v) => v + 1);
  }, []);

  /** Replace the loaded data locally (optimistic updates). */
  const setData = useCallback((update: (data: T) => T) => {
    setState((s) => (s.data === undefined ? s : { ...s, data: update(s.data) }));
  }, []);

  return { ...state, reload, setData };
}

/** Marks the page as having unsaved changes (browser tab close + in-app navigation). */
export function useUnsavedChanges(dirty: boolean) {
  const { unsavedRef } = useAdmin();

  useEffect(() => {
    unsavedRef.current = dirty;
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      unsavedRef.current = false;
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [dirty, unsavedRef]);
}
