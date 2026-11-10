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

export const inputClass = "dashboard-input min-h-11 px-3 py-2.5";

export type RunAction = (
  work: () => Promise<unknown>,
  success: string
) => Promise<boolean>;

type SectionTone = "blue" | "green" | "orange" | "purple" | "cyan" | "amber";

interface SectionStyle {
  iconClass: string;
  borderColor: string;
}

const SECTION_STYLES: Record<SectionTone, SectionStyle> = {
  blue: {
    iconClass: "bg-dashboard-blue-soft text-dashboard-blue",
    borderColor: "var(--dashboard-blue)"
  },
  green: {
    iconClass: "bg-dashboard-green-soft text-dashboard-green",
    borderColor: "var(--dashboard-green)"
  },
  orange: {
    iconClass: "bg-dashboard-orange-soft text-dashboard-orange",
    borderColor: "var(--dashboard-orange)"
  },
  purple: {
    iconClass: "bg-dashboard-purple-soft text-dashboard-purple",
    borderColor: "var(--dashboard-purple)"
  },
  cyan: {
    iconClass: "bg-dashboard-cyan-soft text-dashboard-cyan",
    borderColor: "var(--dashboard-cyan)"
  },
  amber: {
    iconClass: "bg-dashboard-amber-soft text-dashboard-amber",
    borderColor: "var(--dashboard-amber)"
  }
};

interface SectionAppearance {
  icon: LucideIcon;
  tone: SectionTone;
}

function sectionAppearance(title: string): SectionAppearance {
  const value = title.toLowerCase();

  if (value.includes("customer")) {
    return { icon: UsersRound, tone: "purple" };
  }

  if (value.includes("schedule")) {
    return { icon: CalendarDays, tone: "blue" };
  }

  if (value.includes("current stage")) {
    return { icon: Timer, tone: "green" };
  }

  if (value.includes("assignments")) {
    return { icon: ListChecks, tone: "cyan" };
  }

  if (value.includes("manual")) {
    return { icon: Clock3, tone: "amber" };
  }

  if (value.includes("comment")) {
    return { icon: MessageSquare, tone: "purple" };
  }

  if (value.includes("activity") || value.includes("history")) {
    return { icon: Activity, tone: "orange" };
  }

  if (value.includes("material") || value.includes("identification")) {
    return { icon: Package, tone: "cyan" };
  }

  if (value.includes("information")) {
    return { icon: FileText, tone: "blue" };
  }

  return { icon: ClipboardList, tone: "blue" };
}

interface DetailSectionProps {
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
}: DetailSectionProps) {
  const id = useId();
  const [expanded, setExpanded] = useState(defaultOpen);

  const appearance = sectionAppearance(title);
  const Icon = icon ?? appearance.icon;
  const style = SECTION_STYLES[tone ?? appearance.tone];
  const open = !collapsible || expanded;

  const heading = (
    <>
      <span
        aria-hidden="true"
        className={`
          inline-flex size-10 shrink-0 items-center
          justify-center rounded-xl
          ${style.iconClass}
        `}
      >
        <Icon size={20} strokeWidth={1.8} />
      </span>

      <span className="min-w-0 text-left text-base font-semibold capitalize leading-6 text-dashboard-text">
        {title}
      </span>
    </>
  );

  return (
    <section
      className="
        overflow-hidden rounded-xl
        border border-dashboard-border
        bg-dashboard-surface text-dashboard-text
        transition-colors
      "
    >
      <header
        className={`
          flex flex-wrap items-center justify-between gap-3
          px-5 py-4 sm:px-6
          ${open ? "bg-dashboard-surface" : "bg-dashboard-hover"}
        `}
        style={{
          borderInlineStart: `3px solid ${
            open ? style.borderColor : "transparent"
          }`
        }}
      >
        <h2 id={`${id}-title`} className="min-w-0 flex-1">
          {collapsible ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={open}
              aria-controls={`${id}-content`}
              aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
              className="
                flex w-full cursor-pointer items-center gap-3
                rounded-md text-left
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-dashboard-focus
              "
            >
              {heading}

              <span
                className={`
                  ml-auto hidden shrink-0 rounded-md
                  px-2 py-1 text-[10px] font-medium sm:inline-flex
                  ${
                    open
                      ? style.iconClass
                      : "bg-dashboard-surface text-dashboard-muted"
                  }
                `}
              >
                {open ? "Expanded" : "Collapsed"}
              </span>

              <ChevronDown
                size={17}
                aria-hidden="true"
                className={`
                  shrink-0 text-dashboard-muted
                  transition-transform duration-200
                  ${open ? "rotate-180" : ""}
                `}
              />
            </button>
          ) : (
            <span className="flex items-center gap-3">{heading}</span>
          )}
        </h2>

        {action && <div className="shrink-0">{action}</div>}
      </header>

      <div
        id={`${id}-content`}
        role="region"
        aria-labelledby={`${id}-title`}
        hidden={!open}
        className="
          border-t border-dashboard-border
          px-5 py-5 sm:px-6
        "
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
      <dt className="flex items-center gap-1.5 text-xs text-dashboard-muted">
        {Icon && (
          <Icon
            size={14}
            aria-hidden="true"
            className="shrink-0 text-dashboard-blue"
          />
        )}

        {title}
      </dt>

      <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-dashboard-text">
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
        inline-flex items-center gap-1.5 rounded-md
        px-2 py-1 text-xs font-medium leading-5
        ${className}
      `}
    >
      {children}
    </span>
  );
}
