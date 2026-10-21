"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Building2, UserRound } from "lucide-react";
import { CreateIndividualJobForm } from "@/components/dashboard/individual/CreateIndividualJobForm";
import { useIndividualJobs } from "@/hooks/individual/useIndividualJobs";
import { individualJobsService } from "@/services/individual-jobs.service";
import { useAuthStore } from "@/store/auth.store";
import type { NewJobInput } from "@/types/production-api";

function requestError(error: unknown): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
  }

  return "Could not create the job. Please try again.";
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

  async function createJob(input: NewJobInput) {
    const actor = useAuthStore.getState().user;
    if (lock.current || !actor?.roles.includes("admin")) return;

    lock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      const job = await individualJobsService.create(input);

      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        toast.success(`INV ${job.inv_no} created.`);
        setFormOpen(false);
        refresh();
      }
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        setSaveError(requestError(failure));
      }
    } finally {
      lock.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  return (
    <section dir="ltr" className="space-y-6 text-dashboard-text">
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
          className="dashboard-btn-primary"
        >
          Create job
        </button>
      </header>

      {formOpen && (
        <section className="dashboard-card mx-auto max-w-3xl p-6">
          <CreateIndividualJobForm
            busy={saving}
            error={saveError}
            onSubmit={createJob}
            onCancel={() => {
              if (!lock.current) setFormOpen(false);
            }}
          />
        </section>
      )}

      {error && (
        <div role="alert" className="dashboard-card space-y-3 p-5">
          <p className="text-sm text-rose-600">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="dashboard-btn-secondary"
          >
            Try again
          </button>
        </div>
      )}

      <div className="dashboard-card overflow-hidden" aria-busy={loading}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Individual jobs</caption>
            <thead className="bg-dashboard-hover text-dashboard-muted">
              <tr>
                {["INV", "Customer", "Job contact", "Phone", "Boxes"].map(
                  (column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-5 py-4 font-medium"
                    >
                      {column}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading || jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-dashboard-muted"
                  >
                    {loading
                      ? "Loading jobs…"
                      : error
                      ? "Jobs could not be loaded."
                      : "No Individual jobs found."}
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="
    border-t border-dashboard-border
    transition-colors hover:bg-dashboard-hover
  "
                  >
                    <td className="px-5 py-4 font-semibold">{job.inv_no}</td>
                    <td className="px-5 py-4">
                      {job.clients ? (
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className={`
          flex size-9 shrink-0 items-center justify-center
          rounded-lg border
          ${
            job.clients.client_type === "company"
              ? "border-violet-500/25 bg-violet-500/10 text-violet-500"
              : "border-blue-500/25 bg-blue-500/10 text-blue-500"
          }
        `}
                          >
                            {job.clients.client_type === "company" ? (
                              <Building2 size={18} strokeWidth={1.75} />
                            ) : (
                              <UserRound size={18} strokeWidth={1.75} />
                            )}
                          </span>

                          <div className="min-w-0">
                            <p className="font-medium">{job.clients.name}</p>
                            <p className="mt-0.5 text-xs text-dashboard-muted">
                              {job.clients.client_type === "company"
                                ? "Company"
                                : "Individual person"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-dashboard-muted">Not linked</span>
                      )}
                    </td>
                    <td className="px-5 py-4">{job.name}</td>
                    <td className="px-5 py-4">{job.phone || "—"}</td>
                    <td className="px-5 py-4">{job.ind_boxes.length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border p-5 text-sm">
          <span className="text-dashboard-muted">
            Showing {start}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canLoad || loading || !!error || page <= 1}
              onClick={() => setPage(page - 1)}
              className="dashboard-btn-secondary"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={!canLoad || loading || !!error || page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="dashboard-btn-secondary"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
