'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types/auth';
import { getDashboardPath, hasAllowedRole } from '@/lib/role-redirect';

export function RoleGuard({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const canAccess = hasAllowedRole(user?.roles, allow);
  useEffect(() => {
    if (!isInitialized) return;
    if (!user) { router.replace('/login'); return; }
    if (!canAccess) router.replace(getDashboardPath(user.roles));
  }, [user, isInitialized, canAccess, router]);
  if (!isInitialized) return <div className="p-8 text-center" role="status">Loading...</div>;
  // Do not mount protected children or trigger their effects while redirecting.
  if (!user || !canAccess) return null;
  return <>{children}</>;
}
