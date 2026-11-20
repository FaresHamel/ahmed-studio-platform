"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { Activity, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import { povService } from "@/services/pov.service";
import { useAuthStore } from "@/store/auth.store";

import { povDate, povDuration, povError, povName } from "@/lib/pov/display";

import { PovSection } from "./PovDetailsLayout";

import type {
  PovProjectActivityResponse,
  PovProjectComment
} from "@/types/production-api";

const NOTE_CLASS =
  "rounded-lg bg-[#EAECF0] p-3 text-dashboard-text dark:bg-slate-800";

const ACTIONS: Record<string, { label: string; color: string }> = {
  create: {
    label: "Project created",
    color: "text-dashboard-blue"
  },
  update: {
    label: "Project information updated",
    color: "text-dashboard-blue"
  },
  pause: {
    label: "Project paused",
    color: "text-dashboard-amber"
  },
  resume: {
    label: "Project resumed",
    color: "text-dashboard-green"
  },
  extend: {
    label: "Project extended",
    color: "text-dashboard-purple"
  },
  finish: {
    label: "Project finished",
    color: "text-dashboard-green"
  },
  reopen: {
    label: "Project reopened",
    color: "text-dashboard-orange"
  },
  contact_link: {
    label: "Project account linked",
    color: "text-dashboard-blue"
  },
  contact_unlink: {
    label: "Project account removed",
    color: "text-dashboard-orange"
  },
  comment: {
    label: "Internal comment added",
    color: "text-dashboard-purple"
  }
};

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-dashboard-blue-soft text-[13px] font-semibold text-dashboard-blue"
    >
      {name.trim().charAt(0).toLocaleUpperCase() || "?"}
    </span>
  );
}

function AuthorLine({ name, at }: { name: string; at: string }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
      <p className="min-w-0 break-words text-[13px] font-medium">
        {povName(name)}
      </p>

      <time dateTime={at} className="shrink-0 text-xs text-dashboard-muted">
        {povDate(at)}
      </time>
    </div>
  );
}

interface CommentsProps {
  projectId: string;
  finished: boolean;
  comments: PovProjectComment[];
  error?: string;
  refreshing: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSaved: () => Promise<boolean>;
}

export function PovProjectComments({
  projectId,
  finished,
  comments,
  error,
  refreshing,
  page,
  totalPages,
  onPageChange,
  onSaved
}: CommentsProps) {
  const id = useId();

  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const lock = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const actor = useAuthStore.getState().user;
    const cleanedText = text.trim();

    if (
      lock.current ||
      refreshing ||
      finished ||
      !cleanedText ||
      !actor?.roles.includes("admin")
    ) {
      return;
    }

    const actorId = actor.id;

    function isCurrentAccount() {
      const user = useAuthStore.getState().user;

      return (
        mounted.current &&
        user?.id === actorId &&
        Boolean(user?.roles.includes("admin"))
      );
    }

    lock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      try {
        await povService.addComment(projectId, cleanedText);
      } catch (failure) {
        if (isCurrentAccount()) {
          setSaveError(povError(failure, "Could not save the comment."));
        }
        return;
      }

      if (!isCurrentAccount()) return;

      setText("");
      toast.success("Comment added.");

      const refreshed = await onSaved();

      if (!refreshed && isCurrentAccount()) {
        toast.error(
          "Comment saved, but some project information could not refresh."
        );
      }
    } finally {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
      }
    }
  }

  return (
    <PovSection title="Internal comments" icon={MessageSquare}>
      <form onSubmit={(event) => void submit(event)} className="space-y-4">
        <div>
          <label htmlFor={id} className="mb-2 block text-[13px] font-medium">
            Comment
          </label>

          <textarea
            id={id}
            required
            maxLength={4000}
            rows={3}
            disabled={finished || saving || refreshing}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Material an update, issue or handoff instruction…"
            className="dashboard-input w-full resize-y px-3 py-2 text-[13px] leading-6"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-dashboard-muted">
            Internal comments are visible to admins only.
          </p>

          <button
            type="submit"
            disabled={finished || saving || refreshing || !text.trim()}
            className="dashboard-btn-primary"
          >
            {saving ? "Saving…" : "Add comment"}
          </button>
        </div>

        {finished && (
          <p className="text-xs text-dashboard-muted">
            Reopen the project to add comments.
          </p>
        )}

        {saveError && (
          <p role="alert" className="text-[13px] text-dashboard-red">
            {saveError}
          </p>
        )}
      </form>

      <div
        aria-busy={refreshing}
        className="mt-6 border-t border-dashboard-border pt-5"
      >
        {error && (
          <p role="alert" className="mb-4 text-[13px] text-dashboard-red">
            {error}
          </p>
        )}

        <ol className="space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex items-start gap-3">
              <Avatar name={comment.author_name} />

              <div className="min-w-0 flex-1">
                <AuthorLine
                  name={comment.author_name}
                  at={comment.created_at}
                />

                <div className={`mt-3 ${NOTE_CLASS}`}>
                  <p className="whitespace-pre-wrap break-words text-[13px] leading-6">
                    {comment.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {!error && comments.length === 0 && (
          <p className="text-[13px] text-dashboard-muted">
            No internal comments recorded.
          </p>
        )}

        <nav
          aria-label="Project comments pagination"
          className="mt-5 flex flex-wrap items-center justify-end gap-3 text-xs"
        >
          <button
            type="button"
            disabled={saving || refreshing || Boolean(error) || page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="dashboard-btn-secondary"
          >
            Previous
          </button>

          <span className="text-dashboard-muted">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={
              saving || refreshing || Boolean(error) || page >= totalPages
            }
            onClick={() => onPageChange(page + 1)}
            className="dashboard-btn-secondary"
          >
            Next
          </button>
        </nav>
      </div>
    </PovSection>
  );
}

export function PovProjectActivity({
  activity,
  error
}: {
  activity?: PovProjectActivityResponse;
  error?: string;
}) {
  return (
    <PovSection title="Project activity" icon={Activity}>
      {error && (
        <p role="alert" className="mb-4 text-[13px] text-dashboard-red">
          {error}
        </p>
      )}

      <ol className="space-y-6">
        {activity?.data.map((event) => {
          const appearance = ACTIONS[event.action] ?? {
            label: event.action.replace(/_/g, " "),
            color: "text-dashboard-muted"
          };

          return (
            <li key={event.id} className="flex items-start gap-3">
              <Avatar name={event.author_name} />

              <div className="min-w-0 flex-1">
                <AuthorLine name={event.author_name} at={event.at} />

                <p
                  className={`mt-2 text-[13px] font-medium ${appearance.color}`}
                >
                  {appearance.label}
                </p>

                {event.reason?.trim() && (
                  <div className={`mt-3 ${NOTE_CLASS}`}>
                    <p className="text-xs font-medium text-dashboard-muted">
                      Reason
                    </p>

                    <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-6">
                      {event.reason}
                    </p>
                  </div>
                )}

                <div className="mt-2 space-y-1 text-xs leading-5 text-dashboard-muted">
                  {event.pause_started_at && (
                    <p>Pause started: {povDate(event.pause_started_at)}</p>
                  )}

                  {event.pause_ended_at && (
                    <p>Pause ended: {povDate(event.pause_ended_at)}</p>
                  )}

                  {event.pause_seconds != null && (
                    <p>Pause duration: {povDuration(event.pause_seconds)}</p>
                  )}

                  {event.added_days != null && (
                    <p>Days added: {event.added_days}</p>
                  )}

                  {event.excluded_finished_seconds != null && (
                    <p>
                      Time excluded while finished:{" "}
                      {povDuration(event.excluded_finished_seconds)}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {!error && !activity?.data.length && (
        <p className="text-[13px] text-dashboard-muted">
          No project activity recorded.
        </p>
      )}

      {activity?.has_more && (
        <p className="mt-5 border-t border-dashboard-border pt-4 text-xs text-dashboard-muted">
          Showing the latest 100 events. Earlier activity remains saved.
        </p>
      )}
    </PovSection>
  );
}
