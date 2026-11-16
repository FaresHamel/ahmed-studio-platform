"use client";

import { useId, useState, type ComponentProps } from "react";
import { ChevronDown, Pause, Play, Square, X } from "lucide-react";

import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import {
  canOperateStage,
  movementOptions,
  PRODUCTION_STAGES,
  STATION_ORDER,
  stageLabel,
  supportsProduction
} from "@/lib/individual/tape-workflow";
import {
  duration,
  personName,
  timingColors,
  timingSeconds
} from "@/lib/individual/tape-details-display";
import type { Station, TapeWorkResult } from "@/types/production-api";
import type { TapeDetails } from "@/types/tape-details";
import {
  Badge,
  DetailSection,
  inputClass,
  type RunAction
} from "./DetailPrimitives";

interface Props {
  tape: TapeDetails;
  now: number;
  disabled: boolean;
  run: RunAction;
}

type TimerAction = "start" | "pause" | "resume" | "cancel" | "finish";

const LABEL_CLASS = "mb-3 block text-[13px] font-medium text-dashboard-text";

const ACTION_MESSAGES: Record<TimerAction, string> = {
  start: "Timer started.",
  pause: "Timer paused.",
  resume: "Timer resumed.",
  cancel: "Attempt cancelled.",
  finish: "Work finished."
};

function TimerSelect({
  children,
  className = "",
  ...props
}: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${inputClass} appearance-none pr-10 ${className}`}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        aria-hidden="true"
        className="
          pointer-events-none absolute right-3 top-1/2
          -translate-y-1/2 text-dashboard-muted
        "
      />
    </div>
  );
}

export default function TapeTimerControls({ tape, now, disabled, run }: Props) {
  const id = useId();
  const user = useAuthStore((state) => state.user);

  const admin = Boolean(user?.roles.includes("admin"));
  const operator = Boolean(user?.roles.includes("operator"));

  const [reason, setReason] = useState("");
  const [result, setResult] = useState<TapeWorkResult>("OK");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);

  const boxLocked =
    tape.context.box.closed ||
    Boolean(tape.context.box.shipped_at) ||
    tape.status === "shipped" ||
    tape.current_station === "shipped";
  
 
  const active = tape.stage_timings.find(
    (item) => item.status === "running" || item.status === "paused"
  );

  const stage = PRODUCTION_STAGES.find((item) => item === tape.current_station);

  const assigned = tape.assignments?.find(
    (item) => item.stage === stage && item.operator_id === user?.id
  );

 const supported = supportsProduction(tape.media_type);

  const shipped = Boolean(
    tape.context.box.shipped_at ||
      tape.status === "shipped" ||
      tape.current_station === "shipped"
  );

  const eligibleOperator = Boolean(
    operator &&
      stage &&
      assigned?.operator.status === "active" &&
      canOperateStage(
        assigned.operator.profiles?.operator_type,
        stage,
        tape.media_type
      )
  );
  const canStart = Boolean(
    !boxLocked && supported && stage && !active && (admin || eligibleOperator)
  );

  const canControl = Boolean(
    !boxLocked &&
      active &&
      active.stage === tape.current_station &&
      (admin || (operator && active.operator_id === user?.id))
  );

  const options = movementOptions(tape.current_station, result, admin);

  const unavailableMessage = shipped
    ? "Production is read-only after shipment."
    : !supported
    ? "Production is unavailable for this media type."
    : !stage
    ? "Move to a production stage before starting work."
    : "An admin or the eligible assigned operator can start this stage.";

  async function act(action: TimerAction) {
    const permitted = action === "start" ? canStart : canControl;

    if (disabled || !permitted) return;

    setError(null);

    const trimmedReason = reason.trim();

    const reasonRequired =
      action === "pause" ||
      action === "cancel" ||
      (action === "finish" && result === "NOT_OK");

    if (reasonRequired && !trimmedReason) {
      setError("Enter a reason or issue note first.");
      return;
    }

    const target = options.find(
      (item): item is Exclude<Station, "shipped"> =>
        item === destination && item !== "shipped"
    );

    if (action === "finish" && destination && !target) {
      setError("Choose a valid destination.");
      return;
    }

    const currentStageIndex = STATION_ORDER.findIndex(
      (item) => item === tape.current_station
    );

    const backward = Boolean(
      target &&
        currentStageIndex >= 0 &&
        STATION_ORDER.indexOf(target) < currentStageIndex
    );

    if (action === "finish" && backward && !trimmedReason) {
      setError("Enter a reason for moving backward.");
      return;
    }

    const performAction = () => {
      if (action === "start") {
        return individualService.startTimer(tape.id);
      }

      if (!active) {
        throw new Error("Reload the tape before controlling the timer.");
      }

      switch (action) {
        case "pause":
          return individualService.pauseTimer(
            tape.id,
            active.id,
            trimmedReason
          );

        case "resume":
          return individualService.resumeTimer(tape.id, active.id);

        case "cancel":
          return individualService.cancelTimer(
            tape.id,
            active.id,
            trimmedReason
          );

        case "finish":
          return individualService.finishTimer(tape.id, active.id, {
            result,
            ...(trimmedReason ? { issue_note: trimmedReason } : {}),
            ...(target ? { to_station: target } : {})
          });
      }
    };

    const saved = await run(performAction, ACTION_MESSAGES[action]);

    if (saved) {
      setReason("");
      setDestination("");
      setResult("OK");
    }
  }

  return (
    <DetailSection title="Current stage work">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-dashboard-hover p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-dashboard-text">
              {stageLabel(active?.stage ?? tape.current_station)}
            </p>

            <p className="mt-3 text-xs leading-5 text-dashboard-muted">
              {active
                ? `Performed by ${personName(active.operator)}`
                : "No active timer. Timing is optional."}
            </p>
          </div>

          {active && (
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={timingColors[active.status]}>
                {stageLabel(active.status)}
              </Badge>

              <span
                aria-label="Active working duration"
                className="font-mono text-xl tabular-nums text-dashboard-text"
              >
                {duration(timingSeconds(active, now, tape.server_now))}
              </span>
            </div>
          )}
        </div>

        {!active && (
          <>
            <p className="text-xs leading-5 text-dashboard-muted">
              Start records actual work now. To process without a timer, use
              Change stage above.
            </p>

            {canStart ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => void act("start")}
                className="dashboard-btn-primary"
              >
                <Play size={15} aria-hidden="true" />
                Start work
              </button>
            ) : (
              <p className="text-sm leading-6 text-dashboard-muted">
                {unavailableMessage}
              </p>
            )}
          </>
        )}

        {active && !canControl && (
          <p className="text-sm leading-6 text-dashboard-muted">
            Only the person who started this timer or an admin can control it.
            The server also validates its stage.
          </p>
        )}

        {active && canControl && (
          <fieldset disabled={disabled} className="space-y-6">
            <div>
              <label htmlFor={`${id}-reason`} className={LABEL_CLASS}>
                Reason / work note
              </label>

              <textarea
                id={`${id}-reason`}
                rows={3}
                maxLength={1000}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className={`${inputClass} resize-y`}
                placeholder="Required for Pause, Cancel, or a Not OK result"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {active.status === "running" ? (
                <button
                  type="button"
                  onClick={() => void act("pause")}
                  className="dashboard-btn-secondary"
                >
                  <Pause size={15} aria-hidden="true" />
                  Pause
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void act("resume")}
                  className="dashboard-btn-secondary"
                >
                  <Play size={15} aria-hidden="true" />
                  Resume
                </button>
              )}

              <button
                type="button"
                onClick={() => void act("cancel")}
                className="dashboard-btn-secondary text-dashboard-red"
              >
                <X size={15} aria-hidden="true" />
                Cancel attempt
              </button>
            </div>

            <div className="grid gap-x-5 gap-y-6 border-t border-dashboard-border pt-6 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor={`${id}-result`} className={LABEL_CLASS}>
                  Work result
                </label>

                <TimerSelect
                  id={`${id}-result`}
                  value={result}
                  onChange={(event) => {
                    setResult(event.target.value as TapeWorkResult);
                    setDestination("");
                  }}
                >
                  <option value="OK">OK — passed</option>
                  <option value="NOT_OK">Not OK — rework</option>
                </TimerSelect>
              </div>

              <div className="min-w-0">
                <label htmlFor={`${id}-destination`} className={LABEL_CLASS}>
                  After finishing
                </label>

                <TimerSelect
                  id={`${id}-destination`}
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                >
                  <option value="">Stay in this stage</option>

                  {options.map((item) => (
                    <option key={item} value={item}>
                      Move to {stageLabel(item)}
                    </option>
                  ))}
                </TimerSelect>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void act("finish")}
              className="dashboard-btn-primary"
            >
              <Square size={15} aria-hidden="true" />
              {destination ? "Finish and move" : "Finish work"}
            </button>

            <p className="text-xs leading-5 text-dashboard-muted">
              Finishing while paused closes the pause. Moving to another stage
              does not start its timer.
            </p>
          </fieldset>
        )}

        {error && (
          <p role="alert" className="text-sm text-dashboard-red">
            {error}
          </p>
        )}
      </div>
    </DetailSection>
  );
}
