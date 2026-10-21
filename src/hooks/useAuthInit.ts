'use client';
import { useEffect } from 'react';
import { initializeAuth } from '@/apis/axios';
export function useAuthInit() {
  useEffect(() => { void initializeAuth(); }, []);
}
