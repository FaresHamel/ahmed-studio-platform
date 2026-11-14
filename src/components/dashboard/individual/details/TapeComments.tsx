"use client";

import { useId, useState, type ComponentProps, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { tapeDetailsApi } from "@/lib/individual/tape-details-api";
import {
  canOperateStage,
  PRODUCTION_STAGES,
  STATION_ORDER,
  stageLabel
} from "@/lib/individual/tape-workflow";
import { dateTime, personName } from "@/lib/individual/tape-details-display";
import type { Station } from "@/types/production-api";
import type { TapeDetails } from "@/types/tape-details";
import {
  Badge,
  DetailSection,
  inputClass,
  type RunAction
} from "./DetailPrimitives";

interface Props {
  tape: TapeDetails;
  disabled: boolean;
  run: RunAction;
}

type TapeComment = TapeDetails["comments"][number];

const LABEL_CLASS = "mb-3 block text-[13px] font-medium text-dashboard-text";

function CommentSelect({
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

function StageOptions() {
  return (
    <>
      {STATION_ORDER.map((stage) => (
        <option key={stage} value={stage}>
          {stageLabel(stage)}
        </option>
      ))}
    </>
  );
}

function CommentCard({ comment }: { comment: TapeComment }) {
  return (
    <li className="rounded-lg border border-dashboard-border p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-dashboard-text">
          {personName(comment.author)}
        </p>

        <Badge>{stageLabel(comment.stage)}</Badge>
      </header>

      <p className="mt-3 text-xs leading-5 text-dashboard-muted">
        <time dateTime={comment.created_at}>
          {dateTime(comment.created_at)}
        </time>

        {comment.timing_id && " · Linked to a work record"}
      </p>

      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-dashboard-text">
        {comment.text}
      </p>
    </li>
  );
}

export default function TapeComments({ tape, disabled, run }: Props) {
  const id = useId();
  const user = useAuthStore((state) => state.user);
  const admin = Boolean(user?.roles.includes("admin"));

  const initialStage =
    STATION_ORDER.find((item) => item === tape.current_station) ?? "received";

  const [stage, setStage] = useState<Station>(initialStage);
  const [timingId, setTimingId] = useState("");
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  const stageType = PRODUCTION_STAGES.find((item) => item === stage);

  const assignment = tape.assignments?.find(
    (item) => item.stage === stage && item.operator_id === user?.id
  );

  const attempts = tape.stage_timings.filter((item) => item.stage === stage);

  const ownsWork = attempts.some(
    (item) =>
      item.operator_id === user?.id && (!timingId || item.id === timingId)
  );

  const eligibleAssignment = Boolean(
    stageType &&
      assignment?.operator.status === "active" &&
      canOperateStage(
        assignment.operator.profiles?.operator_type,
        stageType,
        tape.media_type
      )
  );

  const allowed = Boolean(
    !tape.context.box.closed &&
      !tape.context.box.shipped_at &&
      tape.status !== "shipped" &&
      (admin ||
        (user?.roles.includes("operator") && (ownsWork || eligibleAssignment)))
  );

  const visibleComments = tape.comments.filter(
    (comment) => filter === "all" || comment.stage === filter
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const commentText = text.trim();

    if (disabled || !allowed || !commentText) return;

    const saved = await run(
      () =>
        tapeDetailsApi.comment(tape.id, {
          stage,
          text: commentText,
          ...(timingId ? { timing_id: timingId } : {})
        }),
      "Comment added."
    );

    if (saved) {
      setText("");
    }
  }

  return (
    <DetailSection title="Internal stage comments">
      <form onSubmit={(event) => void submit(event)} className="space-y-6">
        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor={`${id}-stage`} className={LABEL_CLASS}>
              Comment stage
            </label>

            <CommentSelect
              id={`${id}-stage`}
              disabled={disabled}
              value={stage}
              onChange={(event) => {
                setStage(event.target.value as Station);
                setTimingId("");
              }}
            >
              <StageOptions />
            </CommentSelect>
          </div>

          <div className="min-w-0">
            <label htmlFor={`${id}-record`} className={LABEL_CLASS}>
              Work record (optional)
            </label>

            <CommentSelect
              id={`${id}-record`}
              disabled={disabled}
              value={timingId}
              onChange={(event) => setTimingId(event.target.value)}
            >
              <option value="">General note for this stage</option>

              {attempts.map((attempt, index) => (
                <option key={attempt.id} value={attempt.id}>
                  Record {index + 1}
                  {" · "}
                  {dateTime(attempt.started_at ?? attempt.created_at)}
                </option>
              ))}
            </CommentSelect>
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-text`} className={LABEL_CLASS}>
            Comment
          </label>

          <textarea
            id={`${id}-text`}
            disabled={disabled || !allowed}
            required
            maxLength={4000}
            rows={3}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={`${inputClass} resize-y`}
            placeholder="Describe the condition, issue, work completed, or handoff instructions…"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs leading-5 text-dashboard-muted">
            Your account name and the current date are saved automatically.
          </p>

          <button
            type="submit"
            disabled={disabled || !allowed || !text.trim()}
            className="dashboard-btn-primary"
          >
            Add comment
          </button>
        </div>

        {!allowed && (
          <p className="text-xs leading-5 text-dashboard-muted">
            Comments are read-only after shipment. Operators can comment on
            assigned stages or their own work.
          </p>
        )}
      </form>

      <div className="mt-6 border-t border-dashboard-border pt-6">
        <div className="mb-6 max-w-52">
          <label htmlFor={`${id}-filter`} className={LABEL_CLASS}>
            Show comments
          </label>

          <CommentSelect
            id={`${id}-filter`}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All stages</option>
            <StageOptions />
          </CommentSelect>
        </div>

        {visibleComments.length > 0 ? (
          <ol className="space-y-4">
            {visibleComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </ol>
        ) : (
          <p className="text-sm text-dashboard-muted">
            No comments for this selection.
          </p>
        )}
      </div>
    </DetailSection>
  );
}
