"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { tapeDetailsApi } from '@/lib/individual/tape-details-api';
import { individualError } from '@/hooks/individual/useIndividualJob';
import { useAuthStore } from '@/store/auth.store';
import type { TapeDetails } from '@/types/tape-details';

export function useTapeDetails(tapeId: string) {
  const accountId = useAuthStore((state) => state.user?.id);
  const [tape, setTape] = useState<TapeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const request = useRef(0);

  const refresh = useCallback(async () => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    const version = ++request.current;
    setRefreshing(true);
    setError(null);
    try {
      const result = await tapeDetailsApi.get(tapeId, current.signal);
      if (current.signal.aborted || request.current !== version) return;
      setTape(result);
    } catch (failure) {
      if (!current.signal.aborted && request.current === version) {
        setError(individualError(failure, 'Could not load this material.'));
      }
      throw failure;
    } finally {
      if (!current.signal.aborted && request.current === version) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [tapeId, accountId]);

  useEffect(() => {
    setTape(null);
    setLoading(true);
    void refresh().catch(() => {});
    return () => {
      controller.current?.abort();
      request.current++;
    };
  }, [refresh]);

  return { tape, loading, refreshing, error, refresh };
}
