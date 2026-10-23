"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { CreateTapeForm } from "@/components/dashboard/individual/CreateTapeForm";
import { useIndividualBox } from "@/hooks/individual/useIndividualBox";
import { individualError } from "@/hooks/individual/useIndividualJob";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import type { TapeInput } from "@/types/production-api";

function stageLabel(value: string | null) {
  if (!value) return "Not recorded";
  if (value === "qc") return "QC";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function IndividualBoxDetailsContainer({
  boxId
}: {
  boxId: string;
}) {
  const { box, loading, error, refresh } = useIndividualBox(boxId);

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

  async function addTape(input: TapeInput) {
    const actor = useAuthStore.getState().user;

    if (
      lock.current ||
      !actor?.roles.includes("admin") ||
      !box ||
      box.closed ||
      box.shipped_at
    ) {
      return;
    }

    lock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      const tape = await individualService.addTape(boxId, input);

      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        toast.success(`Tape ${tape.id} added.`);
        setFormOpen(false);
        refresh();
      }
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        setSaveError(individualError(failure, "Could not add the tape."));
      }
    } finally {
      lock.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  if (loading) {
    return (
      <p role="status" className="py-10 text-dashboard-muted">
        Loading box…
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

  if (!box) return null;

  const status = box.shipped_at ? "Shipped" : box.closed ? "Closed" : "Open";

  const badge = box.shipped_at
    ? "bg-blue-500/10 text-blue-500"
    : box.closed
    ? "bg-amber-500/10 text-amber-500"
    : "bg-emerald-500/10 text-emerald-500";

  const canAdd = !box.closed && !box.shipped_at;

  return (
    <section dir="ltr" className="space-y-6 text-dashboard-text">
      <header>
        <Link
          href={`/dashboard/admin/individual/${encodeURIComponent(
            box.client_id
          )}`}
          className="text-sm text-dashboard-muted hover:underline"
        >
          ← Back to INV {box.ind_clients.inv_no}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-500"
          >
            <Package size={24} />
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-semibold">{box.id}</h1>
            <p className="mt-1 text-sm text-dashboard-muted">
              Job contact: {box.ind_clients.name}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${badge}`}
          >
            {status}
          </span>
        </div>
      </header>

      <section className="dashboard-card p-5">
        <p className="text-sm text-dashboard-muted">Total tapes</p>
        <p className="mt-2 text-2xl font-semibold">{box.ind_tapes.length}</p>
      </section>

      {!canAdd && (
        <p className="rounded-lg bg-dashboard-hover p-4 text-sm text-dashboard-muted">
          This box is {status.toLowerCase()}. Adding tapes is disabled.
        </p>
      )}

      {formOpen && canAdd && (
        <section className="dashboard-card mx-auto max-w-3xl p-6">
          <CreateTapeForm
            busy={saving}
            error={saveError}
            onSubmit={addTape}
            onCancel={() => {
              if (!lock.current) setFormOpen(false);
            }}
          />
        </section>
      )}

      <section className="dashboard-card overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 p-5">
          <h2 className="font-semibold">Tapes</h2>

          <button
            type="button"
            disabled={!canAdd || saving}
            onClick={() => {
              setSaveError(null);
              setFormOpen(true);
            }}
            className="dashboard-btn-primary"
          >
            <Plus size={16} aria-hidden="true" />
            Add tape
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Tapes in box {box.id}</caption>

            <thead className="bg-dashboard-hover text-dashboard-muted">
              <tr>
                {["Tape ID", "Media", "Format", "Stage", "Status"].map(
                  (label) => (
                    <th
                      key={label}
                      scope="col"
                      className="px-5 py-3 font-medium"
                    >
                      {label}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {box.ind_tapes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-dashboard-muted"
                  >
                    No tapes in this box.
                  </td>
                </tr>
              ) : (
                box.ind_tapes.map((tape) => (
                  <tr
                    key={tape.id}
                    className="border-t border-dashboard-border transition-colors hover:bg-dashboard-hover"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {tape.id}
                    </td>
                    <td className="px-5 py-4 capitalize">{tape.media_type}</td>
                    <td className="px-5 py-4">{tape.format}</td>
                    <td className="px-5 py-4">
                      {stageLabel(tape.current_station)}
                    </td>
                    <td className="px-5 py-4">{stageLabel(tape.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
