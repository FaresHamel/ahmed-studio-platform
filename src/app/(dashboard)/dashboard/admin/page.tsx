import AdminOverviewContainer from '@/containers/dashboard/AdminOverviewContainer';

// The existing admin/layout.tsx applies RoleGuard to this page and its siblings.
export default function AdminDashboardPage() {
  return <AdminOverviewContainer />;
}
