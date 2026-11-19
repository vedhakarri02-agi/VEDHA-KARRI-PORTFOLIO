import type { Metadata } from 'next';
import { AccountForm } from '@/components/admin/AccountForm';

export const metadata: Metadata = { title: 'Account' };

export default async function AdminAccountPage({ searchParams }: PageProps<'/admin/account'>) {
  const { reset } = await searchParams;
  return <AccountForm fromReset={reset === '1'} />;
}
