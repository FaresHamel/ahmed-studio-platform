"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { adminOverviewService } from "@/services/admin-overview.service";
import { AdminOverview } from "@/components/dashboard/overview/AdminOverview";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { filterOverview } from "@/lib/filter-overview";
import type { AdminOverviewData } from "@/types/admin-overview";

interface LoadedOverview {
  userId: string;
  requestKey: string;
  data: AdminOverviewData;
  updatedAt: Date | null;
}

export default function AdminOverviewContainer() {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.isInitialized);
  const { search } = useDashboard();
  const [result, setResult] = useState<LoadedOverview | null>(null);
  const [revision, setRevision] = useState(0);
  const [failure, setFailure] = useState<{ requestKey: string; message: string } | null>(null);
  const userId = user?.id;
  const canLoad = initialized && !!userId && !!user?.roles.includes("admin");

  const requestKey = JSON.stringify([userId, revision]);

  useEffect(() => {
    if (!canLoad || !userId) return;
    const controller = new AbortController();

    async function load() {
      try {
        const data = await adminOverviewService.load(controller.signal);
        if (controller.signal.aborted) return;
        setResult({
          userId: userId!,
          requestKey,
          data,
          updatedAt: Object.values(data).some(section => section.ok) ? new Date() : null,
        });
      } catch {
        if (!controller.signal.aborted) {
          setFailure({ requestKey, message: "Could not refresh the overview. Please try again." });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [canLoad, userId, requestKey]);

  if (!canLoad) return null;
  const current = result?.userId === userId ? result : null;
  const error = failure?.requestKey === requestKey ? failure.message : null;
  const loading = result?.requestKey !== requestKey && !error;

  return <>
    {error && <p role="alert" className="mb-4 text-sm text-rose-600">{error}</p>}
    {search.trim() && <p role="status" className="mb-4 text-sm text-dashboard-muted">
      Searching only the latest 5 Individual jobs and latest 5 POV projects. Totals are unchanged.
    </p>}
    <AdminOverview
      data={filterOverview(current?.data ?? null, search)}
      loading={loading}
      updatedAt={current?.updatedAt ?? null}
      searchText={search}
      userName={user?.name?.trim() || user?.email || ""}
      onRefresh={() => setRevision(value => value + 1)}
    />
  </>;
}
