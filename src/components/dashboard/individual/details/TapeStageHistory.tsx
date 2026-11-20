import { PRODUCTION_STAGES, stageLabel } from "@/lib/individual/tape-workflow";
import {
  dateTime,
  duration,
  personName,
  timingColors,
  timingSeconds
} from "@/lib/individual/tape-details-display";
import type { TapeDetails } from "@/types/tape-details";
import { Badge, DetailField, DetailSection } from "./DetailPrimitives";

interface Props {
  tape: TapeDetails;
  now: number;
}

type WorkSession = TapeDetails["stage_timings"][number];
type WorkPause = WorkSession["pauses"][number];
type TapeComment = TapeDetails["comments"][number];

interface WorkSessionProps {
  session: WorkSession;
  index: number;
  now: number;
  serverNow: string;
  comments: TapeComment[];
}

const RESULT_COLORS = {
  passed: "bg-dashboard-green-soft text-dashboard-green",
  failed: "bg-dashboard-red-soft text-dashboard-red"
};

function PauseHistory({ pauses }: { pauses: WorkPause[] }) {
  if (pauses.length === 0) return null;

  return (
    <details className="mt-6 border-t border-dashboard-border pt-5 text-xs">
      <summary className="cursor-pointer text-dashboard-muted">
        {pauses.length} pause {pauses.length === 1 ? "interval" : "intervals"}
      </summary>

      <ul className="mt-4 space-y-4">
        {pauses.map((pause) => (
          <li key={pause.id} className="rounded bg-dashboard-hover p-3">
            <p className="leading-5 text-dashboard-text">
              {dateTime(pause.started_at)}
              {" → "}
              {pause.ended_at ? dateTime(pause.ended_at) : "Still paused"}
            </p>

            <p className="mt-3 whitespace-pre-wrap break-words leading-5 text-dashboard-muted">
              {pause.reason}
            </p>

            <p className="mt-3 leading-5 text-dashboard-muted">
              Paused by{" "}
              {personName(
                pause.author,
                pause.author_email ?? "Author not recorded"
              )}
            </p>
          </li>
        ))}
      </ul>
    </details>
  );
}

function SessionComments({ comments }: { comments: TapeComment[] }) {
  if (comments.length === 0) return null;

  return (
    <div className="mt-5 space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded bg-dashboard-hover p-3 text-xs"
        >
          <p className="font-medium text-dashboard-text">
            {personName(comment.author)}{" "}
            <span className="font-normal text-dashboard-muted">
              · {dateTime(comment.created_at)}
            </span>
          </p>

          <p className="mt-3 whitespace-pre-wrap break-words leading-5 text-dashboard-text">
            {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function WorkSessionCard({
  session,
  index,
  now,
  serverNow,
  comments
}: WorkSessionProps) {
  const manual = session.status === "manual";

  const performer = personName(
    session.operator,
    manual ? "Not recorded — manual dates" : "Not recorded"
  );

  const activeDuration = duration(timingSeconds(session, now, serverNow));

  return (
    <article className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-medium text-dashboard-text">
          {manual ? "Manual Material" : "Work attempt"} {index + 1}
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={timingColors[session.status]}>
            {stageLabel(session.status)}
          </Badge>

          {session.result && (
            <Badge
              className={
                session.result === "OK"
                  ? RESULT_COLORS.passed
                  : RESULT_COLORS.failed
              }
            >
              {session.result}
            </Badge>
          )}
        </div>
      </header>

      <dl className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField title="Performed by" value={performer} />

        <DetailField
          title="Active duration (HH:MM:SS)"
          value={activeDuration}
        />

        <DetailField title="Stage deadline" value={dateTime(session.due_at)} />

        <DetailField
          title="Actual start"
          value={dateTime(session.started_at)}
        />

        <DetailField title="Actual end" value={dateTime(session.ended_at)} />

        <DetailField
          title="Material created"
          value={dateTime(session.created_at)}
        />

        {session.note && (
          <div className="sm:col-span-2 lg:col-span-3">
            <DetailField
              title="Result / cancellation note"
              value={session.note}
            />

            <p className="mt-3 text-xs leading-5 text-dashboard-muted">
              Written by{" "}
              {personName(
                session.note_author,
                session.note_author_email ?? "Author not recorded"
              )}
            </p>
          </div>
        )}
      </dl>

      <PauseHistory pauses={session.pauses} />
      <SessionComments comments={comments} />
    </article>
  );
}

export default function TapeStageHistory({ tape, now }: Props) {
  const commentsByTiming = new Map<string, TapeComment[]>();

  for (const comment of tape.comments) {
    if (!comment.timing_id) continue;

    const comments = commentsByTiming.get(comment.timing_id);

    if (comments) {
      comments.push(comment);
    } else {
      commentsByTiming.set(comment.timing_id, [comment]);
    }
  }

  return (
    <DetailSection title="Stage assignments and work history">
      <p className="mb-6 text-xs leading-5 text-dashboard-muted">
        Assigned operator is the current responsibility. Performed by is the
        person who actually started each timer. Changing stage never starts the
        next operator’s timer.
      </p>

      <div className="space-y-5">
        {PRODUCTION_STAGES.map((stage) => {
          const assignment = tape.assignments?.find(
            (item) => item.stage === stage
          );

          const sessions = tape.stage_timings.filter(
            (item) => item.stage === stage
          );

          const current = tape.current_station === stage;

          const skipped = tape.history.some(
            (entry) =>
              Array.isArray(entry.skipped_stations) &&
              entry.skipped_stations.includes(stage)
          );

          const stageClass = current
            ? "border-dashboard-blue bg-dashboard-blue-soft/30"
            : "border-dashboard-border";

          return (
            <section
              key={stage}
              className={`rounded-lg border p-4 ${stageClass}`}
            >
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-dashboard-text">
                    {stageLabel(stage)}
                  </h3>

                  <p className="mt-3 text-xs leading-5 text-dashboard-muted">
                    Assigned:{" "}
                    <span className="text-dashboard-text">
                      {personName(assignment?.operator, "Unassigned")}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {current && (
                    <Badge className="bg-dashboard-blue-soft text-dashboard-blue">
                      Current stage
                    </Badge>
                  )}

                  {!current && skipped && sessions.length === 0 && (
                    <Badge className="bg-dashboard-blue-soft text-dashboard-blue">
                      Previously skipped
                    </Badge>
                  )}

                  <Badge>
                    {sessions.length} timing{" "}
                    {sessions.length === 1 ? "Material" : "Materials"}
                  </Badge>
                </div>
              </header>

              {sessions.length === 0 ? (
                <p className="mt-5 text-xs leading-5 text-dashboard-muted">
                  No timing recorded. This does not mean the stage was never
                  performed; timing is optional.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {sessions.map((session, index) => (
                    <WorkSessionCard
                      key={session.id}
                      session={session}
                      index={index}
                      now={now}
                      serverNow={tape.server_now}
                      comments={commentsByTiming.get(session.id) ?? []}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </DetailSection>
  );
}
