"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Folder, RefreshCw } from "lucide-react";

import PovProjectStatusBadge from "@/components/dashboard/pov/PovProjectStatusBadge";
import { usePovProjects } from "@/hooks/pov/usePovProjects";
import { povDate } from "@/lib/pov/display";
import { useState } from "react";
import { Plus } from "lucide-react";

import CreatePovProjectModal from "@/components/dashboard/pov/CreatePovProjectModal";
import { useAuthStore } from "@/store/auth.store";
const COLUMNS = [
  "Project",
  "PO / invoice",
  "Status",
  "Schedule",
  "Records",
  "Accounts",
  "Action"
];

export default function PovProjectsContainer() {
  const {
    projects,
    total,
    totalPages,
    page,
    limit,
    initialized,
    canLoad,
    loading,
    error,
    setPage,
    refresh
  } = usePovProjects();

  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);
const accountId = useAuthStore((state) => state.user?.id);

const [createForAccount, setCreateForAccount] = useState<string | null>(null);

const createOpen =
  canLoad && Boolean(accountId) && createForAccount === accountId;
  if (!initialized) {
    return (
      <p role="status" className="py-10 text-dashboard-muted">
        Loading POV projects…
      </p>
    );
  }

  if (!canLoad) {
    return (
      <p role="alert" className="py-10 text-dashboard-muted">
        You do not have access to this page.
      </p>
    );
  }

  return (
    <section dir="ltr" className="min-w-0 space-y-6 text-dashboard-text">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-dashboard-hover text-dashboard-cyan"
            >
              <Folder size={19} strokeWidth={1.75} />
            </span>

            <h1 className="text-2xl font-semibold">POV Projects</h1>
          </div>

          <p className="mt-3 text-sm leading-6 text-dashboard-muted">
            Manage projects, materials and project access. Search by project
            contact name using the top bar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={refresh}
            className="dashboard-btn-secondary"
          >
            <RefreshCw
              size={15}
              aria-hidden="true"
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Refreshing…" : "Refresh"}
          </button>

          <button
            type="button"
            disabled={!canLoad || createOpen}
            onClick={() => {
              if (accountId) setCreateForAccount(accountId);
            }}
            className="dashboard-btn-primary"
          >
            <Plus size={15} aria-hidden="true" />
            Create project
          </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashboard-border bg-dashboard-surface p-4"
        >
          <p className="text-[13px] text-dashboard-red">{error}</p>

          <button
            type="button"
            onClick={refresh}
            className="dashboard-btn-secondary"
          >
            Try again
          </button>
        </div>
      )}

      <div
        aria-busy={loading}
        className="overflow-hidden rounded-xl border border-dashboard-border bg-dashboard-surface"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-[13px] leading-6">
            <caption className="sr-only">
              POV projects, schedules, records and linked accounts
            </caption>

            <thead className="bg-dashboard-hover text-dashboard-muted">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-5 py-4 font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading || error || projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-5 py-12 text-center text-dashboard-muted"
                  >
                    <p role={loading ? "status" : undefined}>
                      {loading
                        ? "Loading projects…"
                        : error
                        ? "Projects could not be loaded."
                        : "No POV projects found."}
                    </p>
                  </td>
                </tr>
              ) : (
                projects.map((project) => {
                  const url = `/dashboard/admin/pov/${encodeURIComponent(
                    project.id
                  )}`;

                  return (
                    <tr
                      key={project.id}
                      className="border-t border-dashboard-border align-top transition-colors hover:bg-dashboard-hover/50"
                    >
                      <td className="max-w-72 px-5 py-4">
                        <Link
                          href={url}
                          className="break-words rounded font-semibold hover:text-dashboard-blue focus-visible:outline-2 focus-visible:outline-dashboard-focus"
                        >
                          {project.client_name}
                        </Link>

                        <p className="mt-1 text-xs text-dashboard-muted">
                          {project.phone || "No phone provided"}
                        </p>
                      </td>

                      <td className="max-w-48 break-words px-5 py-4">
                        {project.po_invoice_number || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <PovProjectStatusBadge
                          finished={project.finished}
                          paused={project.paused}
                        />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p>{povDate(project.start_date, false)}</p>

                        <p className="mt-1 text-xs text-dashboard-muted">
                          {project.duration_days}{" "}
                          {project.duration_days === 1 ? "day" : "days"}
                          {project.extra_days > 0 &&
                            ` + ${project.extra_days} extra`}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium tabular-nums">
                        {project._count.pov_records}
                      </td>

                      <td className="px-5 py-4 font-medium tabular-nums">
                        {project.pov_contacts.length}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <Link
                          href={url}
                          aria-label={`Open project ${project.client_name}`}
                          className="rounded text-xs font-medium text-dashboard-blue hover:underline focus-visible:outline-2 focus-visible:outline-dashboard-focus"
                        >
                          Open details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border px-5 py-4 text-[13px]">
          <p aria-live="polite" className="text-dashboard-muted">
            {loading
              ? "Loading results…"
              : error
              ? "Results unavailable"
              : `Showing ${firstItem}–${lastItem} of ${total}`}
          </p>

          <nav
            aria-label="POV projects pagination"
            className="flex items-center gap-3"
          >
            <button
              type="button"
              disabled={loading || Boolean(error) || page <= 1}
              onClick={() => setPage(page - 1)}
              className="dashboard-btn-secondary"
            >
              <ChevronLeft size={14} aria-hidden="true" />
              Previous
            </button>

            <span className="whitespace-nowrap text-dashboard-muted">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={loading || Boolean(error) || page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="dashboard-btn-secondary"
            >
              Next
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </nav>
        </footer>
      </div>
      {createOpen && (
        <CreatePovProjectModal
          key={accountId}
          onClose={() => setCreateForAccount(null)}
          onCreated={() => {
            setCreateForAccount(null);
            refresh();
          }}
        />
      )}
    </section>
  );
}
