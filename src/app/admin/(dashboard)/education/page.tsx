import type { Metadata } from 'next';
import { CollectionEditor } from '@/components/admin/CollectionEditor';

export const metadata: Metadata = { title: 'Education' };

export default function AdminEducationPage() {
  return <CollectionEditor collection="education" />;
}
