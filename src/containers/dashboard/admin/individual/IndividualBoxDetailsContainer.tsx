"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import toast from "react-hot-toast";

import TapeBoard from "@/components/dashboard/individual/TapeBoard";
import { CreateTapeModal } from "@/components/dashboard/individual/CreateTapeForm";
import { useIndividualBox } from "@/hooks/individual/useIndividualBox";
import { individualError } from "@/hooks/individual/useIndividualJob";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import type { TapeInput } from "@/types/production-api";

export default function IndividualBoxDetailsContainer({
  boxId
}: {
  boxId: string;
}) {
  const { box, loading, error, refresh } = useIndividualBox(boxId);
  const user = useAuthStore((state) => state.user);

  const [showAddTape, setShowAddTape] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const lock = useRef(false);
  const mounted = useRef(false);
  const currentBoxId = useRef(boxId);
  currentBoxId.current = boxId;

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setShowAddTape(false);
    setSaveError(null);
  }, [boxId, user?.id]);

  async function addTape(input: TapeInput) {
    const actor = useAuthStore.getState().user;
    const requestedBoxId = boxId;

    if (lock.current) {
      throw new Error("A save is already in progress.");
    }

    if (!actor?.roles.includes("admin")) {
      const message = "Only admins can add tapes.";
      setSaveError(message);
      throw new Error(message);
    }

    if (!box || box.id !== requestedBoxId || box.closed || box.shipped_at) {
      const message =
        "Cannot add tapes to an unavailable, closed, or shipped box.";

      setSaveError(message);
      throw new Error(message);
    }

    lock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      let tape;

      try {
        tape = await individualService.addTape(requestedBoxId, input);
      } catch (failure) {
        if (
          mounted.current &&
          currentBoxId.current === requestedBoxId &&
          useAuthStore.getState().user?.id === actor.id
        ) {
          setSaveError(individualError(failure, "Could not add the tape."));
        }

        // The modal stays open when creation fails.
        throw failure;
      }

      if (
        !mounted.current ||
        currentBoxId.current !== requestedBoxId ||
        useAuthStore.getState().user?.id !== actor.id
      ) {
        return;
      }

      toast.success(`Tape ${input.tape_code || tape.id} added.`);
      setShowAddTape(false);
      setSaveError(null);

      try {
        await refresh();
      } catch {
        if (
          mounted.current &&
          currentBoxId.current === requestedBoxId &&
          useAuthStore.getState().user?.id === actor.id
        ) {
          toast.error(
            "Tape added, but the board could not refresh. Reload the page."
          );
        }
      }
    } finally {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
      }
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
          onClick={() => void refresh()}
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

  const isAdmin = Boolean(user?.roles.includes("admin"));
  const boxOpen = !box.closed && !box.shipped_at;
  const canAdd = isAdmin && boxOpen;

  const status = box.shipped_at ? "Shipped" : box.closed ? "Closed" : "Open";

  const badge = box.shipped_at
    ? "bg-blue-500/10 text-blue-500"
    : box.closed
    ? "bg-amber-500/10 text-amber-500"
    : "bg-emerald-500/10 text-emerald-500";

  const totals = [
    {
      label: "Total materials",
      value: box.ind_tapes.length,
      style: "text-dashboard-text"
    },
    {
      label: "Video",
      value: box.ind_tapes.filter((tape) => tape.media_type === "video").length,
      style: "text-blue-500"
    },
    {
      label: "Audio",
      value: box.ind_tapes.filter((tape) => tape.media_type === "audio").length,
      style: "text-purple-500"
    },
    {
      label: "Photo",
      value: box.ind_tapes.filter((tape) => tape.media_type === "photo").length,
      style: "text-pink-500"
    },
    {
      label: "Document",
      value: box.ind_tapes.filter((tape) => tape.media_type === "document")
        .length,
      style: "text-orange-500"
    }
  ];

  return (
    <section dir="ltr" className="min-w-0 space-y-6 text-dashboard-text">
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
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-500"
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

          {isAdmin && (
            <button
              type="button"
              disabled={!canAdd || saving}
              onClick={() => {
                setSaveError(null);
                setShowAddTape(true);
              }}
              className="dashboard-btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} aria-hidden="true" />
              Add tape
            </button>
          )}
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {totals.map((item) => (
          <div key={item.label} className="dashboard-card p-4">
            <dt className="text-xs text-dashboard-muted">{item.label}</dt>
            <dd className={`mt-2 text-2xl font-semibold ${item.style}`}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {!boxOpen && (
        <p className="rounded-lg bg-dashboard-hover p-4 text-sm text-dashboard-muted">
          This box is {status.toLowerCase()}. Adding tapes is disabled.
        </p>
      )}

      <div className="min-w-0">
        <TapeBoard tapes={box.ind_tapes} />
      </div>

      <CreateTapeModal
        open={showAddTape && canAdd}
        boxId={boxId}
        busy={saving}
        error={saveError}
        onCancel={() => {
          if (lock.current) return;

          setShowAddTape(false);
          setSaveError(null);
        }}
        onSubmit={addTape}
      />
    </section>
  );
}
