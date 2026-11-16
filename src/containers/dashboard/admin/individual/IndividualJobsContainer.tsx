"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Building2, Plus, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import CreateIndividualJobModal from "@/components/dashboard/individual/CreateIndividualJobModal";
import { useIndividualJobs } from "@/hooks/individual/useIndividualJobs";
import { individualError } from "@/hooks/individual/useIndividualJob";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";

import type {
  IndividualJobListItem,
  NewJobInput
} from "@/types/production-api";

const TABLE_COLUMNS = [
  "INV",
  "Customer",
  "Job contact",
  "Boxes",
  "Add boxes",
  "Shipping",
  "Actions"
];

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium"
  }).format(date);
}

function getJobSummary(job: IndividualJobListItem) {
  const total = job.ind_boxes.length;
  const shipped = job.ind_boxes.filter((box) => Boolean(box.shipped_at)).length;

  const closed = job.ind_boxes.filter(
    (box) => box.closed && !box.shipped_at
  ).length;

  const open = total - shipped - closed;
  const percentage = total > 0 ? Math.round((shipped / total) * 100) : 0;

  if (total === 0 || shipped === 0) {
    return {
      total,
      open,
      closed,
      shipped,
      percentage,
      label: "Not shipped",
      color: "text-dashboard-muted"
    };
  }

  if (shipped < total) {
    return {
      total,
      open,
      closed,
      shipped,
      percentage,
      label: "Partially shipped",
      color: "text-dashboard-blue"
    };
  }

  return {
    total,
    open,
    closed,
    shipped,
    percentage,
    label: job.boxes_closed ? "Fully shipped" : "All current boxes shipped",
    color: job.boxes_closed ? "text-dashboard-green" : "text-dashboard-blue"
  };
}

function JobRow({ job }: { job: IndividualJobListItem }) {
  const summary = getJobSummary(job);
  const isCompany = job.clients?.client_type === "company";
  const CustomerIcon = isCompany ? Building2 : UserRound;

  const detailsUrl = `/dashboard/admin/individual/${encodeURIComponent(
    job.id
  )}`;

  return (
    <tr
      className="
        border-t border-dashboard-border
        transition-colors hover:bg-dashboard-hover/50
      "
    >
      <td className="px-5 py-4">
        <Link
          href={detailsUrl}
          aria-label={`View job INV ${job.inv_no}`}
          className="
            whitespace-nowrap rounded font-semibold text-dashboard-blue
            hover:underline focus-visible:outline-2
            focus-visible:outline-dashboard-focus
          "
        >
          {job.inv_no}
        </Link>

        <time
          dateTime={job.created_at}
          className="mt-2 block whitespace-nowrap text-xs text-dashboard-muted"
        >
          {formatDate(job.created_at)}
        </time>
      </td>

      <td className="px-5 py-4">
        {job.clients ? (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`
                flex size-9 shrink-0 items-center justify-center
                rounded-lg border
                ${
                  isCompany
                    ? "border-violet-500/25 bg-violet-500/10 text-dashboard-purple"
                    : "border-blue-500/25 bg-blue-500/10 text-dashboard-blue"
                }
              `}
            >
              <CustomerIcon size={17} strokeWidth={1.75} />
            </span>

            <div className="min-w-0">
              <p className="break-words font-medium">{job.clients.name}</p>

              <p className="mt-1 text-xs text-dashboard-muted">
                {isCompany ? "Company" : "Individual person"}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-dashboard-muted">Not linked</span>
        )}
      </td>

      <td className="px-5 py-4">
        <p className="break-words">{job.name}</p>

        <p className="mt-2 whitespace-nowrap text-xs text-dashboard-muted">
          {job.phone || "Phone not provided"}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="font-medium tabular-nums">{summary.total}</p>

        <p className="mt-2 whitespace-nowrap text-xs text-dashboard-muted">
          {summary.open} open · {summary.closed} closed
        </p>
      </td>

      <td className="px-5 py-4">
        <span
          className={`
            inline-flex rounded-full px-2.5 py-1 text-xs font-medium
            ${
              job.boxes_closed
                ? "bg-dashboard-amber-soft text-dashboard-amber"
                : "bg-dashboard-green-soft text-dashboard-green"
            }
          `}
        >
          {job.boxes_closed ? "Finished" : "Allowed"}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="min-w-[170px] space-y-2">
          <p className={`text-xs font-medium ${summary.color}`}>
            {summary.label}
          </p>

          <div className="flex items-center justify-between gap-3 text-xs text-dashboard-muted">
            <span>
              {summary.shipped} of {summary.total} boxes
            </span>

            <span className="tabular-nums">{summary.percentage}%</span>
          </div>

          <div
            role="progressbar"
            aria-label={`Shipment progress for INV ${job.inv_no}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={summary.percentage}
            aria-valuetext={`${summary.shipped} of ${summary.total} boxes shipped`}
            className="h-1.5 overflow-hidden rounded-full bg-dashboard-hover"
          >
            <div
              className={`
                h-full rounded-full
                ${
                  job.boxes_closed &&
                  summary.total > 0 &&
                  summary.shipped === summary.total
                    ? "bg-dashboard-green"
                    : "bg-dashboard-blue"
                }
              `}
              style={{ width: `${summary.percentage}%` }}
            />
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <Link
          href={detailsUrl}
          aria-label={`Open details for INV ${job.inv_no}`}
          className="
            whitespace-nowrap rounded text-xs font-medium
            text-dashboard-blue hover:underline
            focus-visible:outline-2
            focus-visible:outline-dashboard-focus
          "
        >
          Open details
        </Link>
      </td>
    </tr>
  );
}

export default function IndividualJobsContainer() {
  const {
    jobs,
    total,
    totalPages,
    page,
    limit,
    loading,
    error,
    canLoad,
    setPage,
    refresh
  } = useIndividualJobs();

  const accountId = useAuthStore((state) => state.user?.id);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const lock = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setFormOpen(false);
    setSaveError(null);
  }, [accountId, canLoad]);

  function closeForm() {
    if (lock.current) return;

    setFormOpen(false);
    setSaveError(null);
  }

  async function createJob(input: NewJobInput) {
    const actor = useAuthStore.getState().user;

    if (lock.current || !actor?.roles.includes("admin")) return;

    lock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      const job = await individualService.createJob(input);
      const currentUser = useAuthStore.getState().user;

      if (
        !mounted.current ||
        currentUser?.id !== actor.id ||
        !currentUser.roles.includes("admin")
      ) {
        return;
      }

      toast.success(`INV ${job.inv_no} created.`);
      setFormOpen(false);
      setSaveError(null);

      // The list hook triggers a reload through its revision state.
      refresh();
    } catch (failure) {
      const currentUser = useAuthStore.getState().user;

      if (
        mounted.current &&
        currentUser?.id === actor.id &&
        currentUser.roles.includes("admin")
      ) {
        setSaveError(
          individualError(
            failure,
            "Could not create the job. Please try again."
          )
        );
      }
    } finally {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
      }
    }
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <section dir="ltr" className="min-w-0 space-y-6 text-dashboard-text">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Individual</h1>

          <p className="mt-2 text-sm text-dashboard-muted">
            Search by INV, job contact name, or phone using the top bar.
          </p>
        </div>

        <button
          type="button"
          disabled={!canLoad || saving}
          onClick={() => {
            setSaveError(null);
            setFormOpen(true);
          }}
          className="dashboard-btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} aria-hidden="true" />
          Create job
        </button>
      </header>

      {error && (
        <div role="alert" className="dashboard-card space-y-3 p-5">
          <p className="text-sm text-dashboard-red">{error}</p>

          <button
            type="button"
            onClick={() => refresh()}
            className="dashboard-btn-secondary"
          >
            Try again
          </button>
        </div>
      )}

      <div className="dashboard-card overflow-hidden" aria-busy={loading}>
        <div className="border-b border-dashboard-border px-5 py-4">
          <h2 className="text-[15px] font-semibold">Individual Jobs</h2>

          <p className="mt-2 text-xs leading-5 text-dashboard-muted">
            Registration controls adding boxes. Shipping progress is calculated
            from the boxes already registered.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-[13px]">
            <caption className="sr-only">
              Individual jobs, box registration, and shipment progress
            </caption>

            <thead className="bg-dashboard-hover text-dashboard-muted">
              <tr>
                {TABLE_COLUMNS.map((column) => (
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
              {loading || jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_COLUMNS.length}
                    className="px-5 py-10 text-center text-dashboard-muted"
                  >
                    {loading
                      ? "Loading jobs…"
                      : error
                      ? "Jobs could not be loaded."
                      : !canLoad
                      ? "Individual jobs are unavailable for this account."
                      : "No Individual jobs found."}
                  </td>
                </tr>
              ) : (
                jobs.map((job) => <JobRow key={job.id} job={job} />)
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border p-5 text-[13px]">
          <span className="text-dashboard-muted">
            Showing {start}–{end} of {total}
          </span>

          <nav
            aria-label="Individual jobs pagination"
            className="flex items-center gap-3"
          >
            <button
              type="button"
              disabled={!canLoad || loading || Boolean(error) || page <= 1}
              onClick={() => setPage(page - 1)}
              className="dashboard-btn-secondary"
            >
              Previous
            </button>

            <span className="whitespace-nowrap">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={
                !canLoad || loading || Boolean(error) || page >= totalPages
              }
              onClick={() => setPage(page + 1)}
              className="dashboard-btn-secondary"
            >
              Next
            </button>
          </nav>
        </footer>
      </div>

      {formOpen && canLoad && (
        <CreateIndividualJobModal
          key={accountId}
          busy={saving}
          error={saveError}
          onSubmit={createJob}
          onClose={closeForm}
        />
      )}
    </section>
  );
}
