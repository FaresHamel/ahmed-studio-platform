"use client";

import { SlidersHorizontal } from "lucide-react";
import type { UserRoleFilter as Filter } from "@/types/user";
const FILTERS: { value: Filter; label: string }[] = [{ value: "all", label: "All" }, { value: "operator", label: "Operators" }, { value: "client", label: "Clients" }];

export function UserRoleFilter({ value, onChange, disabled }: { value: Filter; onChange: (value: Filter) => void; disabled?: boolean }) {
  return <div className="flex flex-wrap items-center gap-3">
    <span className="flex items-center gap-2 text-sm text-dashboard-muted"><SlidersHorizontal size={16} aria-hidden="true" />Filter</span>
    <div role="group" aria-label="Filter accounts by role" className="inline-flex gap-1 rounded-lg border border-dashboard-border bg-dashboard-surface p-1">
      {FILTERS.map(filter => <button key={filter.value} type="button" aria-pressed={value === filter.value} disabled={disabled} onClick={() => onChange(filter.value)}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-dashboard-focus disabled:opacity-50 ${value === filter.value ? "bg-dashboard-action text-dashboard-action-text" : "text-dashboard-muted hover:bg-dashboard-hover"}`}>{filter.label}</button>)}
    </div>
  </div>;
}
