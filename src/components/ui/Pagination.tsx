"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, totalPages, total, limit, disabled, onPageChange }: {
  page: number; totalPages: number; total: number; limit: number; disabled?: boolean; onPageChange: (page: number) => void;
}) {
  const first = total === 0 ? 0 : (page - 1) * limit + 1;
  return <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
    <p className="text-dashboard-muted">Showing {first}–{Math.min(page * limit, total)} of {total} results</p>
    <nav aria-label="Accounts pagination" className="flex items-center gap-3">
      <button type="button" className="dashboard-btn-secondary" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><ChevronLeft size={16} aria-hidden="true" /></button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" className="dashboard-btn-secondary" disabled={disabled || page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page"><ChevronRight size={16} aria-hidden="true" /></button>
    </nav>
  </div>;
}
