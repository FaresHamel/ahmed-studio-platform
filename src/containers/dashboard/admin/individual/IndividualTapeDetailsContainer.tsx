"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRightLeft, Clapperboard, Hash, RefreshCw, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTapeDetails } from '@/hooks/individual/useTapeDetails';
import { individualError } from '@/hooks/individual/useIndividualJob';
import { useAuthStore } from '@/store/auth.store';
import { dateTime, display, duration, personName, timingSeconds } from '@/lib/individual/tape-details-display';
import { stageLabel } from '@/lib/individual/tape-workflow';
import AssignmentModal from '@/components/dashboard/individual/AssignmentModal';
import ChangeTapeStageModal from '@/components/dashboard/individual/ChangeTapeStageModal';
import TapeTimerControls from '@/components/dashboard/individual/details/TapeTimerControls';
import TapeStageHistory from '@/components/dashboard/individual/details/TapeStageHistory';
import TapeSchedule from '@/components/dashboard/individual/details/TapeSchedule';
import ManualStageTiming from '@/components/dashboard/individual/details/ManualStageTiming';
import TapeComments from '@/components/dashboard/individual/details/TapeComments';
import TapeDetailsTabs from '@/components/dashboard/individual/details/TapeDetailsTabs';
import TapeActivityHistory from '@/components/dashboard/individual/details/TapeActivityHistory';
import { Badge, DetailField, DetailSection, type RunAction } from '@/components/dashboard/individual/details/DetailPrimitives';

const knownKeys = new Set([
  'title', 'internal_ref', 'country', 'summary', 'content_tags', 'event_date',
  'city', 'people', 'singer', 'musician', 'words', 'company', 'published_date', 'tape_size', 'tape_speed',
]);

export default function IndividualTapeDetailsContainer({ tapeId }: { tapeId: string }) {
  const { tape, loading, refreshing, error, refresh } = useTapeDetails(tapeId);
  const user = useAuthStore((state) => state.user);
  const admin = Boolean(user?.roles.includes('admin'));
  const staff = Boolean(admin || user?.roles.includes('operator'));
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
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    setShowAssignment(false); setShowStage(false); setActionError(null); setNeedsReload(false);
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
    try { await refresh(); if (mounted.current) setNeedsReload(false); }
    catch { /* The hook displays the fetch error; previous data stays visible. */ }
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
    setSaving(true); setActionError(null);
    try {
      await work();
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actorId) {
        setActionError(individualError(failure, 'Could not save this change.'));
      }
      actionLock.current = false;
      if (mounted.current) setSaving(false);
      return false;
    }
    if (mounted.current && useAuthStore.getState().user?.id === actorId) {
      toast.success(success);
      try { await updated(); }
      catch { toast.error('Change saved. Reload the details before making another change.'); }
    }
    actionLock.current = false;
    if (mounted.current) setSaving(false);
    return true;
  };

  if (loading || !tape) return <section className="space-y-4 py-8 text-dashboard-text">
    {loading ? <p role="status" className="text-dashboard-muted">Loading material…</p> : <>
      <p role="alert" className="text-dashboard-red">{error ?? 'Material not found.'}</p>
      <button type="button" onClick={() => void reload()} className="dashboard-btn-secondary">Try again</button>
      <Link href="/dashboard/admin/individual" className="block text-sm text-dashboard-blue">Back to Individual</Link>
    </>}
  </section>;

  const metadata = tape.metadata ?? {};
  const shipped = Boolean(tape.context.box.shipped_at || tape.status === 'shipped' || tape.current_station === 'shipped');
  const supported = ['audio', 'video'].includes(tape.media_type);
  const currentAssignment = tape.assignments?.find((item) => item.stage === tape.current_station);
  const performers = new Map(tape.stage_timings.filter((item) => item.operator).map((item) => [item.operator!.id, item.operator!]));
  const categories = Array.isArray(metadata.content_tags) ? metadata.content_tags.filter((item): item is string => typeof item === 'string') : [];
  const active = tape.stage_timings.find((item) => item.status === 'running' || item.status === 'paused');
  const additional = Object.entries(metadata).filter(([key]) => !knownKeys.has(key));
  const job = tape.context.job;
  const customer = tape.context.customer;
  const canSchedule = !shipped && Boolean(admin || (user?.roles.includes('operator') && tape.assignments?.some((item) => item.operator_id === user.id)));
  const boxLocked =
    tape.context.box.closed ||
    Boolean(tape.context.box.shipped_at) ||
    tape.status === "shipped" ||
    tape.current_station === "shipped";
  return (
    <main
      dir="ltr"
      aria-busy={saving}
      className="space-y-5 rounded-xl bg-dashboard-bg p-3 text-[13px] leading-6 text-dashboard-text sm:p-5 [&_h1]:capitalize [&_h2]:capitalize [&_h3]:capitalize [&_h4]:capitalize"
    >
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/dashboard/admin/individual/boxes/${encodeURIComponent(
              tape.box_id
            )}`}
            className="inline-flex items-center gap-1.5 text-xs text-dashboard-muted transition-colors hover:text-dashboard-text"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to box {tape.box_id}
          </Link>
          <button
            type="button"
            disabled={saving || refreshing}
            onClick={() => void reload()}
            className="dashboard-btn-secondary !min-h-9 !px-3 !py-1.5 !text-xs"
          >
            <RefreshCw size={14} aria-hidden="true" />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
          <div className="flex min-w-0 items-start gap-3">
            <div className="min-w-0">
              <h1 className="break-words text-xl font-semibold leading-7">
                {metadata.title?.trim() || tape.tape_code || tape.id}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dashboard-muted">
                <span className="inline-flex items-center gap-1 text-dashboard-blue">
                  <Hash size={12} aria-hidden="true" />
                  {tape.tape_code ?? tape.id}
                </span>
                <span>
                  {stageLabel(tape.media_type)} · {tape.format}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {supported && !shipped && staff && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowStage(true)}
                className="dashboard-btn-secondary !min-h-9 !px-3 !py-1.5 !text-xs"
              >
                <ArrowRightLeft size={14} aria-hidden="true" />
                Change stage
              </button>
            )}
            {admin && supported && !shipped && !boxLocked && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowAssignment(true)}
                className="dashboard-btn-secondary !min-h-9 !px-3 !py-1.5 !text-xs"
              >
                <UserRound size={14} aria-hidden="true" />
                Assign operator
              </button>
            )}
          </div>
        </div>
      </header>

      {tape.context.box.closed && !tape.context.box.shipped_at && (
        <p className="rounded-lg bg-dashboard-amber-soft p-4 text-sm text-dashboard-amber">
          This box is closed. Reopen it from Box details to make changes.
        </p>
      )}

      {(error || actionError || needsReload) && (
        <div
          role="alert"
          className="rounded-lg border border-dashboard-border bg-dashboard-red-soft p-4 text-[13px] text-dashboard-red"
        >
          {actionError ||
            error ||
            "Reload the details to get the latest state."}
        </div>
      )}

      <TapeDetailsTabs
        key={tape.id}
        overview={
          <>
            <div className="grid items-start gap-5 lg:grid-cols-2">
              <DetailSection title="Material overview">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <DetailField
                    title="Material ID"
                    value={tape.tape_code ?? tape.id}
                  />
                  <DetailField
                    title="Created"
                    value={dateTime(tape.created_at)}
                  />
                  <DetailField
                    title="Media type"
                    value={stageLabel(tape.media_type)}
                  />
                  <DetailField title="Format" value={tape.format} />
                  <DetailField title="Country" value={metadata.country} />
                  <DetailField
                    title="Internal reference"
                    value={metadata.internal_ref}
                  />
                  <div>
                    <dt className="text-[13px] text-dashboard-muted">
                      Tape status
                    </dt>
                    <dd className="mt-1">
                      <Badge
                        className={
                          shipped || tape.status === "ready"
                            ? "bg-dashboard-green-soft text-dashboard-green"
                            : "bg-dashboard-blue-soft text-dashboard-blue"
                        }
                      >
                        {stageLabel(tape.status)}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-dashboard-muted">
                      Categories
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {categories.length
                        ? categories.map((category) => (
                            <Badge key={category}>{category}</Badge>
                          ))
                        : "Not recorded"}
                    </dd>
                  </div>
                </dl>
              </DetailSection>
              <DetailSection title="Customer and Individual job">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <DetailField title="Customer" value={customer?.name} />
                  <DetailField
                    title="Customer type"
                    value={customer?.client_type}
                  />
                  <DetailField title="Customer email" value={customer?.email} />
                  <DetailField title="Customer phone" value={customer?.phone} />
                  <div>
                    <dt className="text-[13px] text-dashboard-muted">
                      Individual job
                    </dt>
                    <dd className="mt-1">
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
                  <div>
                    <dt className="text-[13px] text-dashboard-muted">Box</dt>
                    <dd className="mt-1">
                      <Link
                        className="text-dashboard-blue hover:underline"
                        href={`/dashboard/admin/individual/boxes/${encodeURIComponent(
                          tape.box_id
                        )}`}
                      >
                        {tape.box_id}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-dashboard-muted">
                      Box status
                    </dt>
                    <dd className="mt-1">
                      <Badge
                        className={
                          tape.context.box.shipped_at
                            ? "bg-dashboard-blue-soft text-dashboard-blue"
                            : tape.context.box.closed
                            ? "bg-dashboard-amber-soft text-dashboard-amber"
                            : "bg-dashboard-green-soft text-dashboard-green"
                        }
                      >
                        {tape.context.box.shipped_at
                          ? "Shipped"
                          : tape.context.box.closed
                          ? "Closed"
                          : "Open"}
                      </Badge>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <DetailField
                      title="Project"
                      value="Not linked — Individual job workflow"
                    />
                  </div>
                </dl>
              </DetailSection>
            </div>

            <DetailSection title="Production overview">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg border border-dashboard-border bg-dashboard-hover p-4">
                  <p className="text-[13px] text-dashboard-muted">
                    Current stage
                  </p>
                  <p className="mt-2 text-base font-semibold">
                    {stageLabel(tape.current_station)}
                  </p>
                  <p className="mt-3 text-xs text-dashboard-muted">
                    Tape status: {stageLabel(tape.status)}
                  </p>
                </div>
                <div className="rounded-lg border border-dashboard-border bg-dashboard-hover p-4">
                  <p className="text-[13px] text-dashboard-muted">
                    Assigned at this stage
                  </p>
                  <p className="mt-2 break-words text-base font-semibold">
                    {personName(currentAssignment?.operator, "Unassigned")}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-dashboard-muted">
                    Performed work:{" "}
                    {performers.size
                      ? Array.from(performers.values())
                          .map((person) => personName(person))
                          .join(", ")
                      : "No timer operator recorded"}
                  </p>
                </div>
                <div className="rounded-lg border border-dashboard-border bg-dashboard-hover p-4">
                  <p className="text-[13px] text-dashboard-muted">
                    Current work timer
                  </p>
                  <p className="mt-2 font-mono text-base font-semibold tabular-nums">
                    {active
                      ? duration(timingSeconds(active, now, tape.server_now))
                      : "No active timer"}
                  </p>
                  <p className="mt-3 text-xs text-dashboard-muted">
                    {active
                      ? `${stageLabel(active.status)} · ${personName(
                          active.operator
                        )}`
                      : "Controls are in the Production tab"}
                  </p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Material description">
              <p className="whitespace-pre-wrap break-words text-[13px] leading-6">
                {display(metadata.summary)}
              </p>
            </DetailSection>
            <TapeSchedule
              tape={tape}
              disabled={disabled}
              allowed={canSchedule}
              run={run}
            />
            <DetailSection title="Technical information" defaultOpen={false}>
              <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField title="Internal ID" value={tape.id} />
                <DetailField title="Barcode" value={tape.barcode} />
                {supported && (
                  <DetailField
                    title="Capacity (minutes)"
                    value={tape.capacity}
                  />
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
                    <DetailField
                      title="Words / lyricist"
                      value={metadata.words}
                    />
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
                      title={
                        tape.format === "Vinyl" ? "Speed (RPM)" : "Speed (IPS)"
                      }
                      value={metadata.tape_speed}
                    />
                  </>
                )}
                <DetailField
                  title="Picture storage reference"
                  value={tape.picture_key}
                />
                {additional.map(([key, value]) => (
                  <DetailField
                    key={key}
                    title={stageLabel(key)}
                    value={value}
                  />
                ))}
              </dl>
            </DetailSection>
          </>
        }
        production={
          <>
            <TapeTimerControls
              tape={tape}
              now={now}
              disabled={disabled}
              run={run}
            />
            <TapeStageHistory tape={tape} now={now} />
            {supported && (
              <ManualStageTiming tape={tape} disabled={disabled} run={run} />
            )}
          </>
        }
        comments={<TapeComments tape={tape} disabled={disabled} run={run} />}
        activity={<TapeActivityHistory tape={tape} />}
      />
      {showAssignment && admin && !boxLocked && (
        <AssignmentModal
          key={`assignment-${tape.id}`}
          tape={tape}
          onClose={() => setShowAssignment(false)}
          onAssigned={updated}
        />
      )}

      {showStage && staff && !boxLocked && (
        <ChangeTapeStageModal
          key={`stage-${tape.id}`}
          tape={tape}
          onClose={() => setShowStage(false)}
          onUpdated={updated}
        />
      )}
    </main>
  );
}
