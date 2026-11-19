import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default async function AdminLoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const { error } = await searchParams;
  return <LoginForm forbidden={error === 'forbidden'} />;
}
