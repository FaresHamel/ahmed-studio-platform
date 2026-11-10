"use client";

import { useEffect, useId, useState, type FormEvent } from 'react';
import { individualService } from '@/services/individual.service';
import { fromLocalInput, toLocalInput } from '@/lib/individual/tape-details-display';
import type { TapeDetails } from '@/types/tape-details';
import { DetailSection, inputClass, type RunAction } from './DetailPrimitives';

export default function TapeSchedule({ tape, disabled, allowed, run }: {
  tape: TapeDetails; disabled: boolean; allowed: boolean; run: RunAction;
}) {
  const id = useId();
  const [start, setStart] = useState(toLocalInput(tape.planned_start_at));
  const [due, setDue] = useState(toLocalInput(tape.due_at));
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setStart(toLocalInput(tape.planned_start_at));
    setDue(toLocalInput(tape.due_at));
  }, [tape.id, tape.planned_start_at, tape.due_at]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allowed || disabled) return;
    setError(null);
    try {
      const planned_start_at = fromLocalInput(start);
      const due_at = fromLocalInput(due);
      if (planned_start_at && due_at && Date.parse(due_at) < Date.parse(planned_start_at)) {
        throw new Error('Planned end cannot precede planned start.');
      }
      await run(() => individualService.updateSchedule(tape.id, { planned_start_at, due_at }), 'Schedule saved.');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Check the schedule.');
    }
  }

  return <DetailSection title="Tape schedule">
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      <fieldset disabled={disabled || !allowed} className="grid gap-4 sm:grid-cols-2">
        <label htmlFor={`${id}-start`} className="space-y-2 text-sm"><span>Planned start</span>
          <input id={`${id}-start`} type="datetime-local" step={60} value={start} onChange={(event) => setStart(event.target.value)} className={inputClass} />
        </label>
        <label htmlFor={`${id}-due`} className="space-y-2 text-sm"><span>Planned end / deadline</span>
          <input id={`${id}-due`} type="datetime-local" step={60} value={due} onChange={(event) => setDue(event.target.value)} className={inputClass} />
        </label>
      </fieldset>
      <p className="text-xs leading-5 text-dashboard-muted">Optional. Clear a field to remove it. Times use your device’s timezone. Scheduling does not start work.</p>
      {error && <p role="alert" className="text-sm text-dashboard-red">{error}</p>}
      {allowed && <button disabled={disabled} className="dashboard-btn-secondary" type="submit">Save schedule</button>}
    </form>
  </DetailSection>;
}
