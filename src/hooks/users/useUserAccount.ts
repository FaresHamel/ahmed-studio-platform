"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usersService } from "@/services/users.service";
import { accountError } from "@/lib/users/account-errors";
import type { AdminUser } from "@/types/user";

export function useUserAccount(id: string) {
  const actor = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.isInitialized);
  const [revision, setRevision] = useState(0);
  const key = JSON.stringify([actor?.id, id, revision]);
  const [result, setResult] = useState<{ key: string; account: AdminUser | null; error: string | null } | null>(null);
  const canLoad = initialized && !!actor?.roles.includes("admin");

  useEffect(() => {
    if (!canLoad) return;
    const controller = new AbortController();
    async function load() {
      try {
        const account = await usersService.get(id, controller.signal);
        if (!controller.signal.aborted) setResult({ key, account, error: null });
      } catch (error) {
        if (!controller.signal.aborted) setResult({ key, account: null, error: accountError(error, "Could not load this account.") });
      }
    }
    void load();
    return () => controller.abort();
  }, [canLoad, id, key]);

  const current = canLoad && result?.key === key ? result : null;
  return { account: current?.account ?? null, error: current?.error ?? null, loading: canLoad && !current, refresh: () => setRevision(value => value + 1) };
}
