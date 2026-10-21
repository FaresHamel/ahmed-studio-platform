import type { ReactNode } from "react";
import type { OverviewSlice } from "@/types/admin-overview";
import { formatNumber } from "./overview-formatters";

/* Soft, layered shadow so cards lift off the page without looking heavy. */
const panel =
  "rounded-xl border border-dashboard-border bg-dashboard-surface shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_16px_-6px_rgba(16,24,40,0.10)]";
export function OverviewMetric({
  title,
  hint,
  section,
  loading,
  icon,
  color
}: {
  title: string;
  hint: string;
  section?: OverviewSlice<unknown>;
  loading: boolean;
  icon: ReactNode;
  color: string;
}) {
  return (
    <section
      className={`${panel} min-w-0 p-4 transition-shadow duration-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_10px_24px_-8px_rgba(16,24,40,0.14)]`}
      aria-label={title}
      aria-busy={loading}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-dashboard-muted">{title}</h2>
        <span
          className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </span>
      </div>
      {loading && !section ? (
        <div className="mt-3 h-7 w-16 animate-pulse rounded bg-dashboard-hover" />
      ) : (
        <p
          className={`mt-3 font-semibold tracking-tight ${
            section?.ok ? "text-2xl text-dashboard-text" : "text-sm text-rose-700"
          }`}
        >
          {section?.ok ? formatNumber(section.total) : "Unable to load"}
        </p>
      )}
      <p className="mt-1.5 text-xs leading-5 text-dashboard-muted">{hint}</p>
    </section>
  );
}
