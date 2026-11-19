"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Eye,
  FileText,
  FolderOpen,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  UsersRound,
  UserRound
} from "lucide-react";

import type { CustomerListItem } from "@/types/production-api";

interface CustomerCardProps {
  customer: CustomerListItem;
  disabled: boolean;
  onEdit: (customer: CustomerListItem) => void;
}

const ACTION_CLASS = `
  flex min-h-10 w-full items-center gap-2.5
  rounded-md px-3 py-2 text-left text-[13px]
  text-dashboard-text transition-colors
  hover:bg-dashboard-hover
  focus-visible:outline-2
  focus-visible:outline-dashboard-focus
  disabled:cursor-not-allowed disabled:opacity-40
`;

export default function CustomerCard({
  customer,
  disabled,
  onEdit
}: CustomerCardProps) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const detailsRef = useRef<HTMLAnchorElement>(null);
  const actionsId = useId();

  const isCompany = customer.client_type === "company";
  const Icon = isCompany ? Building2 : UserRound;

  const accountCount = customer.client_users.length;

  const activeAccounts = customer.client_users.filter(
    (membership) => membership.users.status === "active"
  ).length;

  const inactiveAccounts = accountCount - activeAccounts;
  const notes = customer.notes?.trim();

  const detailsUrl = `/dashboard/admin/customers/${encodeURIComponent(
    customer.id
  )}`;

  const statistics = [
    {
      label: "Individual jobs",
      value: customer._count.ind_clients,
      icon: FolderOpen,
      color: "text-dashboard-blue"
    },
    {
      label: "POV projects",
      value: customer._count.pov_projects,
      icon: FileText,
      color: "text-dashboard-purple"
    },
    {
      label: "Linked accounts",
      value: accountCount,
      icon: UsersRound,
      color: "text-dashboard-orange"
    }
  ];

  useEffect(() => {
    if (!actionsOpen) return;

    detailsRef.current?.focus();

    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !actionsRef.current?.contains(event.target)
      ) {
        setActionsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setActionsOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [actionsOpen]);

  return (
    <article
      className="
        flex h-full min-w-0 flex-col rounded-xl
        border border-dashboard-border bg-dashboard-surface
        text-dashboard-text transition-colors
        hover:border-dashboard-blue/40
      "
    >
      <header className="flex items-start gap-3 p-5">
        <span
          aria-hidden="true"
          className={`
            flex size-10 shrink-0 items-center justify-center
            rounded-lg
            ${
              isCompany
                ? "bg-dashboard-purple-soft text-dashboard-purple"
                : "bg-dashboard-blue-soft text-dashboard-blue"
            }
          `}
        >
          <Icon size={19} strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="break-words text-[15px] font-semibold leading-6">
            <Link
              href={detailsUrl}
              className="
                rounded hover:text-dashboard-blue
                focus-visible:outline-2
                focus-visible:outline-dashboard-focus
              "
            >
              {customer.name}
            </Link>
          </h2>

          <p className="mt-1 text-xs text-dashboard-muted">
            {isCompany ? "Company" : "Individual person"}
          </p>
        </div>

        <div
          ref={actionsRef}
          className={`relative shrink-0 ${actionsOpen ? "z-20" : ""}`}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;

            if (
              !(nextTarget instanceof Node) ||
              !event.currentTarget.contains(nextTarget)
            ) {
              setActionsOpen(false);
            }
          }}
        >
          <button
            ref={triggerRef}
            type="button"
            aria-label={`Actions for ${customer.name}`}
            aria-expanded={actionsOpen}
            aria-controls={actionsOpen ? actionsId : undefined}
            onClick={() => setActionsOpen((open) => !open)}
            className="
              inline-flex size-8 items-center justify-center
              rounded-lg text-dashboard-muted transition-colors
              hover:bg-dashboard-hover hover:text-dashboard-text
              focus-visible:outline-2
              focus-visible:outline-dashboard-focus
            "
          >
            <MoreHorizontal size={19} aria-hidden="true" />
          </button>

          {actionsOpen && (
            <div
              id={actionsId}
              role="group"
              aria-label="Customer actions"
              className="
                absolute right-0 top-full mt-2 w-44
                rounded-lg border border-dashboard-border
                bg-dashboard-surface p-1.5 shadow-lg
              "
            >
              <Link
                ref={detailsRef}
                href={detailsUrl}
                onClick={() => setActionsOpen(false)}
                className={ACTION_CLASS}
              >
                <Eye
                  size={15}
                  aria-hidden="true"
                  className="text-dashboard-blue"
                />
                View details
              </Link>

              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setActionsOpen(false);
                  onEdit(customer);
                }}
                className={ACTION_CLASS}
              >
                <Pencil
                  size={15}
                  aria-hidden="true"
                  className="text-dashboard-purple"
                />
                Edit customer
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <dl className="space-y-3 text-[13px]">
          <div className="flex items-start gap-2">
            <dt className="shrink-0 pt-0.5">
              <Mail
                size={15}
                aria-hidden="true"
                className="text-dashboard-blue"
              />
              <span className="sr-only">Email</span>
            </dt>

            <dd className="min-w-0 break-words text-dashboard-muted">
              {customer.email || "No email provided"}
            </dd>
          </div>

          <div className="flex items-start gap-2">
            <dt className="shrink-0 pt-0.5">
              <Phone
                size={15}
                aria-hidden="true"
                className="text-dashboard-green"
              />
              <span className="sr-only">Phone</span>
            </dt>

            <dd className="min-w-0 break-words text-dashboard-muted">
              {customer.phone || "No phone provided"}
            </dd>
          </div>
        </dl>
        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-dashboard-border pt-4">
          {statistics.map((item) => {
            const StatIcon = item.icon;

            return (
              <div key={item.label} className="min-w-0">
                <dt className="text-[11px] leading-5 text-dashboard-muted">
                  {item.label}
                </dt>

                <dd className="mt-2 flex items-center gap-2 text-lg font-semibold tabular-nums">
                  <StatIcon
                    size={15}
                    aria-hidden="true"
                    className={item.color}
                  />
                  {item.value}
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-auto pt-4">
          <div className="flex min-h-6 flex-wrap items-center gap-2 text-xs">
            {accountCount === 0 ? (
              <span className="text-dashboard-muted">
                No login accounts linked
              </span>
            ) : (
              <>
                <span className="rounded-md bg-dashboard-green-soft px-2 py-1 text-dashboard-green">
                  {activeAccounts} active
                </span>

                {inactiveAccounts > 0 && (
                  <span className="rounded-md bg-dashboard-amber-soft px-2 py-1 text-dashboard-amber">
                    {inactiveAccounts} inactive
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
