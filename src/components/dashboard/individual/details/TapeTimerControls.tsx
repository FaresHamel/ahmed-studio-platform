"use client";

import { useState } from 'react';
import { Pause, Play, Square, X } from 'lucide-react';
import { individualService } from '@/services/individual.service';
import { useAuthStore } from '@/store/auth.store';
import { canOperateStage, movementOptions, PRODUCTION_STAGES, STATION_ORDER, stageLabel } from '@/lib/individual/tape-workflow';
import { duration, personName, timingColors, timingSeconds } from '@/lib/individual/tape-details-display';
import type { Station, TapeWorkResult } from '@/types/production-api';
import type { TapeDetails } from '@/types/tape-details';
import { Badge, DetailSection, inputClass, type RunAction } from './DetailPrimitives';

export default function TapeTimerControls({ tape, now, disabled, run }: {
  tape: TapeDetails; now: number; disabled: boolean; run: RunAction;
}) {
  const user = useAuthStore((state) => state.user);
  const admin = Boolean(user?.roles.includes('admin'));
  const operator = Boolean(user?.roles.includes('operator'));
  const active = tape.stage_timings.find((item) => item.status === 'running' || item.status === 'paused');
  const stage = PRODUCTION_STAGES.find((item) => item === tape.current_station);
  const assigned = tape.assignments?.find((item) => item.stage === stage && item.operator_id === user?.id);
  const supported = ['audio', 'video'].includes(tape.media_type);
  const shipped = Boolean(tape.context.box.shipped_at || tape.status === 'shipped' || tape.current_station === 'shipped');
  const canStart = Boolean(!shipped && supported && stage && !active && (admin || (
    operator && assigned?.operator.status === 'active' && canOperateStage(assigned.operator.profiles?.operator_type, stage, tape.media_type)
  )));
  const canControl = Boolean(!shipped && active && active.stage === tape.current_station && (admin || (operator && active.operator_id === user?.id)));
  const [reason, setReason] = useState('');
  const [result, setResult] = useState<TapeWorkResult>('OK');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState<string | null>(null);
  const options = movementOptions(tape.current_station, result, admin);

  async function act(action: 'start' | 'pause' | 'resume' | 'cancel' | 'finish') {
    if (disabled || (action === 'start' ? !canStart : !canControl)) return;
    setError(null);
    if ((action === 'pause' || action === 'cancel' || (action === 'finish' && result === 'NOT_OK')) && !reason.trim()) {
      setError('Enter a reason or issue note first.'); return;
    }
    const target = options.find((item): item is Exclude<Station, 'shipped'> => item === destination && item !== 'shipped');
    if (action === 'finish' && destination && !target) {
      setError('Choose a valid destination.'); return;
    }
    const backward = target && STATION_ORDER.indexOf(target) < STATION_ORDER.findIndex((item) => item === tape.current_station);
    if (action === 'finish' && backward && !reason.trim()) {
      setError('Enter a reason for moving backward.'); return;
    }
    const actionPromise = () => {
      if (action === 'start') return individualService.startTimer(tape.id);
      if (!active) throw new Error('Reload the tape before controlling the timer.');
      if (action === 'pause') return individualService.pauseTimer(tape.id, active.id, reason.trim());
      if (action === 'resume') return individualService.resumeTimer(tape.id, active.id);
      if (action === 'cancel') return individualService.cancelTimer(tape.id, active.id, reason.trim());
      return individualService.finishTimer(tape.id, active.id, {
        result,
        ...(reason.trim() ? { issue_note: reason.trim() } : {}),
        ...(target ? { to_station: target } : {}),
      });
    };
    const saved = await run(actionPromise, {
      start: 'Timer started.', pause: 'Timer paused.', resume: 'Timer resumed.', cancel: 'Attempt cancelled.', finish: 'Work finished.',
    }[action]);
    if (saved) { setReason(''); setDestination(''); setResult('OK'); }
  }

  return <DetailSection title="Current stage work">
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-dashboard-hover p-4">
        <div><p className="text-sm font-medium">{stageLabel(active?.stage ?? tape.current_station)}</p>
          <p className="mt-1 text-xs text-dashboard-muted">{active ? `Performed by ${personName(active.operator)}` : 'No active timer. Timing is optional.'}</p>
        </div>
        {active && <div className="flex items-center gap-3"><Badge className={timingColors[active.status]}>{stageLabel(active.status)}</Badge>
          <span className="font-mono text-xl tabular-nums" aria-label="Active working duration">{duration(timingSeconds(active, now, tape.server_now))}</span>
        </div>}
      </div>

      {!active && <>
        <p className="text-xs leading-5 text-dashboard-muted">Start records actual work now. To process without a timer, use Change stage above.</p>
        {canStart ? <button disabled={disabled} type="button" onClick={() => void act('start')} className="dashboard-btn-primary"><Play size={15} />Start work</button>
          : <p className="text-sm text-dashboard-muted">{shipped ? 'Production is read-only after shipment.' : !supported ? 'Timers are configured for audio and video.' : !stage ? 'Move to a production stage before starting work.' : 'An admin or the eligible assigned operator can start this stage.'}</p>}
      </>}

      {active && !canControl && <p className="text-sm text-dashboard-muted">Only the person who started this timer or an admin can control it. The server also validates its stage.</p>}
      {active && canControl && <fieldset disabled={disabled} className="space-y-4">
        <label className="block space-y-2 text-sm"><span>Reason / work note</span>
          <textarea rows={3} maxLength={1000} value={reason} onChange={(event) => setReason(event.target.value)} className={`${inputClass} resize-y`} placeholder="Required for Pause, Cancel, or a Not OK result" />
        </label>
        <div className="flex flex-wrap gap-2">
          {active.status === 'running'
            ? <button type="button" onClick={() => void act('pause')} className="dashboard-btn-secondary"><Pause size={15} />Pause</button>
            : <button type="button" onClick={() => void act('resume')} className="dashboard-btn-secondary"><Play size={15} />Resume</button>}
          <button type="button" onClick={() => void act('cancel')} className="dashboard-btn-secondary text-dashboard-red"><X size={15} />Cancel attempt</button>
        </div>
        <div className="grid gap-4 border-t border-dashboard-border pt-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm"><span>Work result</span>
            <select value={result} onChange={(event) => { setResult(event.target.value as TapeWorkResult); setDestination(''); }} className={inputClass}>
              <option value="OK">OK — passed</option><option value="NOT_OK">Not OK — rework</option>
            </select>
          </label>
          <label className="space-y-2 text-sm"><span>After finishing</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)} className={inputClass}>
              <option value="">Stay in this stage</option>
              {options.map((item) => <option key={item} value={item}>Move to {stageLabel(item)}</option>)}
            </select>
          </label>
        </div>
        <button type="button" onClick={() => void act('finish')} className="dashboard-btn-primary"><Square size={15} />{destination ? 'Finish and move' : 'Finish work'}</button>
        <p className="text-xs text-dashboard-muted">Finishing while paused closes the pause. Moving to another stage does not start its timer.</p>
      </fieldset>}
      {error && <p role="alert" className="text-sm text-dashboard-red">{error}</p>}
    </div>
  </DetailSection>;
}
