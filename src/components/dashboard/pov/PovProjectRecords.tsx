"use client";

import { useState } from "react";
import {
  FileText,
  Film,
  Image as ImageIcon,
  Layers,
  Music,
  Plus,
  RefreshCw,
  Search,
  type LucideIcon
} from "lucide-react";

import { usePovRecords } from "@/hooks/pov/usePovRecords";
import { useAuthStore } from "@/store/auth.store";

import CreatePovRecordModal from "./CreatePovRecordModal";
import { PovSection } from "./PovDetailsLayout";

import type { RecordStatus, TapeMediaType } from "@/types/production-api";

interface PovProjectRecordsProps {
  projectId: string;
  finished: boolean;
  projectRefreshing: boolean;
  onProjectUpdated: () => Promise<boolean>;
}

const MEDIA_APPEARANCE: Record<
  TapeMediaType,
  {
    icon: LucideIcon;
    color: string;
  }
> = {
  video: {
    icon: Film,
    color: "text-dashboard-blue"
  },
  audio: {
    icon: Music,
    color: "text-dashboard-purple"
  },
  photo: {
    icon: ImageIcon,
    color: "text-dashboard-red"
  },
  document: {
    icon: FileText,
    color: "text-dashboard-orange"
  }
};

const STATUS_APPEARANCE: Record<
  RecordStatus,
  {
    label: string;
    color: string;
  }
> = {
  on_shelf: {
    label: "On shelf",
    color: "bg-dashboard-hover text-dashboard-muted"
  },
  in_progress: {
    label: "In progress",
    color: "bg-dashboard-blue-soft text-dashboard-blue"
  },
  done: {
    label: "Done",
    color: "bg-dashboard-green-soft text-dashboard-green"
  }
};

const TABLE_COLUMNS = [
  "Material",
  "Media / format",
  "Status",
  "Duration",
  "File size"
];

export default function PovProjectRecords({
  projectId,
  finished,
  projectRefreshing,
  onProjectUpdated
}: PovProjectRecordsProps) {
  const accountId = useAuthStore((state) => state.user?.id);

  const isAdmin = useAuthStore((state) =>
    Boolean(state.user?.roles.includes("admin"))
  );

  const {
    records,
    total,
    totalPages,
    page,
    limit,
    search,
    error,
    loading,
    refreshing,
    setSearch,
    setPage,
    refresh
  } = usePovRecords(projectId);

  const scope = JSON.stringify([projectId, accountId]);

  const [createScope, setCreateScope] = useState<string | null>(null);

  const modalOpen = createScope === scope && Boolean(accountId) && isAdmin;

  const blocked = loading || refreshing || projectRefreshing;

  const canAdd = isAdmin && Boolean(accountId) && !finished;

  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;

  const lastItem = Math.min(page * limit, total);

  function refreshRecords() {
    void refresh();
  }

  async function refreshAfterCreation(): Promise<boolean> {
    const results = await Promise.allSettled([refresh(), onProjectUpdated()]);

    return results.every(
      (result) => result.status === "fulfilled" && result.value === true
    );
  }

  return (
    <PovSection
      title="Project records"
      icon={Layers}
      action={
        canAdd ? (
          <button
            type="button"
            disabled={blocked || modalOpen}
            onClick={() => setCreateScope(scope)}
            className="dashboard-btn-primary"
          >
            <Plus size={14} aria-hidden="true" />
            Add Material
          </button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="relative w-full sm:max-w-sm">
            <span className="sr-only">Search project records</span>

            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dashboard-muted"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Material number, label or format"
              className="dashboard-input min-h-10 w-full py-2 pl-9 pr-3 text-[13px]"
            />
          </label>

          <button
            type="button"
            disabled={blocked}
            onClick={refreshRecords}
            className="dashboard-btn-secondary"
          >
            <RefreshCw
              size={14}
              aria-hidden="true"
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {finished && (
          <p className="rounded-lg bg-dashboard-hover p-3 text-xs leading-5 text-dashboard-muted">
            Records are read-only while the project is finished. Reopen the
            project to make changes.
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-dashboard-hover p-3"
          >
            <p className="text-[13px] text-dashboard-red">{error}</p>

            <button
              type="button"
              disabled={blocked}
              onClick={refreshRecords}
              className="dashboard-btn-secondary"
            >
              Try again
            </button>
          </div>
        )}

        <div
          aria-busy={loading || refreshing}
          className="overflow-x-auto rounded-lg border border-dashboard-border"
        >
          <table className="w-full min-w-[650px] text-left text-[13px] leading-6">
            <caption className="sr-only">
              Records registered in this POV project
            </caption>

            <thead className="bg-dashboard-hover text-dashboard-muted">
              <tr>
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-4 py-3 font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading || records.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_COLUMNS.length}
                    className="px-4 py-10 text-center text-dashboard-muted"
                  >
                    <p role={loading ? "status" : undefined}>
                      {loading
                        ? "Loading records…"
                        : error
                        ? "Records could not be loaded."
                        : "No records found."}
                    </p>
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const media = record.media_type
                    ? MEDIA_APPEARANCE[record.media_type]
                    : undefined;

                  const Icon = media?.icon ?? Layers;

                  const status = STATUS_APPEARANCE[record.status] ?? {
                    label: "Needs review",
                    color: "bg-dashboard-amber-soft text-dashboard-amber"
                  };

                  const materialCode = record.tape_code || record.barcode;

                  return (
                    <tr
                      key={record.id}
                      className="border-t border-dashboard-border align-top transition-colors hover:bg-dashboard-hover/50"
                    >
                      <td className="max-w-72 px-4 py-3">
                        <p className="break-words font-medium">
                          {materialCode || record.record_no}
                        </p>

                        <p className="mt-1 text-xs text-dashboard-muted">
                          {record.record_no}
                        </p>

                        {record.label && (
                          <p className="mt-1 break-words text-xs text-dashboard-muted">
                            {record.label}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon
                            size={15}
                            aria-hidden="true"
                            className={media?.color || "text-dashboard-muted"}
                          />

                          <span className="capitalize">
                            {record.media_type || "Not recorded"}
                          </span>
                        </div>

                        <p className="mt-1 break-words text-xs text-dashboard-muted">
                          {record.format}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`
                            inline-flex whitespace-nowrap
                            rounded-full px-2 py-0.5
                            text-xs font-medium
                            ${status.color}
                          `}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        {record.duration == null
                          ? "—"
                          : `${record.duration} min`}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        {record.file_size == null
                          ? "—"
                          : `${record.file_size} GB`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <p aria-live="polite" className="text-dashboard-muted">
            {loading
              ? "Loading results…"
              : error
              ? "Results could not refresh."
              : `Showing ${firstItem}–${lastItem} of ${total}`}
          </p>

          <nav
            aria-label="Project records pagination"
            className="flex items-center gap-3"
          >
            <button
              type="button"
              disabled={blocked || Boolean(error) || page <= 1}
              onClick={() => setPage(page - 1)}
              className="dashboard-btn-secondary"
            >
              Previous
            </button>

            <span className="whitespace-nowrap text-dashboard-muted">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={blocked || Boolean(error) || page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="dashboard-btn-secondary"
            >
              Next
            </button>
          </nav>
        </footer>
      </div>

      {modalOpen && (
        <CreatePovRecordModal
          key={scope}
          projectId={projectId}
          finished={finished}
          onClose={() => setCreateScope(null)}
          onCreated={refreshAfterCreation}
        />
      )}
    </PovSection>
  );
}
