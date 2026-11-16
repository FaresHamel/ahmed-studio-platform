"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  Package,
  Plus,
  RefreshCw,
  Trash2,
  Truck,
  UnlockKeyhole,
  FileText,
  Image as ImageIcon,
  Layers3,
  Music2,
  Video
} from "lucide-react";
import toast from "react-hot-toast";

import TapeBoard from "@/components/dashboard/individual/TapeBoard";
import { CreateTapeModal } from "@/components/dashboard/individual/CreateTapeForm";
import BoxActionModal, {
  type BoxAction
} from "@/components/dashboard/individual/BoxActionModal";
import { useIndividualBox } from "@/hooks/individual/useIndividualBox";
import { individualError } from "@/hooks/individual/useIndividualJob";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import type { TapeInput } from "@/types/production-api";
import BoxActivity from "@/components/dashboard/individual/BoxActivity";
interface Props {
  boxId: string;
}

const ACTION_MESSAGES: Record<BoxAction, string> = {
  close: "Box closed. Production can continue.",
  reopen: "Box reopened.",
  delete: "Box deleted.",
  ship: "Box and its materials shipped."
};
const BUTTON_BASE = `
  inline-flex min-h-10 items-center justify-center gap-2
  whitespace-nowrap rounded-lg px-4 py-2
  text-[13px] font-medium transition-colors
  focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-dashboard-focus
  disabled:pointer-events-none disabled:opacity-40
`;

const PRIMARY_BUTTON = `
  ${BUTTON_BASE}
  border border-slate-900 bg-slate-900 text-white
  hover:border-slate-700 hover:bg-slate-700
  active:bg-slate-800
  dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950
  dark:hover:border-white dark:hover:bg-white
  dark:active:bg-slate-200
`;

const SECONDARY_BUTTON = `
  ${BUTTON_BASE}
  border border-slate-200 bg-white text-slate-700
  hover:border-slate-300 hover:bg-slate-50
  active:bg-slate-100
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200
  dark:hover:border-slate-600 dark:hover:bg-slate-800
  dark:active:bg-slate-700
`;

const DELETE_BUTTON = `
  ${BUTTON_BASE}
  border border-transparent bg-transparent text-red-700
  hover:border-red-200 hover:bg-red-50
  active:bg-red-100
  dark:text-red-400
  dark:hover:border-red-500/30 dark:hover:bg-red-500/10
  dark:active:bg-red-500/20
`;
export default function IndividualBoxDetailsContainer({ boxId }: Props) {
  const router = useRouter();

  const { box, loading, refreshing, error, refresh } = useIndividualBox(boxId);

  const user = useAuthStore((state) => state.user);

  const [showAddTape, setShowAddTape] = useState(false);
  const [action, setAction] = useState<BoxAction | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [needsReload, setNeedsReload] = useState(false);

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
    setAction(null);
    setSaveError(null);
    setActionError(null);
    setNeedsReload(false);
  }, [boxId, user?.id]);

  function isCurrentContext(requestedBoxId: string, actorId: string) {
    return (
      mounted.current &&
      currentBoxId.current === requestedBoxId &&
      useAuthStore.getState().user?.id === actorId
    );
  }

  async function retryLoadBox() {
    const requestedBoxId = boxId;
    const actorId = useAuthStore.getState().user?.id;

    try {
      await refresh();

      if (actorId && isCurrentContext(requestedBoxId, actorId)) {
        setNeedsReload(false);
      }
    } catch {
      // The hook exposes the request error.
    }
  }

  async function addTape(input: TapeInput) {
    const actor = useAuthStore.getState().user;
    const requestedBoxId = boxId;

    if (lock.current) {
      throw new Error("A save is already in progress.");
    }

    if (!actor?.roles.includes("admin")) {
      throw new Error("Only admins can add tapes.");
    }

    if (
      needsReload ||
      error ||
      refreshing ||
      !box ||
      box.id !== requestedBoxId ||
      box.closed ||
      box.shipped_at
    ) {
      throw new Error(
        "Refresh the box and confirm it is open before adding a tape."
      );
    }

    lock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      let tape;

      try {
        tape = await individualService.addTape(requestedBoxId, input);
      } catch (failure) {
        if (isCurrentContext(requestedBoxId, actor.id)) {
          setSaveError(individualError(failure, "Could not add the tape."));
        }

        throw failure;
      }

      if (!isCurrentContext(requestedBoxId, actor.id)) return;

      toast.success(`Tape ${input.tape_code || tape.id} added.`);
      setShowAddTape(false);
      setSaveError(null);

      try {
        await refresh();

        if (isCurrentContext(requestedBoxId, actor.id)) {
          setNeedsReload(false);
        }
      } catch {
        if (isCurrentContext(requestedBoxId, actor.id)) {
          setNeedsReload(true);
          toast.error(
            "Tape added, but the board could not refresh. Reload the box."
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

  function openAction(next: BoxAction) {
    if (lock.current || refreshing || needsReload || error) return;

    setShowAddTape(false);
    setActionError(null);
    setAction(next);
  }

  function closeAction() {
    if (lock.current) return;

    setAction(null);
    setActionError(null);
  }

  async function confirmAction(reason: string) {
    const selectedAction = action;
    const actor = useAuthStore.getState().user;
    const requestedBoxId = boxId;

    if (lock.current || !selectedAction) return;

    if (!actor?.roles.includes("admin")) {
      setActionError("Only admins can perform these box actions.");
      return;
    }

    if (
      !box ||
      box.id !== requestedBoxId ||
      box.shipped_at ||
      refreshing ||
      needsReload ||
      error
    ) {
      setActionError(
        "This box is unavailable or has changed. Close this dialog and refresh."
      );
      return;
    }

    if (selectedAction === "close" && box.closed) {
      setActionError("This box is already closed.");
      return;
    }

    if (
      (selectedAction === "reopen" || selectedAction === "ship") &&
      !box.closed
    ) {
      setActionError("This action requires a closed box.");
      return;
    }

    if (selectedAction === "reopen" && !reason.trim()) {
      setActionError("Enter a reason for reopening.");
      return;
    }

    if (
      selectedAction === "delete" &&
      (box.closed || box.ind_tapes.length > 0)
    ) {
      setActionError("Only an open, empty box can be deleted.");
      return;
    }

    const hasActiveTimer = box.ind_tapes.some((tape) =>
      tape.stage_timings?.some(
        (timing) => timing.status === "running" || timing.status === "paused"
      )
    );

    if (
      selectedAction === "ship" &&
      (box.ind_tapes.length === 0 ||
        box.ind_tapes.some((tape) => tape.current_station !== "ready") ||
        hasActiveTimer)
    ) {
      setActionError(
        "Every material must be Ready, with no running or paused work."
      );
      return;
    }

    const jobUrl = `/dashboard/admin/individual/${encodeURIComponent(
      box.client_id
    )}`;

    lock.current = true;
    setSaving(true);
    setActionError(null);

    try {
      try {
        switch (selectedAction) {
          case "close":
            await individualService.closeBox(requestedBoxId);
            break;

          case "reopen":
            await individualService.reopenBox(requestedBoxId, reason.trim());
            break;

          case "delete":
            await individualService.removeBox(requestedBoxId);
            break;

          case "ship":
            await individualService.shipBox(requestedBoxId);
            break;
        }
      } catch (failure) {
        if (isCurrentContext(requestedBoxId, actor.id)) {
          setActionError(individualError(failure, "Could not update the box."));
        }

        return;
      }

      if (!isCurrentContext(requestedBoxId, actor.id)) return;

      toast.success(ACTION_MESSAGES[selectedAction]);
      setAction(null);

      if (selectedAction === "delete") {
        router.replace(jobUrl);
        return;
      }

      try {
        await refresh();

        if (isCurrentContext(requestedBoxId, actor.id)) {
          setNeedsReload(false);
        }
      } catch {
        if (isCurrentContext(requestedBoxId, actor.id)) {
          setNeedsReload(true);
          toast.error(
            "The change was saved, but the box could not refresh. Reload the box."
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

  if (!box) {
    return (
      <section className="dashboard-card space-y-4 p-6">
        <p role="alert" className="text-sm text-dashboard-red">
          {error || "Box not found."}
        </p>

        <button
          type="button"
          disabled={refreshing}
          onClick={retryLoadBox}
          className="dashboard-btn-secondary"
        >
          {refreshing ? "Loading…" : "Try again"}
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

  const isAdmin = Boolean(user?.roles.includes("admin"));
  const shipped = Boolean(box.shipped_at);
  const boxOpen = !box.closed && !shipped;
  const blocked = saving || refreshing || needsReload || Boolean(error);

  const materialCount = box.ind_tapes.length;

  const readyCount = box.ind_tapes.filter(
    (tape) => tape.current_station === "ready"
  ).length;

  const activeWorkCount = box.ind_tapes.filter((tape) =>
    tape.stage_timings?.some(
      (timing) => timing.status === "running" || timing.status === "paused"
    )
  ).length;

  const canShip =
    isAdmin &&
    box.closed &&
    !shipped &&
    materialCount > 0 &&
    readyCount === materialCount &&
    activeWorkCount === 0;

  const status = shipped ? "Shipped" : box.closed ? "Closed" : "Open";

  const badgeClass = shipped
    ? "bg-dashboard-blue-soft text-dashboard-blue"
    : box.closed
    ? "bg-dashboard-amber-soft text-dashboard-amber"
    : "bg-dashboard-green-soft text-dashboard-green";

const totals = [
  {
    label: "Total materials",
    value: materialCount,
    icon: Layers3,
    color: "text-dashboard-blue",
    background: "bg-dashboard-surface",
    // Highlighted summary card: filled blue with a blue outline
    card: "bg-dashboard-blue-soft ring-1 ring-inset ring-dashboard-blue/30"
  },
  {
    label: "Video",
    value: box.ind_tapes.filter((tape) => tape.media_type === "video").length,
    icon: Video,
    color: "text-dashboard-blue",
    background: "bg-dashboard-blue-soft",
    card: ""
  },
  {
    label: "Audio",
    value: box.ind_tapes.filter((tape) => tape.media_type === "audio").length,
    icon: Music2,
    color: "text-dashboard-purple",
    background: "bg-dashboard-purple-soft",
    card: ""
  },
  {
    label: "Photo",
    value: box.ind_tapes.filter((tape) => tape.media_type === "photo").length,
    icon: ImageIcon,
    color: "text-dashboard-red",
    background: "bg-dashboard-red-soft",
    card: ""
  },
  {
    label: "Document",
    value: box.ind_tapes.filter((tape) => tape.media_type === "document")
      .length,
    icon: FileText,
    color: "text-dashboard-orange",
    background: "bg-dashboard-orange-soft",
    card: ""
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
            className="
              flex size-12 shrink-0 items-center justify-center
              rounded-xl border border-dashboard-border
              bg-dashboard-orange-soft text-dashboard-orange
            "
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
            className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && boxOpen && (
              <>
                <button
                  type="button"
                  disabled={blocked}
                  onClick={() => {
                    setSaveError(null);
                    setShowAddTape(true);
                  }}
                  className={PRIMARY_BUTTON}
                >
                  <Plus size={15} aria-hidden="true" />
                  Add tape
                </button>

                <button
                  type="button"
                  disabled={blocked}
                  onClick={() => openAction("close")}
                  className={SECONDARY_BUTTON}
                >
                  <LockKeyhole size={15} aria-hidden="true" />
                  Close box
                </button>
              </>
            )}

            {isAdmin && box.closed && !shipped && (
              <>
                <button
                  type="button"
                  disabled={blocked || !canShip}
                  onClick={() => openAction("ship")}
                  className={PRIMARY_BUTTON}
                >
                  <Truck size={15} aria-hidden="true" />
                  Ship box
                </button>

                <button
                  type="button"
                  disabled={blocked}
                  onClick={() => openAction("reopen")}
                  className={SECONDARY_BUTTON}
                >
                  <UnlockKeyhole size={15} aria-hidden="true" />
                  Reopen box
                </button>
              </>
            )}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={saving || refreshing}
              onClick={retryLoadBox}
              aria-busy={refreshing}
              className={SECONDARY_BUTTON}
            >
              <RefreshCw
                size={15}
                aria-hidden="true"
                className={
                  refreshing ? "animate-spin motion-reduce:animate-none" : ""
                }
              />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>

            {isAdmin && boxOpen && materialCount === 0 && (
              <button
                type="button"
                disabled={blocked}
                onClick={() => openAction("delete")}
                className={DELETE_BUTTON}
              >
                <Trash2 size={15} aria-hidden="true" />
                Delete box
              </button>
            )}
          </div>
        </div>
      </header>

      {(error || needsReload) && (
        <p
          role="alert"
          className="rounded-lg bg-dashboard-amber-soft p-4 text-sm text-dashboard-amber"
        >
          {error || "Refresh the box before making more changes."}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-1 lg:grid-cols-5">
        {totals.map((item) => {
          const Icon = item.icon;
          const highlighted = item.card !== "";

          return (
            <div key={item.label} className={`dashboard-card p-4 ${item.card}`}>
              <dt className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`
              flex size-8 shrink-0 items-center justify-center
              rounded-lg ${item.background} ${item.color}
              ${highlighted ? "ring-1 ring-inset ring-dashboard-border" : ""}
            `}
                >
                  <Icon size={16} strokeWidth={1.8} />
                </span>

                <span className="text-xs text-dashboard-muted">
                  {item.label}
                </span>
              </dt>

              <dd
                className={`
            mt-3 text-2xl font-semibold tabular-nums ${item.color}
          `}
              >
                {item.value}
              </dd>
            </div>
          );
        })}
      </dl>

      <section className="dashboard-card space-y-3 p-4">
        <h2 className="text-sm font-semibold">
          {shipped ? "Shipment" : "Production readiness"}
        </h2>

        {shipped ? (
          <p className="text-sm leading-6 text-dashboard-muted">
            This box and its materials are Shipped. Intake and production
            changes are locked.
          </p>
        ) : (
          <>
            <p className="text-sm text-dashboard-muted">
              <span className="font-medium text-dashboard-green">
                {readyCount}
              </span>
              {" of "}
              {materialCount} materials Ready.
              {activeWorkCount > 0 && (
                <> {activeWorkCount} materials have running or paused work.</>
              )}
            </p>

            <p className="text-xs leading-5 text-dashboard-muted">
              {materialCount === 0
                ? "An empty box cannot be shipped."
                : boxOpen
                ? "Close the box when intake is complete. Closing locks the box. Reopen it to make changes."
                : canShip
                ? "All materials are Ready. You can ship this box."
                : "Intake is closed. Complete all production work and move every material to Ready before shipping."}
            </p>
          </>
        )}
      </section>

      <div className="min-w-0">
        <TapeBoard
          key={boxId}
          boxId={boxId}
          boxOpen={boxOpen && !blocked}
          tapes={box.ind_tapes}
          onAssigned={refresh}
        />
      </div>
      <BoxActivity
        events={box.activity ?? []}
        hasMore={box.activity_has_more}
      />

      <CreateTapeModal
        open={showAddTape && isAdmin && boxOpen}
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

      {action && isAdmin && (
        <BoxActionModal
          key={`${boxId}-${action}`}
          action={action}
          boxId={boxId}
          materialCount={materialCount}
          busy={saving}
          error={actionError}
          onClose={closeAction}
          onConfirm={confirmAction}
        />
      )}
    </section>
  );
}
