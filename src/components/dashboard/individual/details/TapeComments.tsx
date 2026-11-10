"use client";

import { useState, type FormEvent } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { tapeDetailsApi } from '@/lib/individual/tape-details-api';
import { canOperateStage, PRODUCTION_STAGES, STATION_ORDER, stageLabel } from '@/lib/individual/tape-workflow';
import { dateTime, personName } from '@/lib/individual/tape-details-display';
import type { Station } from '@/types/production-api';
import type { TapeDetails } from '@/types/tape-details';
import { Badge, DetailSection, inputClass, type RunAction } from './DetailPrimitives';

export default function TapeComments({ tape, disabled, run }: {
  tape: TapeDetails; disabled: boolean; run: RunAction;
}) {
  const user = useAuthStore((state) => state.user);
  const admin = Boolean(user?.roles.includes('admin'));
  const [stage, setStage] = useState<Station>(STATION_ORDER.find((item) => item === tape.current_station) ?? 'received');
  const [timingId, setTimingId] = useState('');
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const stageType = PRODUCTION_STAGES.find((item) => item === stage);
  const assignment = tape.assignments?.find((item) => item.stage === stage && item.operator_id === user?.id);
  const attempts = tape.stage_timings.filter((item) => item.stage === stage);
  const ownsWork = attempts.some((item) => item.operator_id === user?.id && (!timingId || item.id === timingId));
  const allowed = Boolean(!tape.context.box.shipped_at && tape.status !== 'shipped' && (admin || (user?.roles.includes('operator') && (ownsWork || (
    stageType && assignment?.operator.status === 'active' && canOperateStage(assignment.operator.profiles?.operator_type, stageType, tape.media_type)
  )))));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || !allowed || !text.trim()) return;
    const saved = await run(() => tapeDetailsApi.comment(tape.id, {
      stage, text: text.trim(), ...(timingId ? { timing_id: timingId } : {}),
    }), 'Comment added.');
    if (saved) setText('');
  }

  return <DetailSection title="Internal stage comments">
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm"><span>Comment stage</span><select disabled={disabled} value={stage} onChange={(event) => { setStage(event.target.value as Station); setTimingId(''); }} className={inputClass}>
          {STATION_ORDER.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}
        </select></label>
        <label className="space-y-2 text-sm"><span>Work record (optional)</span><select disabled={disabled} value={timingId} onChange={(event) => setTimingId(event.target.value)} className={inputClass}>
          <option value="">General note for this stage</option>
          {attempts.map((item, index) => <option key={item.id} value={item.id}>Record {index + 1} · {dateTime(item.started_at ?? item.created_at)}</option>)}
        </select></label>
      </div>
      <label className="block space-y-2 text-sm"><span>Comment</span><textarea disabled={disabled || !allowed} required maxLength={4000} rows={3} value={text} onChange={(event) => setText(event.target.value)} className={`${inputClass} resize-y`} placeholder="Describe the condition, issue, work completed, or handoff instructions…" /></label>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-dashboard-muted">Your account name and the current date are saved automatically.</p><button type="submit" disabled={disabled || !allowed || !text.trim()} className="dashboard-btn-primary">Add comment</button></div>
      {!allowed && <p className="text-xs text-dashboard-muted">Comments are read-only after shipment. Operators can comment on assigned stages or their own work.</p>}
    </form>
    <div className="mt-6 border-t border-dashboard-border pt-5">
      <label className="mb-4 flex flex-wrap items-center gap-3 text-xs"><span>Show comments</span><select value={filter} onChange={(event) => setFilter(event.target.value)} className="dashboard-input max-w-52 px-3 py-2"><option value="all">All stages</option>{STATION_ORDER.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}</select></label>
      <ol className="space-y-4">{tape.comments.filter((comment) => filter === 'all' || comment.stage === filter).map((comment) => <li key={comment.id} className="rounded-lg border border-dashboard-border p-4">
        <header className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{personName(comment.author)}</p><Badge>{stageLabel(comment.stage)}</Badge></header>
        <p className="mt-1 text-xs text-dashboard-muted">{dateTime(comment.created_at)}{comment.timing_id ? ' · Linked to a work record' : ''}</p>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{comment.text}</p>
      </li>)}</ol>
      {!tape.comments.some((comment) => filter === 'all' || comment.stage === filter) && <p className="text-sm text-dashboard-muted">No comments for this selection.</p>}
    </div>
  </DetailSection>;
}
