import type { UserRole } from '@/types/auth';
export function getPrimaryRole(roles: readonly UserRole[] | null | undefined): UserRole | null {
  if (roles?.includes('admin')) return 'admin';
  if (roles?.includes('operator')) return 'operator';
  if (roles?.includes('client')) return 'client';
  return null;
}
export function getDashboardPath(roles: readonly UserRole[] | null | undefined): string {
  const role = getPrimaryRole(roles);
  return role ? `/dashboard/${role}` : '/login';
}
export function hasAllowedRole(roles: readonly UserRole[] | null | undefined, allow: readonly UserRole[]): boolean {
  return !!roles?.some((role) => allow.includes(role));
}
