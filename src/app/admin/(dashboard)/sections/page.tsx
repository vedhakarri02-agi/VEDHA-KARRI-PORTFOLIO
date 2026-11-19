import type { Metadata } from 'next';
import { SectionsEditor } from '@/components/admin/SectionsEditor';

export const metadata: Metadata = { title: 'Sections' };

export default function AdminSectionsPage() {
  return <SectionsEditor />;
}
