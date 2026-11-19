import type { Metadata } from 'next';
import { AchievementsEditor } from '@/components/admin/AchievementsEditor';

export const metadata: Metadata = { title: 'Achievements' };

export default function AdminAchievementsPage() {
  return <AchievementsEditor />;
}
