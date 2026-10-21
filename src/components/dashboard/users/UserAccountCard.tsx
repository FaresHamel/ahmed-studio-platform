"use client";

import Link from "next/link";
import type { AdminUser } from "@/types/user";
import {
  accountName,
  accountInitials,
  avatarColor,
  operatorLabel
} from "@/lib/users/account-display";
import { UserAccountActions } from "./UserAccountActions";

export function UserAccountCard({
  account,
  actorId,
  disabled,
  onEdit,
  onStatus
}: {
  account: AdminUser;
  actorId?: string;
  disabled?: boolean;
  onEdit: () => void;
  onStatus: () => void;
}) {
  const operator = account.user_roles.some(({ role }) => role === "operator");
  return (
    <article className="dashboard-card flex min-w-0 flex-col p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-dashboard-muted">
          {operator
            ? "Production team"
            : account.user_roles.some(({ role }) => role === "client")
            ? "Client account"
            : "Administration"}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            account.status === "active"
              ? "bg-dashboard-green-soft text-dashboard-green"
              : "bg-dashboard-red-soft text-dashboard-red"
          }`}
        >
          <span
            className="size-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
          {account.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(
            account.id
          )}`}
        >
          {accountInitials(account)}
        </span>
        <div className="min-w-0">
          <Link
            href={`/dashboard/admin/users/${encodeURIComponent(account.id)}`}
            className="block truncate text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-dashboard-focus"
            title={accountName(account)}
          >
            {accountName(account)}
          </Link>
          <p
            className="mt-0.5 truncate text-[11px] text-dashboard-muted"
            title={account.email}
          >
            {account.email}
          </p>
        </div>
      </div>
      <div className="mb-4 mt-4 text-sm">
        <p className="text-[11px] text-dashboard-muted">
          {operator ? "Specialty" : "Phone"}
        </p>
        <p className="mt-0.5 text-sm">
          {operator
            ? operatorLabel(account.profiles?.operator_type)
            : account.profiles?.phone || "Not provided"}
        </p>
      </div>
      <footer className="mt-auto flex items-center justify-between gap-2 border-t border-dashboard-border pt-2.5">
        <div className="flex flex-wrap gap-1">
          {account.user_roles.map(({ role }) => (
            <span
              key={role}
              className="rounded-md bg-dashboard-hover px-1.5 py-0.5 text-[11px] capitalize text-dashboard-muted"
            >
              {role}
            </span>
          ))}
        </div>
        <UserAccountActions
          account={account}
          isSelf={actorId === account.id}
          disabled={disabled}
          onEdit={onEdit}
          onStatus={onStatus}
        />
      </footer>
    </article>
  );
}
