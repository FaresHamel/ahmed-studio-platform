import { History } from "lucide-react";

import type { RegistrationActivityEntry } from "@/types/production-api";

interface JobRegistrationHistoryProps {
  events: RegistrationActivityEntry[];
  hasMore?: boolean;
}

interface ActionAppearance {
  label: string;
  /** Badge: soft background + strong text + subtle ring */
  badge: string;
  /** Timeline dot + badge dot */
  dot: string;
}

const ACTIONS: Record<string, ActionAppearance> = {
  close_intake: {
    label: "Finished adding boxes",
    badge:
      "bg-dashboard-amber-soft text-dashboard-amber ring-dashboard-amber/20",
    dot: "bg-dashboard-amber"
  },
  reopen_intake: {
    label: "Allowed more boxes",
    badge: "bg-dashboard-blue-soft text-dashboard-blue ring-dashboard-blue/20",
    dot: "bg-dashboard-blue"
  }
};

const DEFAULT_ACTION: ActionAppearance = {
  label: "Registration updated",
  badge: "bg-dashboard-hover text-dashboard-muted ring-dashboard-border",
  dot: "bg-dashboard-muted"
};

function formatName(value: string): string {
  const name = value.trim();
  if (!name) return "Account not available";
  // Preserve an email address when it is the available author fallback.
  if (name.includes("@")) return name;
  return name
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function ActivityEntry({
  event,
  isLast
}: {
  event: RegistrationActivityEntry;
  isLast: boolean;
}) {
  const name = formatName(event.author_name);
  const initial = Array.from(name)[0]?.toLocaleUpperCase() ?? "?";
  const appearance = ACTIONS[event.action] ?? DEFAULT_ACTION;
  const reason = event.reason?.trim();

  return (
    <li className="relative px-4 py-4 transition-colors hover:bg-dashboard-hover/60 sm:px-6">
      {/* Timeline connector */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[35px] top-[60px] w-px bg-dashboard-border sm:left-[43px]"
        />
      )}

      <article className="flex items-start gap-3">
        {/* Neutral avatar; colour lives in the status dot */}
        <span className="relative shrink-0">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full border border-dashboard-border bg-dashboard-hover text-sm font-medium text-dashboard-text"
          >
            {initial}
          </span>
          <span
            aria-hidden="true"
            className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-dashboard-surface ${appearance.dot}`}
          />
        </span>

        <div className="min-w-0 flex-1">
          <header className="flex items-baseline justify-between gap-3">
            <h3 className="min-w-0 break-words text-[13px] font-medium leading-5 text-dashboard-text">
              {name}
            </h3>
            <time
              dateTime={event.at}
              className="shrink-0 whitespace-nowrap font-mono text-[11px] leading-5 text-dashboard-muted tabular-nums"
            >
              {formatDate(event.at)}
            </time>
          </header>

          <span
            className={`mt-1 inline-flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-xs font-medium leading-5 ring-1 ring-inset ${appearance.badge}`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${appearance.dot}`}
            />
            {appearance.label}
          </span>

          {reason && (
            <div className="mt-3 rounded-[4px] border border-dashboard-border bg-dashboard-hover/50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-dashboard-muted">
                Reason
              </p>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-[13px] leading-6 text-dashboard-text">
                {reason}
              </p>
            </div>
          )}
        </div>
      </article>
    </li>
  );
}

export default function JobRegistrationHistory({
  events,
  hasMore = false
}: JobRegistrationHistoryProps) {
  return (
    <section
      aria-label="Registration history"
      className="overflow-hidden rounded-[4px] border border-dashboard-border bg-dashboard-surface text-dashboard-text"
    >
      <header className="flex items-center justify-between gap-2 border-b border-dashboard-border bg-dashboard-hover/40 px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-[4px] bg-dashboard-blue-soft">
            <History
              size={15}
              aria-hidden="true"
              className="text-dashboard-blue"
            />
          </span>
          <h2 className="text-[15px] font-medium">Registration History</h2>
        </div>
        {events.length > 0 && (
          <span className="rounded-full border border-dashboard-border bg-dashboard-surface px-2 py-0.5 font-mono text-[11px] text-dashboard-muted tabular-nums">
            {events.length}
          </span>
        )}
      </header>

      {events.length > 0 ? (
        <ol
          role="list"
          className="list-none divide-y divide-dashboard-border/60"
        >
          {events.map((event, i) => (
            <ActivityEntry
              key={event.id}
              event={event}
              isLast={i === events.length - 1}
            />
          ))}
        </ol>
      ) : (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <History
            size={20}
            aria-hidden="true"
            className="text-dashboard-muted"
          />
          <p className="text-[13px] text-dashboard-muted">
            No registration changes recorded.
          </p>
        </div>
      )}

      {hasMore && (
        <p className="border-t border-dashboard-border bg-dashboard-hover/40 px-5 py-2.5 text-xs leading-5 text-dashboard-muted">
          Showing the latest 100 events. Earlier activity remains saved.
        </p>
      )}
    </section>
  );
}
