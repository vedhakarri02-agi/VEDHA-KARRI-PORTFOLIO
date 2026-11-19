import type { Metadata } from 'next';
import { ProfileEditor } from '@/components/admin/ProfileForm';

export const metadata: Metadata = { title: 'Profile' };

export default function AdminProfilePage() {
  return <ProfileEditor />;
}
