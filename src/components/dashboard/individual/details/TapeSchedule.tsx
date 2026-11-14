"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

import { individualService } from "@/services/individual.service";
import {
  fromLocalInput,
  toLocalInput
} from "@/lib/individual/tape-details-display";
import type { TapeDetails } from "@/types/tape-details";
import { DetailSection, inputClass, type RunAction } from "./DetailPrimitives";

interface Props {
  tape: TapeDetails;
  disabled: boolean;
  allowed: boolean;
  run: RunAction;
}

const LABEL_CLASS = "mb-3 block text-[13px] font-medium text-dashboard-text";

export default function TapeSchedule({ tape, disabled, allowed, run }: Props) {
  const id = useId();

  const [start, setStart] = useState(toLocalInput(tape.planned_start_at));

  const [due, setDue] = useState(toLocalInput(tape.due_at));

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStart(toLocalInput(tape.planned_start_at));
    setDue(toLocalInput(tape.due_at));
    setError(null);
  }, [tape.id, tape.planned_start_at, tape.due_at]);
  const boxLocked =
  tape.context.box.closed ||
  Boolean(tape.context.box.shipped_at) ||
  tape.status === "shipped" ||
  tape.current_station === "shipped";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!allowed || disabled || boxLocked) return;

    setError(null);

    try {
      const plannedStart = fromLocalInput(start);
      const deadline = fromLocalInput(due);

      if (
        plannedStart &&
        deadline &&
        Date.parse(deadline) < Date.parse(plannedStart)
      ) {
        throw new Error("Planned end cannot precede planned start.");
      }

      await run(
        () =>
          individualService.updateSchedule(tape.id, {
            planned_start_at: plannedStart,
            due_at: deadline
          }),
        "Schedule saved."
      );
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Check the schedule."
      );
    }
  }

  return (
    <DetailSection title="Tape schedule">
      <form onSubmit={(event) => void submit(event)} className="space-y-6">
        <fieldset
          disabled={disabled || !allowed || boxLocked}
          className="grid gap-x-5 gap-y-6 sm:grid-cols-2"
        >
          <div className="min-w-0">
            <label htmlFor={`${id}-start`} className={LABEL_CLASS}>
              Planned start
            </label>

            <input
              id={`${id}-start`}
              type="datetime-local"
              step={60}
              value={start}
              onChange={(event) => setStart(event.target.value)}
              aria-describedby={`${id}-help`}
              className={inputClass}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor={`${id}-due`} className={LABEL_CLASS}>
              Planned end / deadline
            </label>

            <input
              id={`${id}-due`}
              type="datetime-local"
              step={60}
              value={due}
              onChange={(event) => setDue(event.target.value)}
              aria-describedby={`${id}-help`}
              className={inputClass}
            />
          </div>
        </fieldset>

        <p id={`${id}-help`} className="text-xs leading-5 text-dashboard-muted">
          Optional. Clear a field to remove it. Times use your device’s
          timezone. Scheduling does not start work.
        </p>

        {error && (
          <p role="alert" className="text-sm text-dashboard-red">
            {error}
          </p>
        )}

        {allowed && !boxLocked && (
          <button
            type="submit"
            disabled={disabled}
            className="dashboard-btn-secondary"
          >
            Save schedule
          </button>
        )}
      </form>
    </DetailSection>
  );
}
