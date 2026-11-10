import { PRODUCTION_STAGES, stageLabel } from '@/lib/individual/tape-workflow';
import { dateTime, duration, personName, timingColors, timingSeconds } from '@/lib/individual/tape-details-display';
import type { TapeDetails } from '@/types/tape-details';
import { Badge, DetailField, DetailSection } from './DetailPrimitives';

export default function TapeStageHistory({ tape, now }: { tape: TapeDetails; now: number }) {
  return <DetailSection title="Stage assignments and work history">
    <p className="mb-5 text-xs leading-5 text-dashboard-muted">Assigned operator is the current responsibility. Performed by is the person who actually started each timer. Changing stage never starts the next operator’s timer.</p>
    <div className="space-y-4">
      {PRODUCTION_STAGES.map((stage) => {
        const assignment = tape.assignments?.find((item) => item.stage === stage);
        const sessions = tape.stage_timings.filter((item) => item.stage === stage);
        const current = tape.current_station === stage;
        const skipped = tape.history.some((entry) => Array.isArray(entry.skipped_stations) && entry.skipped_stations.includes(stage));
        return <section key={stage} className={`rounded-lg border p-4 ${current ? 'border-dashboard-blue bg-dashboard-blue-soft/30' : 'border-dashboard-border'}`}>
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="text-sm font-semibold">{stageLabel(stage)}</h3>
              <p className="mt-1 text-xs text-dashboard-muted">Assigned: <span className="text-dashboard-text">{personName(assignment?.operator, 'Unassigned')}</span></p>
            </div>
            <div className="flex flex-wrap gap-2">{current && <Badge className="bg-dashboard-blue-soft text-dashboard-blue">Current stage</Badge>}
              {!current && skipped && !sessions.length && <Badge className="bg-dashboard-blue-soft text-dashboard-blue">Previously skipped</Badge>}
              <Badge>{sessions.length} timing {sessions.length === 1 ? 'record' : 'records'}</Badge>
            </div>
          </header>
          {!sessions.length ? <p className="mt-3 text-xs text-dashboard-muted">No timing recorded. This does not mean the stage was never performed; timing is optional.</p> :
            <div className="mt-4 space-y-3">{sessions.map((session, index) => <article key={session.id} className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4">
              <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-medium">{session.status === 'manual' ? 'Manual record' : 'Work attempt'} {index + 1}</h4>
                <div className="flex gap-2"><Badge className={timingColors[session.status]}>{stageLabel(session.status)}</Badge>
                  {session.result && <Badge className={session.result === 'OK' ? 'bg-dashboard-green-soft text-dashboard-green' : 'bg-dashboard-red-soft text-dashboard-red'}>{session.result}</Badge>}
                </div>
              </header>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField title="Performed by" value={personName(session.operator, session.status === 'manual' ? 'Not recorded — manual dates' : 'Not recorded')} />
                <DetailField title="Active duration (HH:MM:SS)" value={duration(timingSeconds(session, now, tape.server_now))} />
                <DetailField title="Stage deadline" value={dateTime(session.due_at)} />
                <DetailField title="Actual start" value={dateTime(session.started_at)} />
                <DetailField title="Actual end" value={dateTime(session.ended_at)} />
                <DetailField title="Record created" value={dateTime(session.created_at)} />
                {session.note && <div className="sm:col-span-2 lg:col-span-3"><DetailField title="Result / cancellation note" value={session.note} /><p className="mt-1 text-xs text-dashboard-muted">Written by {personName(session.note_author, session.note_author_email ?? 'Author not recorded')}</p></div>}
              </dl>
              {session.pauses.length > 0 && <details className="mt-4 border-t border-dashboard-border pt-3 text-xs">
                <summary className="cursor-pointer text-dashboard-muted">{session.pauses.length} pause {session.pauses.length === 1 ? 'interval' : 'intervals'}</summary>
                <ul className="mt-3 space-y-3">{session.pauses.map((pause) => <li key={pause.id} className="rounded bg-dashboard-hover p-3">
                  <p>{dateTime(pause.started_at)} → {pause.ended_at ? dateTime(pause.ended_at) : 'Still paused'}</p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-dashboard-muted">{pause.reason}</p>
                  <p className="mt-1 text-dashboard-muted">Paused by {personName(pause.author, pause.author_email ?? 'Author not recorded')}</p>
                </li>)}</ul>
              </details>}
              {tape.comments.filter((comment) => comment.timing_id === session.id).map((comment) => <div key={comment.id} className="mt-3 rounded bg-dashboard-hover p-3 text-xs">
                <p className="font-medium">{personName(comment.author)} <span className="font-normal text-dashboard-muted">· {dateTime(comment.created_at)}</span></p>
                <p className="mt-1 whitespace-pre-wrap break-words leading-5">{comment.text}</p>
              </div>)}
            </article>)}</div>}
        </section>;
      })}
    </div>
  </DetailSection>;
}
