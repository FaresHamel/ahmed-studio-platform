"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { EllipsisVertical, Eye, Pencil, Power } from "lucide-react";
import type { AdminUser } from "@/types/user";
import { accountName } from "@/lib/users/account-display";

export function UserAccountActions({ account, disabled, isSelf, onEdit, onStatus }: {
  account: AdminUser; disabled?: boolean; isSelf: boolean; onEdit: () => void; onStatus: () => void;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !ref.current?.contains(event.target) && ref.current) ref.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  const item = "flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left text-[13px] hover:bg-dashboard-hover focus-visible:outline-2 focus-visible:outline-dashboard-focus disabled:cursor-not-allowed disabled:opacity-40";
  function close() { if (ref.current) ref.current.open = false; }
  return <details ref={ref} className="relative">
    <summary aria-label={`Actions for ${accountName(account)}`} className="dashboard-icon-button list-none [&::-webkit-details-marker]:hidden"><EllipsisVertical size={16} aria-hidden="true" /></summary>
    <div className="absolute bottom-full right-0 z-20 mb-1.5 w-44 rounded-lg border border-dashboard-border bg-dashboard-surface p-1 text-dashboard-text shadow-lg">
      <Link className={item} onClick={close} href={`/dashboard/admin/users/${encodeURIComponent(account.id)}`}><Eye size={14} aria-hidden="true" />View details</Link>
      <button type="button" className={item} disabled={disabled} onClick={() => { close(); onEdit(); }}><Pencil size={14} aria-hidden="true" />Edit</button>
      <button type="button" className={`${item} ${account.status === "active" ? "text-rose-600" : "text-emerald-600"}`} disabled={disabled || isSelf} title={isSelf ? "You cannot change your own status from this screen" : undefined} onClick={() => { close(); onStatus(); }}><Power size={14} aria-hidden="true" />{account.status === "active" ? "Deactivate" : "Activate"}</button>
    </div>
  </details>;
}