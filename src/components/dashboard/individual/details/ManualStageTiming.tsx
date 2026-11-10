"use client";

import { useEffect, useState, type FormEvent } from 'react';
import { individualService } from '@/services/individual.service';
import { useAuthStore } from '@/store/auth.store';
import { canOperateStage, PRODUCTION_STAGES, stageLabel } from '@/lib/individual/tape-workflow';
import { dateTime, fromLocalInput, toLocalInput } from '@/lib/individual/tape-details-display';
import type { AssignableStage } from '@/types/production-api';
import type { TapeDetails } from '@/types/tape-details';
import { DetailSection, inputClass, type RunAction } from './DetailPrimitives';

export default function ManualStageTiming({ tape, disabled, run }: {
  tape: TapeDetails; disabled: boolean; run: RunAction;
}) {
  const user = useAuthStore((state) => state.user);
  const admin = Boolean(user?.roles.includes('admin'));
  const initial = PRODUCTION_STAGES.find((stage) => stage === tape.current_station) ?? 'inspected';
  const [stage, setStage] = useState<AssignableStage>(initial);
  const [timingId, setTimingId] = useState('');
  const [due, setDue] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState<string | null>(null);
  const records = tape.stage_timings.filter((item) => item.stage === stage && item.status === 'manual');
  const selected = records.find((item) => item.id === timingId);
  const assignment = tape.assignments?.find((item) => item.stage === stage && item.operator_id === user?.id);
  const allowed = Boolean(!tape.context.box.shipped_at && tape.status !== 'shipped' && ['audio', 'video'].includes(tape.media_type) && (
    admin || (user?.roles.includes('operator') && assignment?.operator.status === 'active' && canOperateStage(assignment.operator.profiles?.operator_type, stage, tape.media_type))
  ));
  useEffect(() => {
    setDue(toLocalInput(selected?.due_at));
    setStart(toLocalInput(selected?.started_at));
    setEnd(toLocalInput(selected?.ended_at));
    setError(null);
  }, [stage, timingId, selected?.due_at, selected?.started_at, selected?.ended_at]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || !allowed) return;
    setError(null);
    try {
      const body = { due_at: fromLocalInput(due), started_at: fromLocalInput(start), ended_at: fromLocalInput(end) };
      if (!timingId && !body.due_at && !body.started_at && !body.ended_at) throw new Error('Enter at least one date.');
      if (body.ended_at && (!body.started_at || Date.parse(body.ended_at) < Date.parse(body.started_at))) throw new Error('End requires a start and cannot precede it.');
      await run(() => timingId
        ? individualService.updateStageTiming(tape.id, timingId, body)
        : individualService.createStageTiming(tape.id, { stage, ...body }), 'Manual stage dates saved.');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Check these dates.'); }
  }

  return <DetailSection title="Optional manual stage dates">
    <details className="text-sm"><summary className="cursor-pointer text-dashboard-blue">Enter a stage deadline or dates recorded outside the timer</summary>
      <form onSubmit={(event) => void submit(event)} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2"><span>Stage</span><select disabled={disabled} value={stage} onChange={(event) => { setStage(event.target.value as AssignableStage); setTimingId(''); }} className={inputClass}>
            {PRODUCTION_STAGES.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}
          </select></label>
          <label className="space-y-2"><span>Manual record</span><select disabled={disabled} value={timingId} onChange={(event) => setTimingId(event.target.value)} className={inputClass}>
            <option value="">Create new manual record</option>{records.map((item) => <option key={item.id} value={item.id}>{dateTime(item.created_at)}</option>)}
          </select></label>
        </div>
        <fieldset disabled={disabled || !allowed} className="grid gap-4 sm:grid-cols-3">
          {[{ label: 'Stage deadline', value: due, set: setDue }, { label: 'Actual start', value: start, set: setStart }, { label: 'Actual end', value: end, set: setEnd }].map((item) => <label key={item.label} className="space-y-2"><span>{item.label}</span>
            <input type="datetime-local" step={60} value={item.value} onChange={(event) => item.set(event.target.value)} className={inputClass} />
          </label>)}
        </fieldset>
        <p className="text-xs leading-5 text-dashboard-muted">Times use your device’s timezone. These records do not start timers. Automatic attempts cannot be edited here. Manual dates do not establish who performed the work; author changes are recorded in Activity.</p>
        {!allowed && <p className="text-xs text-dashboard-muted">Only an admin or the eligible operator assigned to this stage can save dates.</p>}
        {error && <p role="alert" className="text-dashboard-red">{error}</p>}
        <button disabled={disabled || !allowed} type="submit" className="dashboard-btn-secondary">Save manual dates</button>
      </form>
    </details>
  </DetailSection>;
}
