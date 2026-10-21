'use client';
import type { ReactNode } from 'react';
import { useAuthInit } from '@/hooks/useAuthInit';
export function AuthInitializer({ children }: { children: ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}
