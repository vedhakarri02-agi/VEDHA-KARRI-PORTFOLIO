import { AdminShell } from '@/components/admin/AdminShell';

export default function DashboardLayout({ children }: LayoutProps<'/admin'>) {
  return <AdminShell>{children}</AdminShell>;
}
