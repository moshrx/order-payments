import { AdminNav } from '@/components/admin-nav';
import { AdminLockScreen } from '@/components/admin-lock-screen';
import { isAdminUnlocked } from '@/features/admin/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Shows the lock screen, but does NOT stop the page below from rendering:
  // Next renders layout and page in parallel. Each admin page calls
  // requireAdmin() itself so its data never reaches the browser while locked.
  if (!(await isAdminUnlocked())) return <AdminLockScreen />;

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
