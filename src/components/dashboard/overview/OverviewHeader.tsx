import Link from "next/link";
import { RefreshCw, ArrowUpRight, Clock3 } from "lucide-react";

export function OverviewHeader({ userName, loading, updatedAt, onRefresh }: { userName: string; loading: boolean; updatedAt: Date | null; onRefresh: () => void }) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 pt-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard overview
          </h1>
          <p className="mt-2 text-sm text-dashboard-muted">
            Welcome back
            {userName ? (
              <>
                ,{" "}
                <bdi className="font-medium text-dashboard-text">
                  {userName}
                </bdi>
              </>
            ) : (
              ""
            )}
            . Here is your studio at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 rounded-lg border border-dashboard-border bg-dashboard-surface px-4 py-2.5 text-sm font-medium shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:bg-dashboard-hover focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Manage accounts
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="dashboard-btn-primary"
          >
            <RefreshCw
              size={16}
              aria-hidden="true"
              className={loading ? "animate-spin" : ""}
            />

            {loading ? "Updating…" : "Refresh data"}
          </button>
        </div>
      </header>
      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-xs text-dashboard-muted"
      >
        <Clock3 size={13} aria-hidden="true" />
        {loading
          ? "Updating overview…"
          : updatedAt
          ? `Last refresh completed: ${new Intl.DateTimeFormat("en", {
              hour: "2-digit",
              minute: "2-digit"
            }).format(updatedAt)}`
          : "Refresh to load your overview."}
      </p>
    </>
  );
}
