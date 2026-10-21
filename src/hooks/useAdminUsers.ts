"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { usersService } from "@/services/users.service";
import { useAuthStore } from "@/store/auth.store";
import type { AdminUser } from "@/types/user";
import { useDebouncedValue } from "./useDebouncedValue";

const LIMIT = 10;

interface UsersPage {
  key: string;
  requestKey: string;
  users: AdminUser[];
  total: number;
  totalPages: number;
}

export function useAdminUsers() {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.isInitialized);
  const { search } = useDashboard();
  const input = search.trim();
  const query = useDebouncedValue(input);
  const userId = user?.id;
  const canLoad = initialized && !!userId && !!user?.roles.includes("admin");

  // A new query starts at page 1 without first requesting the old page.
  const [pagination, setPagination] = useState({ query: "", page: 1 });
  const page = pagination.query === query ? pagination.page : 1;
  const key = JSON.stringify([userId, query, page]);
  const [result, setResult] = useState<UsersPage | null>(null);
  const [failure, setFailure] = useState<{ requestKey: string; message: string } | null>(null);
  const [revision, setRevision] = useState(0);
  const requestKey = JSON.stringify([key, revision]);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const actionLock = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!canLoad) return;
    const controller = new AbortController();

    async function load() {
      try {
        const response = await usersService.list({
          page, limit: LIMIT, search: query || undefined,
        }, controller.signal);
        if (controller.signal.aborted) return;

        const totalPages = Math.max(1, response.meta.totalPages);
        if (page > totalPages) {
          setPagination({ query, page: totalPages });
          return;
        }
        setResult({ key, requestKey, users: response.data, total: response.meta.total, totalPages });
      } catch {
        if (!controller.signal.aborted) setFailure({ requestKey, message: "Could not load accounts. Please try again." });
      }
    }

    void load();
    return () => controller.abort();
  }, [canLoad, key, page, query, requestKey]);

  const current = result?.key === key ? result : null;
  const waitingForSearch = input !== query;
  const error = failure?.requestKey === requestKey ? failure.message : null;
  const completed = result?.requestKey === requestKey || !!error;
  const loading = canLoad && (waitingForSearch || !completed);

  async function toggleStatus(account: AdminUser) {
    if (!canLoad || loading || error || actionLock.current) return;
    actionLock.current = true;
    setActioningId(account.id);
    const name = account.profiles?.display_name?.trim() || account.email;

    try {
      if (account.status === "active") await usersService.deactivate(account.id);
      else await usersService.activate(account.id);

      if (mounted.current && useAuthStore.getState().user?.id === userId) {
        toast.success(`${name} ${account.status === "active" ? "deactivated" : "activated"}`);
        setRevision((value) => value + 1);
      }
    } catch {
      if (mounted.current && useAuthStore.getState().user?.id === userId) {
        toast.error("Action failed. Please try again.");
      }
    } finally {
      actionLock.current = false;
      if (mounted.current) setActioningId(null);
    }
  }

  return {
    users: canLoad ? current?.users ?? [] : [],
    total: canLoad ? current?.total ?? 0 : 0,
    totalPages: current?.totalPages ?? 1,
    page,
    limit: LIMIT,
    loading,
    error,
    actioningId,
    setPage: (next: number) => setPagination({ query, page: Math.max(1, next) }),
    retry: () => setRevision((value) => value + 1),
    toggleStatus,
  };
}
