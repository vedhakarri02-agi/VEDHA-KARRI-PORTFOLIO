import type { Metadata } from 'next';
import { CollectionEditor } from '@/components/admin/CollectionEditor';

export const metadata: Metadata = { title: 'Skills' };

export default function AdminSkillsPage() {
  return <CollectionEditor collection="skills" />;
}
