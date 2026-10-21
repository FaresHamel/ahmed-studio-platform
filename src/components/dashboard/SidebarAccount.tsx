"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronUp,
  Loader2,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import type { AuthUser } from "@/types/auth";

interface SidebarAccountProps {
  user: AuthUser | null;
  isInitialized: boolean;
  isLoggingOut: boolean;
  onLogout: () => void | Promise<void>;
}

const avatarColors = [
  ["#db2777", "#9d174d"],
  ["#2563eb", "#1e40af"],
  ["#059669", "#065f46"],
  ["#7c3aed", "#5b21b6"],
  ["#c2410c", "#9a3412"],
  ["#0e7490", "#155e75"],
];

function getAvatarColors(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return avatarColors[hash % avatarColors.length];
}

function getInitials(name: string, email?: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  return (words[0] || email || "U").slice(0, 2).toUpperCase();
}

export const SidebarAccount = ({
  user,
  isInitialized,
  isLoggingOut,
  onLogout,
}: SidebarAccountProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const fullName = user?.name?.trim() || "Account";
  const initials = getInitials(user?.name || "", user?.email);

  const [colorStart, colorEnd] = getAvatarColors(
    user?.id || user?.email || "account",
  );

  useEffect(() => {
    if (!isOpen) return;

    panelRef.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isInitialized) {
    return (
      <div className="flex items-center gap-3 p-2" aria-hidden="true">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-dashboard-hover" />

        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-dashboard-hover" />
          <div className="h-3 w-32 animate-pulse rounded bg-dashboard-hover" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      {/* Account actions */}
      {isOpen && user && (
        <div
          ref={panelRef}
          id={panelId}
          role="group"
          aria-label="Account actions"
          className="
            absolute inset-x-0 bottom-full z-50 mb-3
            overflow-hidden rounded-xl
            border border-dashboard-border
            bg-dashboard-surface p-1
            shadow-[0_8px_30px_rgb(0_0_0/10%)]
          "
        >
          <button
            type="button"
            disabled
            title="Coming soon"
            className="
              flex w-full items-center gap-3 rounded-lg
              px-3 py-2.5 text-left text-sm
              text-dashboard-muted
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <UserRound size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            disabled
            title="Coming soon"
            className="
              flex w-full items-center gap-3 rounded-lg
              px-3 py-2.5 text-left text-sm
              text-dashboard-muted
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <Settings size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Settings</span>
          </button>

          <div className="my-1 border-t border-dashboard-border" />

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => {
              setIsOpen(false);
              void onLogout();
            }}
            className="
              flex w-full items-center gap-3 rounded-lg
              px-3 py-2.5 text-left text-sm font-medium
              text-dashboard-red transition-colors
              hover:bg-dashboard-red-soft
              focus-visible:outline-2
              focus-visible:outline-dashboard-focus
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* Account trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={!user || isLoggingOut}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label={`${fullName}, account actions`}
        className="
          flex w-full items-center gap-3 rounded-xl
          p-2 text-left transition-colors
          hover:bg-dashboard-hover
          focus-visible:outline-2
          focus-visible:outline-dashboard-focus
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        <span
          className="
            flex size-10 shrink-0 items-center justify-center
            rounded-full text-xs font-semibold text-white
          "
          style={{
            backgroundImage: `linear-gradient(
              135deg,
              ${colorStart},
              ${colorEnd}
            )`,
          }}
          aria-hidden="true"
        >
          {initials}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className="
              block truncate text-sm font-semibold
              text-dashboard-text
            "
            title={fullName}
          >
            {fullName}
          </span>

          <span
            className="
              mt-0.5 block truncate text-xs
              text-dashboard-muted
            "
            title={user?.email}
          >
            {user?.email}
          </span>
        </span>

        {isLoggingOut ? (
          <Loader2
            size={16}
            className="shrink-0 animate-spin text-dashboard-muted"
            aria-hidden="true"
          />
        ) : (
          <ChevronUp
            size={16}
            className={`
              shrink-0 text-dashboard-muted transition-transform
             rotate-90
            `}
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
};