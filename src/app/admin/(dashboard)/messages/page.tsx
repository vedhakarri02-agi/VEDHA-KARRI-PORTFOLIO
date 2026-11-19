import type { Metadata } from 'next';
import { MessagesInbox } from '@/components/admin/MessagesInbox';

export const metadata: Metadata = { title: 'Messages' };

export default function AdminMessagesPage() {
  return <MessagesInbox />;
}
