"use client";

import { useId, useState, type ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileText,
  ListChecks,
  MessageSquare,
  Package,
  Timer,
  UsersRound,
  type LucideIcon
} from "lucide-react";

import { display } from "@/lib/individual/tape-details-display";

export const inputClass = "dashboard-input min-h-10 px-3 py-2 text-[13px]";

export type RunAction = (
  work: () => Promise<unknown>,
  success: string
) => Promise<boolean>;

type SectionTone = "blue" | "green" | "orange" | "purple" | "cyan" | "amber";

const ICON_COLORS: Record<SectionTone, string> = {
  blue: "text-dashboard-blue",
  green: "text-dashboard-green",
  orange: "text-dashboard-orange",
  purple: "text-dashboard-purple",
  cyan: "text-dashboard-cyan",
  amber: "text-dashboard-amber"
};

function appearance(title: string): { icon: LucideIcon; tone: SectionTone } {
  const value = title.toLowerCase();

  if (/customer|individual job/.test(value)) {
    return { icon: UsersRound, tone: "purple" };
  }

  if (/schedule/.test(value)) {
    return { icon: CalendarDays, tone: "blue" };
  }

  if (/current stage/.test(value)) {
    return { icon: Timer, tone: "green" };
  }

  if (/assignments/.test(value)) {
    return { icon: ListChecks, tone: "cyan" };
  }

  if (/manual/.test(value)) {
    return { icon: Clock3, tone: "amber" };
  }

  if (/comment/.test(value)) {
    return { icon: MessageSquare, tone: "purple" };
  }

  if (/activity|history/.test(value)) {
    return { icon: Activity, tone: "orange" };
  }

  if (/material|identification/.test(value)) {
    return { icon: Package, tone: "cyan" };
  }

  if (/information/.test(value)) {
    return { icon: FileText, tone: "blue" };
  }

  return { icon: ClipboardList, tone: "blue" };
}

interface SectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: SectionTone;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function DetailSection({
  title,
  children,
  action,
  icon,
  tone,
  collapsible = true,
  defaultOpen = true
}: SectionProps) {
  const id = useId();
  const [expanded, setExpanded] = useState(defaultOpen);

  const selected = appearance(title);
  const Icon = icon ?? selected.icon;
  const open = !collapsible || expanded;

  const titleContent = (
    <>
      <Icon
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
        className={`shrink-0 ${ICON_COLORS[tone ?? selected.tone]}`}
      />

      <span className="min-w-0 text-[15px] font-semibold capitalize leading-6 text-dashboard-text">
        {title}
      </span>
    </>
  );

  return (
    <section
      style={{ borderWidth: "0.5px" }}
      className="
        min-w-0 overflow-hidden rounded-lg
        border-solid border-dashboard-border
        bg-dashboard-surface text-dashboard-text
      "
    >
      <header
        className={`
          flex min-h-16 items-center justify-between
          gap-3 px-5 py-4
          ${open ? "bg-dashboard-surface" : "bg-dashboard-hover"}
        `}
      >
        <h2 id={`${id}-title`} className="min-w-0 flex-1">
          {collapsible ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${id}-content`}
              aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
              onClick={() => setExpanded((value) => !value)}
              className="
                flex w-full cursor-pointer items-center
                gap-2.5 rounded text-left
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-dashboard-focus
              "
            >
              {titleContent}

              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`
                  ml-auto shrink-0 text-dashboard-muted
                  transition-transform duration-200
                  ${open ? "rotate-180" : ""}
                `}
              />
            </button>
          ) : (
            <span className="flex items-center gap-2.5">{titleContent}</span>
          )}
        </h2>

        {action && <div className="shrink-0">{action}</div>}
      </header>

      <div
        id={`${id}-content`}
        role="region"
        aria-labelledby={`${id}-title`}
        hidden={!open}
        className="border-t border-dashboard-border px-5 py-6"
      >
        {children}
      </div>
    </section>
  );
}

interface DetailFieldProps {
  title: string;
  value: unknown;
  icon?: LucideIcon;
}

export function DetailField({ title, value, icon: Icon }: DetailFieldProps) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[13px] leading-5 text-dashboard-muted">
        {Icon && (
          <Icon
            size={14}
            aria-hidden="true"
            className="shrink-0 text-dashboard-blue"
          />
        )}

        {title}
      </dt>

      <dd className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-6 text-dashboard-text">
        {display(value)}
      </dd>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({
  children,
  className = "bg-dashboard-hover text-dashboard-muted"
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-2 py-0.5
        text-xs font-medium leading-5
        ${className}
      `}
    >
      {children}
    </span>
  );
}
