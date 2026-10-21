"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Power } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUserAccount } from "@/hooks/users/useUserAccount";
import { useAccountActions } from "@/hooks/users/useAccountActions";
import { AccountDialogs } from "@/components/dashboard/users/AccountDialogs";
import { accountName, accountInitials, avatarColor, operatorLabel, formatAccountDate } from "@/lib/users/account-display";

export default function UserAccountDetailsContainer({ userId }: { userId: string }) {
  const actor = useAuthStore(state => state.user);
  const { account, loading, error, refresh } = useUserAccount(userId);
  const actions = useAccountActions(() => refresh());
  if (!actor?.roles.includes("admin")) return null;
  return <section dir="ltr" className="space-y-6 text-dashboard-text">
    <Link href="/dashboard/admin/users" className="inline-flex items-center gap-2 text-sm text-dashboard-muted hover:text-dashboard-text"><ArrowLeft size={16} aria-hidden="true" />Back to accounts</Link>
    <h1 className="text-2xl font-semibold">Account details</h1>
    {loading && <div role="status" className="dashboard-card animate-pulse p-8 text-dashboard-muted">Loading account…</div>}
    {error && <div role="alert" className="dashboard-card space-y-3 p-6"><p className="text-sm text-rose-600">{error}</p><button type="button" onClick={refresh} className="dashboard-btn-secondary">Try again</button></div>}
    {account && <>
      <div className="dashboard-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4"><span aria-hidden="true" className={`flex size-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold ${avatarColor(account.id)}`}>{accountInitials(account)}</span><div className="min-w-0"><h2 className="break-words text-lg font-semibold">{accountName(account)}</h2><p className="mt-1 break-all text-sm text-dashboard-muted">{account.email}</p></div></div>
          <div className="flex flex-wrap gap-2"><button type="button" disabled={actions.busy} onClick={() => actions.edit(account)} className="dashboard-btn-secondary"><Pencil size={16} aria-hidden="true" />Edit</button><button type="button" disabled={actions.busy || actor.id === account.id} onClick={() => actions.requestStatus(account)} className="dashboard-btn-secondary"><Power size={16} aria-hidden="true" />{account.status === "active" ? "Deactivate" : "Activate"}</button></div>
        </div>
        <dl className="mt-8 grid gap-6 border-t border-dashboard-border pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-xs text-dashboard-muted">Account status</dt><dd className="mt-1 capitalize">{account.status}</dd></div>
          <div><dt className="text-xs text-dashboard-muted">Roles</dt><dd className="mt-1 capitalize">{account.user_roles.map(item => item.role).join(", ") || "—"}</dd></div>
          <div><dt className="text-xs text-dashboard-muted">Phone</dt><dd className="mt-1">{account.profiles?.phone || "Not provided"}</dd></div>
          {account.user_roles.some(item => item.role === "operator") && <div><dt className="text-xs text-dashboard-muted">Operator specialty</dt><dd className="mt-1">{operatorLabel(account.profiles?.operator_type)}</dd></div>}
          <div><dt className="text-xs text-dashboard-muted">Created</dt><dd className="mt-1">{formatAccountDate(account.created_at)}</dd></div>
          <div><dt className="text-xs text-dashboard-muted">Updated</dt><dd className="mt-1">{formatAccountDate(account.updated_at)}</dd></div>
        </dl>
      </div>
      {actor.id === account.id && <p className="text-sm text-dashboard-muted">Use another administrator account to change this account’s access status.</p>}
    </>}
    <AccountDialogs actions={actions} />
  </section>;
}
