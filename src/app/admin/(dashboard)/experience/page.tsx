import type { Metadata } from 'next';
import { CollectionEditor } from '@/components/admin/CollectionEditor';

export const metadata: Metadata = { title: 'Experience' };

export default function AdminExperiencePage() {
  return <CollectionEditor collection="internships" />;
}
