import type { Metadata } from 'next';
import { CollectionEditor } from '@/components/admin/CollectionEditor';

export const metadata: Metadata = { title: 'Projects' };

export default function AdminProjectsPage() {
  return <CollectionEditor collection="projects" />;
}
