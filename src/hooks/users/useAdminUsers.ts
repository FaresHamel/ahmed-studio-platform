"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useAuthStore } from "@/store/auth.store";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usersService } from "@/services/users.service";
import { accountError } from "@/lib/users/account-errors";
import type { PaginatedUsers, UserRoleFilter } from "@/types/user";

const LIMIT = 10;
type Outcome = { key: string; requestKey: string; data: PaginatedUsers | null; error: string | null };

export function useAdminUsers() {
  const actor = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.isInitialized);
  const { search } = useDashboard();
  const query = useDebouncedValue(search.trim());
  const [role, setRoleValue] = useState<UserRoleFilter>("all");
  const [revision, setRevision] = useState(0);
  const filterKey = JSON.stringify([actor?.id, query, role]);
  const [pagination, setPagination] = useState({ filterKey: "", page: 1 });
  const page = pagination.filterKey === filterKey ? pagination.page : 1;
  const key = JSON.stringify([filterKey, page]);
  const requestKey = JSON.stringify([key, revision]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const canLoad = initialized && !!actor?.id && !!actor.roles.includes("admin");

  useEffect(() => {
    if (!canLoad) return;
    const controller = new AbortController();
    async function load() {
      try {
        const data = await usersService.list({
          page, limit: LIMIT, search: query || undefined,
          role: role === "all" ? undefined : role,
        }, controller.signal);
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, data.meta.totalPages);
        if (page > lastPage) {
          setPagination({ filterKey, page: lastPage });
          return;
        }
        setOutcome({ key, requestKey, data, error: null });
      } catch (error) {
        if (!controller.signal.aborted) {
          setOutcome({ key, requestKey, data: null, error: accountError(error, "Could not load accounts.") });
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [canLoad, filterKey, key, page, query, requestKey, role]);

  const current = canLoad && outcome?.key === key ? outcome : null;
  const error = current?.requestKey === requestKey ? current.error : null;
  const loading = canLoad && (search.trim() !== query || outcome?.requestKey !== requestKey);
  const data = current?.data;

  function setRole(next: UserRoleFilter) {
    if (next === role) return;
    setRoleValue(next);
    setRevision(value => value + 1);
    setPagination({ filterKey: "", page: 1 });
  }
  function setPage(next: number) {
    setPagination({ filterKey, page: Math.max(1, Math.min(next, Math.max(1, data?.meta.totalPages ?? 1))) });
    setRevision(value => value + 1);
  }
  function refresh(resetPage = false) {
    if (resetPage) setPagination({ filterKey, page: 1 });
    setRevision(value => value + 1);
  }

  return {
    users: data?.data ?? [], total: data?.meta.total ?? 0,
    totalPages: Math.max(1, data?.meta.totalPages ?? 1), page, limit: LIMIT,
    loading, error, role, setRole, setPage, refresh, retry: () => refresh(),
  };
}
