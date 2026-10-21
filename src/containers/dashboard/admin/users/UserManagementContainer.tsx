"use client";

import { Plus, UserRound, Headphones } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useAdminUsers } from "@/hooks/users/useAdminUsers";
import { useAccountActions } from "@/hooks/users/useAccountActions";
import { UserRoleFilter } from "@/components/dashboard/users/UserRoleFilter";
import { UserAccountsGrid } from "@/components/dashboard/users/UserAccountsGrid";
import { AccountDialogs } from "@/components/dashboard/users/AccountDialogs";
import { Pagination } from "@/components/ui/Pagination";

export function UserManagementContainer() {
  const actor = useAuthStore(state => state.user);
  const users = useAdminUsers();
  const actions = useAccountActions(created => users.refresh(created));
  if (!actor?.roles.includes("admin")) return null;

  return <section dir="ltr" className="space-y-6 text-dashboard-text">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-2xl font-semibold">User Management</h1><p className="mt-2 text-sm text-dashboard-muted">Manage login accounts, operator specialties and account access.</p></div>
      <details className="relative"><summary className="dashboard-btn-primary cursor-pointer list-none [&::-webkit-details-marker]:hidden"><Plus size={17} aria-hidden="true" />Create account</summary>
        <div className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-dashboard-border bg-dashboard-surface p-1.5 shadow-lg">
          <button type="button" disabled={actions.busy} onClick={event => { event.currentTarget.closest("details")?.removeAttribute("open"); actions.create("operator"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-dashboard-hover"><Headphones size={16} aria-hidden="true" />Operator</button>
          <button type="button" disabled={actions.busy} onClick={event => { event.currentTarget.closest("details")?.removeAttribute("open"); actions.create("client"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-dashboard-hover"><UserRound size={16} aria-hidden="true" />Client account</button>
        </div>
      </details>
    </header>
    <div className="flex flex-wrap items-center justify-between gap-3"><UserRoleFilter value={users.role} onChange={users.setRole} disabled={actions.busy} /><p role="status" className="text-xs text-dashboard-muted">{users.loading ? "Updating accounts…" : `${users.total} accounts found`}</p></div>
    {users.error && <div role="alert" className="dashboard-card flex items-center justify-between gap-3 p-4"><p className="text-sm text-rose-600">{users.error}</p><button type="button" onClick={users.retry} className="dashboard-btn-secondary">Try again</button></div>}
    <UserAccountsGrid accounts={users.users} actorId={actor.id} loading={users.loading} failed={!!users.error} busy={actions.busy} onEdit={actions.edit} onStatus={actions.requestStatus} />
    <Pagination page={users.page} totalPages={users.totalPages} total={users.total} limit={users.limit} disabled={users.loading || !!users.error || actions.busy} onPageChange={users.setPage} />
    <AccountDialogs actions={actions} />
  </section>;
}

export default UserManagementContainer;
