"use client";

import { useId, useRef, useState, type ReactNode } from "react";

import {
  Activity,
  ClipboardList,
  Layers,
  MessageSquare,
  UsersRound,
  type LucideIcon
} from "lucide-react";

type TabKey = "overview" | "records" | "contacts" | "comments" | "activity";

const TABS: Array<{
  key: TabKey;
  label: string;
  icon: LucideIcon;
}> = [
  { key: "overview", label: "Overview", icon: ClipboardList },
  { key: "records", label: "Materials", icon: Layers },
  { key: "contacts", label: "Contacts", icon: UsersRound },
  { key: "comments", label: "Comments", icon: MessageSquare },
  { key: "activity", label: "Activity", icon: Activity }
];

interface SectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
}

export function PovSection({
  title,
  icon: Icon,
  children,
  action
}: SectionProps) {
  const id = useId();

  return (
    <section
      aria-labelledby={id}
      className="min-w-0 overflow-hidden rounded-xl border-[0.5px] border-dashboard-border bg-dashboard-surface"
    >
      <header className="flex min-h-16 items-center justify-between gap-3 border-b border-dashboard-border px-5 py-4">
        <h2
          id={id}
          className="flex min-w-0 items-center gap-2.5 text-[15px] font-semibold"
        >
          <Icon
            size={15}
            strokeWidth={1.8}
            aria-hidden="true"
            className="shrink-0 text-dashboard-blue"
          />
          {title}
        </h2>

        {action}
      </header>

      <div className="p-5">{children}</div>
    </section>
  );
}

export function PovField({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[13px] leading-5 text-dashboard-muted">{label}</dt>

      <dd className="mt-2 break-words text-[13px] leading-6">
        {children ?? "Not recorded"}
      </dd>
    </div>
  );
}

export function PovDetailsTabs({
  children
}: {
  children: Record<TabKey, ReactNode>;
}) {
  const id = useId();
  const [active, setActive] = useState<TabKey>("overview");

  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="POV project details"
        aria-orientation="horizontal"
        className="grid grid-cols-5 gap-1 rounded-lg bg-dashboard-hover p-1.5"
      >
        {TABS.map((tab, index) => {
          const selected = active === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              id={`${id}-${tab.key}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${id}-${tab.key}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.key)}
              onKeyDown={(event) => {
                let target: number;

                switch (event.key) {
                  case "ArrowRight":
                    target = (index + 1) % TABS.length;
                    break;
                  case "ArrowLeft":
                    target = (index - 1 + TABS.length) % TABS.length;
                    break;
                  case "Home":
                    target = 0;
                    break;
                  case "End":
                    target = TABS.length - 1;
                    break;
                  default:
                    return;
                }

                event.preventDefault();
                setActive(TABS[target].key);
                buttons.current[target]?.focus();
              }}
              className={`
                inline-flex min-h-10 items-center justify-center
                gap-2 rounded-md px-2 py-2 text-xs font-medium
                transition-colors sm:text-[13px]
                focus-visible:outline-2
                focus-visible:outline-dashboard-focus
                ${
                  selected
                    ? "bg-dashboard-surface text-dashboard-text shadow-sm"
                    : "text-dashboard-muted hover:text-dashboard-text"
                }
              `}
            >
              <Icon
                size={14}
                aria-hidden="true"
                className={`hidden shrink-0 sm:block ${
                  selected ? "text-dashboard-blue" : ""
                }`}
              />

              {tab.label}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.key}
          id={`${id}-${tab.key}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-${tab.key}-tab`}
          hidden={active !== tab.key}
          tabIndex={0}
          className="space-y-5 rounded-lg focus-visible:outline-2 focus-visible:outline-dashboard-focus"
        >
          {children[tab.key]}
        </div>
      ))}
    </div>
  );
}
