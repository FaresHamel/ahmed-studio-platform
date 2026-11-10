"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";

import { individualService } from "@/services/individual.service";
import { individualError } from "@/hooks/individual/useIndividualJob";
import { useAuthStore } from "@/store/auth.store";
import type {
  IndividualTapeDetails,
  Station,
  TapeSummary,
  TapeWorkResult
} from "@/types/production-api";
import {
  canOperateStage,
  movementOptions,
  PRODUCTION_STAGES,
  STATION_ORDER,
  stageLabel
} from "@/lib/individual/tape-workflow";

interface Props {
  tape: TapeSummary;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}

const selectClass = "dashboard-input min-h-12 appearance-none py-3 pl-3 pr-10";

function SelectArrow() {
  return (
    <ChevronDown
      size={16}
      aria-hidden="true"
      className="
        pointer-events-none absolute right-3 top-1/2
        -translate-y-1/2 text-dashboard-muted
      "
    />
  );
}

export default function ChangeTapeStageModal({
  tape,
  onClose,
  onUpdated
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mounted = useRef(false);
  const lock = useRef(false);
  const id = useId();

  const user = useAuthStore((state) => state.user);
  const isAdmin = Boolean(user?.roles.includes("admin"));
  const isOperator = Boolean(user?.roles.includes("operator"));

  const [record, setRecord] = useState<IndividualTapeDetails | null>(null);
  const [result, setResult] = useState<TapeWorkResult>("OK");
  const [destination, setDestination] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    mounted.current = true;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    document.body.style.overflow = "hidden";

    return () => {
      mounted.current = false;
      document.body.style.overflow = previousOverflow;

      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setRecord(null);
    setDestination("");
    setResult("OK");
    setNote("");

    async function loadTape() {
      try {
        const data = await individualService.getTape(
          tape.id,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setRecord(data);
        }
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(individualError(failure, "Could not load this tape."));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTape();

    return () => controller.abort();
  }, [tape.id, user?.id, reload]);

  const activeTimer = Boolean(
    record?.stage_timings?.some(
      (timing) => timing.status === "running" || timing.status === "paused"
    )
  );

  const accessStage =
    record?.current_station === "received"
      ? "inspected"
      : record?.current_station;

  const assignment = record?.assignments?.find(
    (item) => item.stage === accessStage && item.operator_id === user?.id
  );

  const assignableStage = PRODUCTION_STAGES.find(
    (stage) => stage === accessStage
  );

  const operatorAllowed = Boolean(
    isOperator &&
      assignment &&
      assignment.operator.status === "active" &&
      assignableStage &&
      record &&
      canOperateStage(
        assignment.operator.profiles?.operator_type,
        assignableStage,
        record.media_type
      )
  );

  const supportedMedia = Boolean(
    record && ["audio", "video"].includes(record.media_type)
  );

  const shipped =
    record?.status === "shipped" || record?.current_station === "shipped";

  const canMove = Boolean(
    record &&
      supportedMedia &&
      !shipped &&
      !activeTimer &&
      (isAdmin || operatorAllowed)
  );

  const options = record
    ? movementOptions(record.current_station, result, isAdmin)
    : [];

  const validDestination = options.find(
    (stage): stage is Exclude<Station, "shipped"> =>
      stage === destination && stage !== "shipped"
  );

  const currentStageIndex = STATION_ORDER.findIndex(
    (stage) => stage === record?.current_station
  );

  const backward = Boolean(
    validDestination &&
      currentStageIndex >= 0 &&
      STATION_ORDER.indexOf(validDestination) < currentStageIndex
  );

  const reasonRequired = backward || result === "NOT_OK";

  const unavailableMessage = shipped
    ? "Shipped tapes cannot change production stage."
    : !supportedMedia
    ? "Production stage changes currently support audio and video only."
    : "Operators need an assignment for the stage being completed and a matching specialty.";

  function close() {
    if (!lock.current) {
      onClose();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const actorId = useAuthStore.getState().user?.id;

    if (
      lock.current ||
      loading ||
      !canMove ||
      !validDestination ||
      !actorId ||
      actorId !== user?.id
    ) {
      return;
    }

    if (reasonRequired && !note.trim()) {
      setError("Enter a reason for this movement.");
      return;
    }

    lock.current = true;
    setSaving(true);
    setError(null);

    try {
      await individualService.transition(tape.id, {
        to_station: validDestination,
        result,
        ...(note.trim() ? { issue_note: note.trim() } : {})
      });
    } catch (failure) {
      lock.current = false;

      if (mounted.current && useAuthStore.getState().user?.id === actorId) {
        setSaving(false);
        setError(individualError(failure, "Could not change stage."));
      } else if (mounted.current) {
        setSaving(false);
      }

      return;
    }

    try {
      if (useAuthStore.getState().user?.id === actorId) {
        toast.success(`Moved to ${stageLabel(validDestination)}.`);

        await onUpdated();
      }
    } catch {
      toast.error("Stage changed. Reload to refresh the board.");
    } finally {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
        onClose();
      }
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg
        overflow-y-auto rounded-xl
        border border-dashboard-border
        bg-dashboard-surface p-6 text-dashboard-text
        shadow-xl backdrop:bg-black/50
      "
    >
      <form
        onSubmit={(event) => void submit(event)}
        aria-busy={loading || saving}
        className="space-y-5"
      >
        <header className="flex items-start justify-between gap-3">
          <div>
            <h2 id={`${id}-title`} className="text-lg font-semibold">
              Change production stage
            </h2>

            <p className="mt-1 break-all text-sm text-dashboard-blue">
              {tape.tape_code ?? tape.id}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={close}
            aria-label="Close stage change"
            className="dashboard-icon-button"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {loading ? (
          <p role="status" className="text-sm text-dashboard-muted">
            Loading current production state…
          </p>
        ) : record ? (
          <>
            <div className="rounded-lg bg-dashboard-hover p-3 text-sm">
              <span className="text-dashboard-muted">Current stage: </span>

              <span className="font-semibold">
                {stageLabel(record.current_station)}
              </span>
            </div>

            {activeTimer && (
              <p
                role="status"
                className="
                  rounded-lg bg-dashboard-amber-soft
                  p-3 text-sm text-dashboard-amber
                "
              >
                Finish or cancel the active timer before changing stage.
              </p>
            )}

            {!activeTimer && !canMove && (
              <p className="text-sm leading-6 text-dashboard-muted">
                {unavailableMessage}
              </p>
            )}

            <fieldset disabled={!canMove || saving} className="space-y-4">
              <label
                htmlFor={`${id}-result`}
                className="block space-y-2 text-sm"
              >
                <span>Current work result</span>

                <div className="relative">
                  <select
                    id={`${id}-result`}
                    value={result}
                    onChange={(event) => {
                      setResult(event.target.value as TapeWorkResult);
                      setDestination("");
                      setError(null);
                    }}
                    className={selectClass}
                  >
                    <option value="OK">OK — work passed</option>

                    <option value="NOT_OK">Not OK — rework required</option>
                  </select>

                  <SelectArrow />
                </div>
              </label>

              <label
                htmlFor={`${id}-destination`}
                className="block space-y-2 text-sm"
              >
                <span>Move to</span>

                <div className="relative">
                  <select
                    id={`${id}-destination`}
                    required
                    value={destination}
                    onChange={(event) => {
                      setDestination(event.target.value);
                      setError(null);
                    }}
                    className={selectClass}
                  >
                    <option value="">Select a stage</option>

                    {options.map((stage) => (
                      <option key={stage} value={stage}>
                        {stageLabel(stage)}
                      </option>
                    ))}
                  </select>

                  <SelectArrow />
                </div>
              </label>

              <label htmlFor={`${id}-note`} className="block space-y-2 text-sm">
                <span>
                  Reason / notes
                  {reasonRequired ? " *" : " (optional)"}
                </span>

                <textarea
                  id={`${id}-note`}
                  required={reasonRequired}
                  maxLength={2000}
                  rows={3}
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value);
                    setError(null);
                  }}
                  placeholder="Explain rework or add a production note"
                  className="dashboard-input resize-y px-3 py-3"
                />
              </label>

              {canMove && options.length === 0 && (
                <p className="text-xs leading-5 text-dashboard-muted">
                  No movement is available for this result. QC failures can
                  return to Cleaning or Ingest. Other backward moves require an
                  admin.
                </p>
              )}
            </fieldset>

            <p className="text-xs leading-5 text-dashboard-muted">
              Changing stage does not start a timer or change assignments.
              Shipping is handled from the box.
            </p>
          </>
        ) : null}

        {error && (
          <p role="alert" className="text-sm text-dashboard-red">
            {error}
          </p>
        )}

        {!loading && (
          <button
            type="button"
            disabled={saving}
            onClick={() => setReload((value) => value + 1)}
            className="
              text-xs text-dashboard-blue
              underline underline-offset-4
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Reload tape
          </button>
        )}

        <footer className="flex justify-end gap-3 border-t border-dashboard-border pt-4">
          <button
            type="button"
            disabled={saving}
            onClick={close}
            className="dashboard-btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || saving || !canMove || !validDestination}
            className="dashboard-btn-primary"
          >
            {saving ? "Moving…" : "Change stage"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
