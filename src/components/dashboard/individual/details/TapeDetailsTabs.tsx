"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode
} from "react";
import {
  Activity,
  ClipboardList,
  MessageSquare,
  Timer,
  type LucideIcon
} from "lucide-react";

type TabKey = "overview" | "production" | "comments" | "activity";

type Props = Record<TabKey, ReactNode>;

interface TabDefinition {
  key: TabKey;
  label: string;
  icon: LucideIcon;
}

const TABS: readonly TabDefinition[] = [
  {
    key: "overview",
    label: "Overview",
    icon: ClipboardList
  },
  {
    key: "production",
    label: "Production",
    icon: Timer
  },
  {
    key: "comments",
    label: "Comments",
    icon: MessageSquare
  },
  {
    key: "activity",
    label: "Activity",
    icon: Activity
  }
];

const TAB_CLASS = [
  "inline-flex min-h-10 cursor-pointer",
  "items-center justify-center gap-2",
  "rounded-md px-2 py-2",
  "text-xs font-medium sm:text-[13px]",
  "transition-colors",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-dashboard-focus"
].join(" ");

export default function TapeDetailsTabs(props: Props) {
  const id = useId();

  const [active, setActive] = useState<TabKey>("overview");

  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let targetIndex: number;

    switch (event.key) {
      case "ArrowRight":
        targetIndex = (index + 1) % TABS.length;
        break;

      case "ArrowLeft":
        targetIndex = (index - 1 + TABS.length) % TABS.length;
        break;

      case "Home":
        targetIndex = 0;
        break;

      case "End":
        targetIndex = TABS.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    setActive(TABS[targetIndex].key);
    buttons.current[targetIndex]?.focus();
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Material details"
        aria-orientation="horizontal"
        className="
          grid grid-cols-4 gap-1
          rounded-lg bg-dashboard-hover p-1.5
        "
      >
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          const selected = active === tab.key;

          const stateClass = selected
            ? "bg-dashboard-surface text-dashboard-text shadow-sm"
            : [
                "text-dashboard-muted",
                "hover:bg-dashboard-surface/50",
                "hover:text-dashboard-text"
              ].join(" ");

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
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`${TAB_CLASS} ${stateClass}`}
            >
              <Icon
                size={14}
                aria-hidden="true"
                className={`
                  hidden shrink-0 sm:block
                  ${selected ? "text-dashboard-blue" : ""}
                `}
              />

              <span>{tab.label}</span>
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
          tabIndex={0}
          hidden={active !== tab.key}
          className="
            space-y-6 rounded-lg
            focus-visible:outline-2
            focus-visible:outline-dashboard-focus
          "
        >
          {props[tab.key]}
        </div>
      ))}
    </div>
  );
}
