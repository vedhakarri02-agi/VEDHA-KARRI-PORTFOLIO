'use client';

import { Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteMessage, listMessages, setMessageRead } from '@/lib/admin-api';
import type { ContactMessage } from '@/lib/types';
import { useAdmin, useAdminQuery } from './AdminContext';
import { useToast } from './Toast';
import { PageHeader, QueryStatus } from './ui';

const dateFormat = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export function MessagesInbox() {
  const { supabase } = useAdmin();
  const toast = useToast();
  const { data, error, loading, reload, setData } = useAdminQuery(listMessages);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // New messages appear without a refresh.
  useEffect(() => {
    const channel = supabase
      .channel('admin-inbox')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const message = payload.new as ContactMessage;
        setData((list) => (list.some((m) => m.id === message.id) ? list : [message, ...list]));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setData]);

  const setRead = async (message: ContactMessage, isRead: boolean) => {
    setData((list) => list.map((m) => (m.id === message.id ? { ...m, is_read: isRead } : m)));
    try {
      await setMessageRead(supabase, message.id, isRead);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t update the message.');
      reload();
    }
  };

  const remove = async (message: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${message.name}? This can’t be undone.`)) return;
    try {
      await deleteMessage(supabase, message.id);
      setData((list) => list.filter((m) => m.id !== message.id));
      toast.success('Message deleted.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Couldn’t delete the message.');
    }
  };

  const unread = data?.filter((m) => !m.is_read).length ?? 0;
  const shown = (data ?? []).filter((m) => filter === 'all' || !m.is_read);

  return (
    <>
      <PageHeader
        title="Messages"
        description="Messages sent through the contact form on your site. New ones appear here instantly."
        action={
          <div className="flex rounded-full border border-line p-1 text-sm" role="tablist" aria-label="Filter messages">
            {(['all', 'unread'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-3 py-1.5 transition-colors ${filter === key ? 'bg-accent/20 text-accent-glow' : 'text-muted hover:text-fg'}`}
              >
                {key === 'all' ? 'All' : `Unread (${unread})`}
              </button>
            ))}
          </div>
        }
      />
      <QueryStatus loading={loading && !data} error={error} onRetry={reload} />

      {data && shown.length === 0 && (
        <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <MailOpen size={28} className="text-subtle" />
          <p className="mt-3 font-display text-lg font-semibold">{filter === 'unread' ? 'All caught up' : 'No messages yet'}</p>
          <p className="mt-1 text-sm text-muted">When someone uses the contact form, their message lands here.</p>
        </div>
      )}

      <ul className="grid gap-3">
        {shown.map((message) => (
          <li
            key={message.id}
            className={`rounded-2xl border p-5 ${message.is_read ? 'border-line bg-ink-900/50' : 'border-accent/35 bg-accent/[0.06]'}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-medium">
                  {!message.is_read && <span className="size-2 rounded-full bg-accent-soft" aria-label="Unread" />}
                  {message.name}
                </p>
                <a href={`mailto:${message.email}`} className="text-sm break-all text-accent-soft hover:text-accent-glow">
                  {message.email}
                </a>
              </div>
              <time className="font-mono text-xs text-subtle" dateTime={message.created_at}>
                {dateFormat.format(new Date(message.created_at))}
              </time>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-fg/90">{message.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent('Re: your message on my portfolio')}`}
                onClick={() => !message.is_read && setRead(message, true)}
                className="btn btn-outline btn-sm"
              >
                <Reply size={15} /> Reply
              </a>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRead(message, !message.is_read)}>
                {message.is_read ? <Mail size={15} /> : <MailOpen size={15} />} Mark as {message.is_read ? 'unread' : 'read'}
              </button>
              <button type="button" className="btn btn-ghost btn-sm hover:text-danger" onClick={() => remove(message)}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
