"use client";

import Link from "next/link";
import { MoreHorizontal, X, Hash } from "lucide-react";
import type { TapeSummary } from "@/types/production-api";
import { useEffect, useId, useRef, useState } from "react";
import { avatarColor } from "@/lib/users/account-display";

interface Props {
  tape: TapeSummary & {
    due_at?: string | null;
  };
  color: string;
  canAssign: boolean;
  onAssign: (tape: TapeSummary) => void;
}

const MEDIA_LABELS: Record<string, string> = {
  video: "Video",
  audio: "Audio",
  photo: "Photo",
  document: "Document",
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
    minute: "2-digit",
  });
}

export default function TapeCard({
  tape,
  canAssign,
  onAssign,
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

  const detailsUrl =
    `/dashboard/admin/individual/tapes/${encodeURIComponent(tape.id)}`;

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
      if (event.key === "Escape") {
        setSelectedOperator(null);

        peopleRef.current
          ?.querySelector<HTMLButtonElement>(
            'button[aria-expanded="true"]',
          )
          ?.focus();
      }
    }

    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [personOpen]);

  return (
    <article
      style={{ borderRadius: 8 }}
      className="relative flex w-full min-w-0 flex-col overflow-hidden rounded-[2px] border-0 bg-dashboard-surface text-dashboard-text"
    >
      <div className="p-4">
        {/* Title and three dots */}
        <header className="flex items-center justify-between gap-3">
          <Link
            href={detailsUrl}
            title={title}
            className="min-w-0 flex-1 truncate text-[15px] font-medium capitalize leading-6 text-dashboard-text hover:underline"
          >
            {title}
          </Link>

          <Link
            href={detailsUrl}
            title="Open tape details"
            aria-label={`Open details for ${materialId}`}
            className="shrink-0 rounded-[2px] p-1 text-dashboard-muted transition-colors hover:bg-dashboard-hover hover:text-dashboard-text"
          >
            <MoreHorizontal size={18} aria-hidden="true" />
          </Link>
        </header>

        {/* Material ID */}
        <p className="mt-4 flex items-start gap-1.5 text-xs leading-5">
          <Hash
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-dashboard-muted"
          />

          <span className="shrink-0 font-medium text-dashboard-text">
            ID:
          </span>

          <span className="min-w-0 break-all text-dashboard-muted">
            {materialId}
          </span>
        </p>

        {/* Material information */}
        <dl className="mt-4 space-y-2 text-xs leading-5">
          <div className="flex items-baseline gap-1.5">
            <dt className="shrink-0 font-medium text-dashboard-text">
              Type:
            </dt>

            <dd>
              {MEDIA_LABELS[tape.media_type] ?? tape.media_type}
            </dd>
          </div>

          <div>
            <dt className="inline font-medium text-dashboard-text">
              Description:
            </dt>{" "}
            <dd className="inline whitespace-pre-wrap break-words text-dashboard-muted">
              {description || "No description provided."}
            </dd>
          </div>

          <div className="flex flex-wrap items-baseline gap-1.5">
            <dt className="font-medium text-dashboard-text">
              Due date:
            </dt>

            <dd className="text-dashboard-muted">
              {formatDueDate(tape.due_at)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Separator */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          flexShrink: 0,
          margin: "0 16px",
          backgroundColor: "var(--dashboard-border)",
        }}
      />

      {/* Assigned people and Assign button */}
      <footer className="mt-auto flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {assignedOperators.length > 0 ? (
            assignedOperators.map(([operatorId, account]) => {
              const name =
                account.profiles?.display_name?.trim() ||
                account.email ||
                "Unnamed Operator";

              const expanded =
                selectedOperator?.id === operatorId;

              return (
                <button
                  key={operatorId}
                  type="button"
                  onClick={() =>
                    setSelectedOperator((current) =>
                      current?.id === operatorId
                        ? null
                        : { id: operatorId, name },
                    )
                  }
                  title={name}
                  aria-label={`View ${name}`}
                  aria-expanded={expanded}
                  aria-controls={expanded ? panelId : undefined}
                  className="inline-flex max-w-full cursor-pointer items-center gap-2 rounded p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-focus"
                >
                  <span
                    aria-hidden="true"
                    className={`text-[11px] font-semibold ${avatarColor(operatorId)}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      flexShrink: 0,
                      borderRadius: "50%",
                      border: "1px solid var(--dashboard-border)",
                      overflow: "hidden",
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
            <span className="text-xs text-dashboard-muted">
              Unassigned
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!canAssign}
          onClick={() => onAssign(tape)}
          style={{
            display: "inline-flex",
            flexShrink: 0,
            border: "1px solid var(--dashboard-border)",
            backgroundColor: "var(--dashboard-surface)",
            color: "var(--dashboard-text)",
            borderRadius: 6,
            padding: "4px 12px",
          }}
          className="text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Assign
        </button>
      </footer>

      {selectedOperator && (
        <AssignedPersonModal
          name={selectedOperator.name}
          onClose={() => setSelectedOperator(null)}
        />
      )}
    </article>
  );
}

function AssignedPersonModal({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previousFocus = document.activeElement;

    panelRef.current
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus();

    function handleOutsideClick(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        !panelRef.current?.contains(event.target)
      ) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
      document.removeEventListener("keydown", handleEscape);

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      style={{
        border: "1px solid var(--dashboard-border)",
        backgroundColor: "var(--dashboard-surface)",
        color: "var(--dashboard-text)",
        borderRadius: 6,
      }}
      aria-labelledby={titleId}
      className="absolute bottom-12 left-3 right-3 top-3 z-20 rounded-md border border-dashboard-border bg-dashboard-surface p-3 text-dashboard-text shadow-lg"
    >
      <header className="flex items-center justify-between gap-2">
        <h2
          id={titleId}
          className="text-xs font-medium text-dashboard-muted"
        >
          Assigned person
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close assigned person details"
          className="rounded p-1 text-dashboard-muted hover:bg-dashboard-hover"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </header>

      <div className="mt-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            flexShrink: 0,
            borderRadius: "50%",
          }}
          className="bg-dashboard-blue-soft text-xs font-semibold text-dashboard-blue"
        >
          {Array.from(name.trim())[0]?.toUpperCase() || "?"}
        </span>

        <p className="min-w-0 break-words text-xs font-medium">
          {name}
        </p>
      </div>
    </div>
  );
}