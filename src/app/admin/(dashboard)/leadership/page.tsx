import type { Metadata } from 'next';
import { CollectionEditor } from '@/components/admin/CollectionEditor';

export const metadata: Metadata = { title: 'Leadership' };

export default function AdminLeadershipPage() {
  return <CollectionEditor collection="leadership" />;
}
