"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Building2, Package, Plus, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import {
  individualError,
  useIndividualJob
} from "@/hooks/individual/useIndividualJob";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import type { BoxSummary } from "@/types/production-api";

function boxStatus(box: BoxSummary) {
  if (box.shipped_at) {
    return {
      label: "Shipped",
      style: "bg-blue-500/10 text-blue-500"
    };
  }

  if (box.closed) {
    return {
      label: "Closed",
      style: "bg-amber-500/10 text-amber-500"
    };
  }

  return {
    label: "Open",
    style: "bg-emerald-500/10 text-emerald-500"
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeZone: "UTC"
      }).format(date);
}

export default function IndividualJobDetailsContainer({
  jobId
}: {
  jobId: string;
}) {
  const { job, loading, error, refresh } = useIndividualJob(jobId);

  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const lock = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  async function createBox() {
    const actor = useAuthStore.getState().user;

    if (lock.current || !actor?.roles.includes("admin")) return;

    lock.current = true;
    setCreating(true);
    setActionError(null);

    try {
      const box = await individualService.createBox(jobId);

      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        toast.success(`Box ${box.id} created.`);
        refresh();
      }
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        setActionError(individualError(failure, "Could not create the box."));
      }
    } finally {
      lock.current = false;
      if (mounted.current) setCreating(false);
    }
  }

  if (loading) {
    return (
      <p role="status" className="py-10 text-dashboard-muted">
        Loading job…
      </p>
    );
  }

  if (error) {
    return (
      <section className="dashboard-card space-y-4 p-6">
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>

        <button
          type="button"
          onClick={refresh}
          className="dashboard-btn-secondary"
        >
          Try again
        </button>

        <Link
          href="/dashboard/admin/individual"
          className="block text-sm underline"
        >
          Back to Individual
        </Link>
      </section>
    );
  }

  if (!job) return null;

  const isCompany = job.clients?.client_type === "company";
  const CustomerIcon = isCompany ? Building2 : UserRound;

  const totalTapes = job.ind_boxes.reduce(
    (total, box) => total + box.ind_tapes.length,
    0
  );

  const openBoxes = job.ind_boxes.filter(
    (box) => !box.closed && !box.shipped_at
  ).length;

  const closedBoxes = job.ind_boxes.filter(
    (box) => box.closed && !box.shipped_at
  ).length;

  const shippedBoxes = job.ind_boxes.filter((box) => !!box.shipped_at).length;

  return (
    <section dir="ltr" className="space-y-6 text-dashboard-text">
      <header>
        <Link
          href="/dashboard/admin/individual"
          className="text-sm text-dashboard-muted hover:underline"
        >
          ← Back to Individual
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-500"
          >
            <Package size={24} />
          </span>

          <div>
            <h1 className="text-2xl font-semibold">INV {job.inv_no}</h1>
            <p className="mt-1 text-sm text-dashboard-muted">
              Individual job · Created {formatDate(job.created_at)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="dashboard-card p-5">
          <h2 className="font-semibold">Customer</h2>

          {job.clients ? (
            <div className="mt-5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`
                  flex size-10 shrink-0 items-center justify-center
                  rounded-lg border
                  ${
                    isCompany
                      ? "border-violet-500/25 bg-violet-500/10 text-violet-500"
                      : "border-blue-500/25 bg-blue-500/10 text-blue-500"
                  }
                `}
              >
                <CustomerIcon size={20} />
              </span>

              <div className="min-w-0">
                <Link
                  href={`/dashboard/admin/customers/${encodeURIComponent(
                    job.clients.id
                  )}`}
                  className="break-words text-sm font-medium hover:underline"
                >
                  {job.clients.name}
                </Link>

                <p className="mt-1 text-xs text-dashboard-muted">
                  {isCompany ? "Company" : "Individual person"}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-dashboard-muted">
              This legacy job is not linked to a customer.
            </p>
          )}
        </section>

        <section className="dashboard-card p-5">
          <h2 className="font-semibold">Job contact information</h2>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-dashboard-muted">Name</dt>
              <dd className="mt-1 break-words text-sm">{job.name}</dd>
            </div>

            <div>
              <dt className="text-xs text-dashboard-muted">Phone</dt>
              <dd className="mt-1 text-sm">{job.phone || "Not provided"}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-xs text-dashboard-muted">Email</dt>
              <dd className="mt-1 break-words text-sm">
                {job.email || "Not provided"}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          ["Total boxes", job.ind_boxes.length],
          ["Open boxes", openBoxes],
          ["Closed boxes", closedBoxes],
          ["Shipped boxes", shippedBoxes],
          ["Total tapes", totalTapes]
        ].map(([label, value]) => (
          <div key={label} className="dashboard-card p-4">
            <dt className="text-xs text-dashboard-muted">{label}</dt>
            <dd className="mt-2 text-2xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="dashboard-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h2 className="font-semibold">Boxes</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Closing a box fixes its contents; production can continue.
            </p>
          </div>

          <button
            type="button"
            disabled={creating}
            onClick={() => void createBox()}
            className="dashboard-btn-primary"
          >
            <Plus size={16} aria-hidden="true" />
            {creating ? "Creating…" : "Create box"}
          </button>
        </div>

        {actionError && (
          <p role="alert" className="px-5 pb-4 text-sm text-rose-600">
            {actionError}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Boxes belonging to INV {job.inv_no}
            </caption>

            <thead className="bg-dashboard-hover text-dashboard-muted">
              <tr>
                {["Box ID", "Status", "Tapes"].map((label) => (
                  <th key={label} scope="col" className="px-5 py-3 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {job.ind_boxes.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-dashboard-muted"
                  >
                    No boxes yet. Create the first box for this job.
                  </td>
                </tr>
              ) : (
                job.ind_boxes.map((box) => {
                  const status = boxStatus(box);

                  return (
                    <tr
                      key={box.id}
                      className="border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        <Link
                          href={`/dashboard/admin/individual/boxes/${encodeURIComponent(
                            box.id
                          )}`}
                          className="rounded hover:underline focus-visible:outline-2 focus-visible:outline-dashboard-focus"
                        >
                          {box.id}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">{box.ind_tapes.length}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
