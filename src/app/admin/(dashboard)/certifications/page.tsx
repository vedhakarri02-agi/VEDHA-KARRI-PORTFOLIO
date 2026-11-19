import type { Metadata } from 'next';
import { CollectionEditor } from '@/components/admin/CollectionEditor';

export const metadata: Metadata = { title: 'Certifications' };

export default function AdminCertificationsPage() {
  return <CollectionEditor collection="certifications" />;
}
