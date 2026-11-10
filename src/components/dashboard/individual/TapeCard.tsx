"use client";

import Link from "next/link";
import { ArrowRightLeft, Hash, MoreHorizontal, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import type { TapeSummary } from "@/types/production-api";
import { avatarColor } from "@/lib/users/account-display";
import { stageLabel } from "@/lib/individual/tape-workflow";

interface Props {
  tape: TapeSummary;
  color: string;
  canAssign: boolean;
  onAssign: (tape: TapeSummary) => void;
  onChangeStage: (tape: TapeSummary) => void;
}

const MEDIA_LABELS: Record<string, string> = {
  video: "Video",
  audio: "Audio",
  photo: "Photo",
  document: "Document"
};

function formatDueDate(value?: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function TapeCard({
  tape,
  canAssign,
  onAssign,
  onChangeStage
}: Props) {
  const [selectedOperator, setSelectedOperator] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const peopleRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const materialId = tape.tape_code ?? tape.id;
  const title = tape.metadata?.title?.trim() || "Untitled material";
  const description = tape.metadata?.summary?.trim();

  const detailsUrl = `/dashboard/admin/individual/tapes/${encodeURIComponent(
    tape.id
  )}`;

  const canChangeStage =
    ["audio", "video"].includes(tape.media_type) &&
    tape.status !== "shipped" &&
    tape.current_station !== "shipped";

  const operators = new Map<
    string,
    NonNullable<TapeSummary["assignments"]>[number]["operator"]
  >();

  for (const assignment of tape.assignments ?? []) {
    operators.set(assignment.operator_id, assignment.operator);
  }

  const assignedOperators = Array.from(operators.entries());
  const personOpen = selectedOperator !== null;

  useEffect(() => {
    if (!personOpen) return;

    function closeOutside(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        !peopleRef.current?.contains(event.target)
      ) {
        setSelectedOperator(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();

      peopleRef.current
        ?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')
        ?.focus();

      setSelectedOperator(null);
    }

    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [personOpen]);

  return (
    <article className="relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg border-0 bg-dashboard-surface text-dashboard-text">
      <div className="p-4">
        {/* Title and details */}
        <header className="flex items-center justify-between gap-3">
          <Link
            href={detailsUrl}
            title={title}
            className="
              min-w-0 flex-1 truncate
              text-[15px] font-medium capitalize leading-6
              text-dashboard-text hover:underline
            "
          >
            {title}
          </Link>

          <Link
            href={detailsUrl}
            title="Open tape details"
            aria-label={`Open details for ${materialId}`}
            className="
              shrink-0 rounded p-1 text-dashboard-muted
              transition-colors hover:bg-dashboard-hover
              hover:text-dashboard-text
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-dashboard-focus
            "
          >
            <MoreHorizontal size={18} aria-hidden="true" />
          </Link>
        </header>

        {/* Material ID */}
        <Link
          href={detailsUrl}
          title="Open material details"
          className="
            mt-4 inline-flex max-w-full items-start gap-1.5
            rounded-md bg-dashboard-blue-soft px-2 py-1
            text-xs leading-5 text-dashboard-blue
            transition-colors hover:underline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-dashboard-focus
          "
        >
          <Hash size={14} aria-hidden="true" className="mt-0.5 shrink-0" />

          <span className="shrink-0 font-medium">ID:</span>

          <span className="min-w-0 break-all">{materialId}</span>
        </Link>

        {/* Material information */}
        <dl className="mt-5 space-y-3 text-xs leading-5">
          <div className="flex items-baseline gap-2">
            <dt className="shrink-0 font-medium text-dashboard-text">Type:</dt>

            <dd className="m-0 text-dashboard-muted">
              {MEDIA_LABELS[tape.media_type] ?? tape.media_type}
            </dd>
          </div>

          <div>
            <dt className="inline font-medium text-dashboard-text">
              Description:
            </dt>{" "}
            <dd className="m-0 inline whitespace-pre-wrap break-words text-dashboard-muted">
              {description || "No description provided."}
            </dd>
          </div>
        </dl>

        {/* Schedule */}
        <dl className="mt-5 space-y-3 text-xs leading-5">
          {tape.planned_start_at && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <dt className="font-medium text-dashboard-text">
                Planned start:
              </dt>

              <dd className="m-0 rounded-md bg-dashboard-blue-soft px-2 py-1 text-dashboard-blue">
                {formatDueDate(tape.planned_start_at)}
              </dd>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <dt className="font-medium text-dashboard-text">Due date:</dt>

            <dd
              className={
                tape.due_at
                  ? "m-0 rounded-md bg-dashboard-amber-soft px-2 py-1 text-dashboard-amber"
                  : "m-0 text-dashboard-muted"
              }
            >
              {formatDueDate(tape.due_at)}
            </dd>
          </div>
        </dl>

        {/* Stage and action */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border pt-4">
          <dl className="flex items-center gap-2 text-xs leading-5">
            <dt className="font-medium text-dashboard-text">Stage:</dt>

            <dd className="m-0 text-dashboard-muted">
              {stageLabel(tape.current_station)}
            </dd>
          </dl>

          {canChangeStage && (
            <button
              type="button"
              onClick={() => onChangeStage(tape)}
              className="
                inline-flex shrink-0 cursor-pointer
                items-center justify-center gap-1.5
                rounded-md border border-dashboard-border
                bg-dashboard-hover px-3 py-1.5
                text-xs font-medium leading-5 text-dashboard-text
                transition-colors hover:bg-dashboard-active
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-dashboard-focus
              "
            >
              <ArrowRightLeft size={13} aria-hidden="true" />
              Change stage
            </button>
          )}
        </div>
      </div>

      {/* Footer separator */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          flexShrink: 0,
          margin: "0 16px",
          backgroundColor: "var(--dashboard-border)"
        }}
      />

      <div ref={peopleRef}>
        {/* Assigned people and assignment action */}
        <footer className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {assignedOperators.length > 0 ? (
              assignedOperators.map(([operatorId, account]) => {
                const name =
                  account.profiles?.display_name?.trim() ||
                  account.email ||
                  "Unnamed operator";

                const expanded = selectedOperator?.id === operatorId;

                return (
                  <button
                    key={operatorId}
                    type="button"
                    onClick={() =>
                      setSelectedOperator((current) =>
                        current?.id === operatorId
                          ? null
                          : { id: operatorId, name }
                      )
                    }
                    title={name}
                    aria-label={`View ${name}`}
                    aria-expanded={expanded}
                    aria-controls={expanded ? panelId : undefined}
                    className="
                      inline-flex max-w-full cursor-pointer
                      items-center gap-2 rounded p-0 text-left
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-dashboard-focus
                    "
                  >
                    <span
                      aria-hidden="true"
                      className={`text-[11px] font-semibold ${avatarColor(
                        operatorId
                      )}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        borderRadius: "50%",
                        border: "1px solid var(--dashboard-border)",
                        overflow: "hidden"
                      }}
                    >
                      {Array.from(name.trim())[0]?.toUpperCase() || "?"}
                    </span>

                    <span className="min-w-0 truncate text-xs capitalize leading-4 text-dashboard-text">
                      {name}
                    </span>
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-dashboard-muted">Unassigned</span>
            )}
          </div>

          <button
            type="button"
            disabled={!canAssign}
            onClick={() => onAssign(tape)}
            className="
              inline-flex shrink-0 items-center justify-center
              rounded-md border border-dashboard-border
              bg-dashboard-surface px-3 py-1.5
              text-xs font-medium leading-5 text-dashboard-text
              transition-colors hover:bg-dashboard-hover
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-dashboard-focus
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Assign
          </button>
        </footer>

        {selectedOperator && (
          <div
            id={panelId}
            role="region"
            aria-label="Assigned person"
            className="
              mx-4 mb-4 rounded-md
              border border-dashboard-border
              bg-dashboard-hover p-3 text-dashboard-text
            "
          >
            <header className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-medium text-dashboard-muted">
                Assigned person
              </h4>

              <button
                type="button"
                onClick={() => {
                  peopleRef.current
                    ?.querySelector<HTMLButtonElement>(
                      'button[aria-expanded="true"]'
                    )
                    ?.focus();

                  setSelectedOperator(null);
                }}
                aria-label="Close assigned person details"
                className="
                  rounded p-1 text-dashboard-muted
                  hover:bg-dashboard-active
                  hover:text-dashboard-text
                  focus-visible:outline-2
                  focus-visible:outline-dashboard-focus
                "
              >
                <X size={14} aria-hidden="true" />
              </button>
            </header>

            <div className="mt-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`text-[11px] font-semibold ${avatarColor(
                  selectedOperator.id
                )}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  borderRadius: "50%"
                }}
              >
                {Array.from(selectedOperator.name.trim())[0]?.toUpperCase() ||
                  "?"}
              </span>

              <p className="min-w-0 break-words text-xs font-medium">
                {selectedOperator.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
