"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRightLeft,
  CalendarDays,
  Hash,
  RefreshCw,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTapeDetails } from "@/hooks/individual/useTapeDetails";
import { individualError } from "@/hooks/individual/useIndividualJob";
import { useAuthStore } from "@/store/auth.store";
import {
  dateTime,
  display,
  personName
} from "@/lib/individual/tape-details-display";
import { stageLabel } from "@/lib/individual/tape-workflow";
import AssignmentModal from "@/components/dashboard/individual/AssignmentModal";
import ChangeTapeStageModal from "@/components/dashboard/individual/ChangeTapeStageModal";
import TapeTimerControls from "@/components/dashboard/individual/details/TapeTimerControls";
import TapeStageHistory from "@/components/dashboard/individual/details/TapeStageHistory";
import TapeSchedule from "@/components/dashboard/individual/details/TapeSchedule";
import ManualStageTiming from "@/components/dashboard/individual/details/ManualStageTiming";
import TapeComments from "@/components/dashboard/individual/details/TapeComments";
import { Badge,  DetailField,
  DetailSection, type RunAction } from "@/components/dashboard/individual/details/DetailPrimitives";
import TapeActivityHistory from "@/components/dashboard/individual/details/TapeActivityHistory";

const knownKeys = new Set([
  "title",
  "internal_ref",
  "country",
  "summary",
  "content_tags",
  "event_date",
  "city",
  "people",
  "singer",
  "musician",
  "words",
  "company",
  "published_date",
  "tape_size",
  "tape_speed"
]);

function PropertyRow({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5 text-sm leading-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5">
      <dt className="text-dashboard-muted">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default function IndividualTapeDetailsContainer({
  tapeId
}: {
  tapeId: string;
}) {
  const { tape, loading, refreshing, error, refresh } = useTapeDetails(tapeId);
  const user = useAuthStore((state) => state.user);
  const admin = Boolean(user?.roles.includes("admin"));
  const staff = Boolean(admin || user?.roles.includes("operator"));
  const [showAssignment, setShowAssignment] = useState(false);
  const [showStage, setShowStage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [needsReload, setNeedsReload] = useState(false);
  const [now, setNow] = useState(0);
  const mounted = useRef(false);
  const actionLock = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setShowAssignment(false);
    setShowStage(false);
    setActionError(null);
    setNeedsReload(false);
  }, [tapeId, user?.id]);

  useEffect(() => {
    if (!tape) return;
    const server = Date.parse(tape.server_now);
    const received = performance.now();
    const tick = () => setNow(server + performance.now() - received);
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [tape?.server_now]);

  const disabled = saving || refreshing || needsReload;

  async function reload() {
    try {
      await refresh();
      if (mounted.current) setNeedsReload(false);
    } catch {
      /* The hook displays the fetch error; previous data stays visible. */
    }
  }

  async function updated() {
    setNeedsReload(true);
    await refresh();
    if (mounted.current) setNeedsReload(false);
  }

  const run: RunAction = async (work, success) => {
    const actorId = useAuthStore.getState().user?.id;
    if (actionLock.current || disabled || !staff || !actorId) return false;
    actionLock.current = true;
    setSaving(true);
    setActionError(null);
    try {
      await work();
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actorId) {
        setActionError(individualError(failure, "Could not save this change."));
      }
      actionLock.current = false;
      if (mounted.current) setSaving(false);
      return false;
    }
    if (mounted.current && useAuthStore.getState().user?.id === actorId) {
      toast.success(success);
      try {
        await updated();
      } catch {
        toast.error(
          "Change saved. Reload the details before making another change."
        );
      }
    }
    actionLock.current = false;
    if (mounted.current) setSaving(false);
    return true;
  };

  if (loading || !tape)
    return (
      <section className="space-y-4 py-8 text-dashboard-text">
        {loading ? (
          <p role="status" className="text-dashboard-muted">
            Loading material…
          </p>
        ) : (
          <>
            <p role="alert" className="text-dashboard-red">
              {error ?? "Material not found."}
            </p>
            <button
              type="button"
              onClick={() => void reload()}
              className="dashboard-btn-secondary"
            >
              Try again
            </button>
            <Link
              href="/dashboard/admin/individual"
              className="block text-sm text-dashboard-blue"
            >
              Back to Individual
            </Link>
          </>
        )}
      </section>
    );

  const metadata = tape.metadata ?? {};
  const shipped = Boolean(
    tape.context.box.shipped_at ||
      tape.status === "shipped" ||
      tape.current_station === "shipped"
  );
  const supported = ["audio", "video"].includes(tape.media_type);
  const currentAssignment = tape.assignments?.find(
    (item) => item.stage === tape.current_station
  );
  const performers = new Map(
    tape.stage_timings
      .filter((item) => item.operator)
      .map((item) => [item.operator!.id, item.operator!])
  );
  const categories = Array.isArray(metadata.content_tags)
    ? metadata.content_tags.filter(
        (item): item is string => typeof item === "string"
      )
    : [];
  const additional = Object.entries(metadata).filter(
    ([key]) => !knownKeys.has(key)
  );
  const job = tape.context.job;
  const customer = tape.context.customer;
  const canSchedule =
    !shipped &&
    Boolean(
      admin ||
        (user?.roles.includes("operator") &&
          tape.assignments?.some((item) => item.operator_id === user.id))
    );

  return (
    <main
      dir="ltr"
      aria-busy={saving}
      className="
    space-y-5 text-dashboard-text
    [&_h1]:capitalize
    [&_h2]:capitalize
    [&_h3]:capitalize
    [&_h4]:capitalize"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/admin/individual/boxes/${encodeURIComponent(
            tape.box_id
          )}`}
          className="inline-flex items-center gap-2 text-sm text-dashboard-muted hover:text-dashboard-text"
        >
          <ArrowLeft size={16} />
          Back to box {tape.box_id}
        </Link>
        <button
          type="button"
          disabled={saving || refreshing}
          onClick={() => void reload()}
          className="dashboard-btn-secondary"
        >
          <RefreshCw size={15} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {(error || actionError || needsReload) && (
        <div
          role="alert"
          className="rounded-lg border border-dashboard-border bg-dashboard-red-soft p-4 text-sm text-dashboard-red"
        >
          {actionError ||
            error ||
            "Reload the details to get the latest state."}
        </div>
      )}

      <section className="rounded-xl border border-dashboard-border bg-dashboard-surface p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-dashboard-muted">
              Material detail
            </p>
            <div className="flex items-start gap-3">
              <h1 className="min-w-0 break-words text-2xl font-semibold capitalize leading-8">
                {metadata.title?.trim() || tape.tape_code || tape.id}
              </h1>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 rounded bg-dashboard-blue-soft px-2 py-1 text-xs text-dashboard-blue">
              <Hash size={13} />
              {tape.tape_code ?? tape.id}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {supported && !shipped && staff && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowStage(true)}
                className="dashboard-btn-secondary"
              >
                <ArrowRightLeft size={15} />
                Change stage
              </button>
            )}
            {admin && supported && !shipped && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowAssignment(true)}
                className="dashboard-btn-secondary"
              >
                <UserRound size={15} />
                Assign operator
              </button>
            )}
          </div>
        </div>
        <dl className="space-y-4">
          <PropertyRow label="Current stage">
            <Badge className="bg-dashboard-blue-soft text-dashboard-blue">
              {stageLabel(tape.current_station)}
            </Badge>
          </PropertyRow>
          <PropertyRow label="Tape status">
            <Badge
              className={
                shipped || tape.status === "ready"
                  ? "bg-dashboard-green-soft text-dashboard-green"
                  : "bg-dashboard-hover text-dashboard-muted"
              }
            >
              {stageLabel(tape.status)}
            </Badge>
          </PropertyRow>
          <PropertyRow label="Assigned at this stage">
            {personName(currentAssignment?.operator, "Unassigned")}
          </PropertyRow>
          <PropertyRow label="People who performed work">
            {performers.size
              ? Array.from(performers.values())
                  .map((person) => personName(person))
                  .join(", ")
              : "No timer operator recorded"}
          </PropertyRow>
          <PropertyRow label="Created">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} className="text-dashboard-muted" />
              {dateTime(tape.created_at)}
            </span>
          </PropertyRow>
          <PropertyRow label="Planned start">
            <Badge className="bg-dashboard-blue-soft text-dashboard-blue">
              {dateTime(tape.planned_start_at)}
            </Badge>
          </PropertyRow>
          <PropertyRow label="Deadline">
            <Badge className="bg-dashboard-amber-soft text-dashboard-amber">
              {dateTime(tape.due_at)}
            </Badge>
          </PropertyRow>
          <PropertyRow label="Categories">
            <div className="flex flex-wrap gap-2">
              {categories.length
                ? categories.map((category) => (
                    <Badge key={category}>{category}</Badge>
                  ))
                : "Not recorded"}
            </div>
          </PropertyRow>
          <PropertyRow label="Description">
            <p className="whitespace-pre-wrap">{display(metadata.summary)}</p>
          </PropertyRow>
        </dl>
      </section>

      <DetailSection title="Customer, Individual job and box">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField title="Customer" value={customer?.name} />
          <DetailField title="Customer type" value={customer?.client_type} />
          <DetailField title="Customer phone" value={customer?.phone} />
          <DetailField title="Customer email" value={customer?.email} />
          <div>
            <dt className="text-xs text-dashboard-muted">Individual job</dt>
            <dd className="mt-1 text-sm">
              {job ? (
                <Link
                  className="text-dashboard-blue hover:underline"
                  href={`/dashboard/admin/individual/${encodeURIComponent(
                    job.id
                  )}`}
                >
                  INV {job.inv_no}
                </Link>
              ) : (
                "Not linked"
              )}
            </dd>
          </div>
          <DetailField title="Job contact" value={job?.name} />
          <DetailField title="Job phone" value={job?.phone} />
          <DetailField title="Job email" value={job?.email} />
          <DetailField title="Box" value={tape.box_id} />
          <DetailField
            title="Box status"
            value={
              tape.context.box.shipped_at
                ? "Shipped"
                : tape.context.box.closed
                ? "Closed"
                : "Open"
            }
          />
          <DetailField
            title="Project"
            value="No project linked — this material belongs to an Individual job"
          />
        </dl>
      </DetailSection>

      <TapeSchedule
        tape={tape}
        disabled={disabled}
        allowed={canSchedule}
        run={run}
      />
      <TapeTimerControls tape={tape} now={now} disabled={disabled} run={run} />
      <TapeStageHistory tape={tape} now={now} />
      {supported && (
        <ManualStageTiming tape={tape} disabled={disabled} run={run} />
      )}
      <TapeComments tape={tape} disabled={disabled} run={run} />

      <DetailSection title="Material information">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField title="Material ID" value={tape.tape_code} />
          <DetailField title="Internal ID" value={tape.id} />
          <DetailField title="Barcode" value={tape.barcode} />
          <DetailField title="Media" value={stageLabel(tape.media_type)} />
          <DetailField title="Format" value={tape.format} />
          <DetailField
            title="Internal reference"
            value={metadata.internal_ref}
          />
          <DetailField title="Country" value={metadata.country} />
          {supported && (
            <DetailField title="Capacity (minutes)" value={tape.capacity} />
          )}
          {tape.audio_track !== null && (
            <DetailField title="Audio tracks" value={tape.audio_track} />
          )}
          {tape.media_type === "video" && (
            <DetailField title="Color system" value={tape.color_system} />
          )}
          {["photo", "document"].includes(tape.media_type) && (
            <DetailField title="Size" value={tape.photo_size} />
          )}
          {["video", "photo"].includes(tape.media_type) && (
            <>
              <DetailField
                title="Original event date"
                value={metadata.event_date}
              />
              <DetailField title="City" value={metadata.city} />
              <DetailField title="People" value={metadata.people} />
            </>
          )}
          {tape.media_type === "audio" && (
            <>
              <DetailField title="Singer" value={metadata.singer} />
              <DetailField title="Musician" value={metadata.musician} />
              <DetailField title="Words / lyricist" value={metadata.words} />
              <DetailField title="Company" value={metadata.company} />
              <DetailField
                title="Published date"
                value={metadata.published_date}
              />
              <DetailField
                title="Tape / disc size"
                value={metadata.tape_size}
              />
              <DetailField
                title={tape.format === "Vinyl" ? "Speed (RPM)" : "Speed (IPS)"}
                value={metadata.tape_speed}
              />
            </>
          )}
          <DetailField
            title="Picture storage reference"
            value={tape.picture_key}
          />
          {additional.map(([key, value]) => (
            <DetailField key={key} title={stageLabel(key)} value={value} />
          ))}
        </dl>
      </DetailSection>

      <DetailSection title="Activity and change authors">
        <TapeActivityHistory tape={tape} />
      </DetailSection>

      {showAssignment && admin && (
        <AssignmentModal
          key={tape.id}
          tape={tape}
          onClose={() => setShowAssignment(false)}
          onAssigned={updated}
        />
      )}
      {showStage && staff && (
        <ChangeTapeStageModal
          key={tape.id}
          tape={tape}
          onClose={() => setShowStage(false)}
          onUpdated={updated}
        />
      )}
    </main>
  );
}
