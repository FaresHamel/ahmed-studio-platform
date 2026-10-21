"use client";

import type { AdminUser } from "@/types/user";
import { UserAccountCard } from "./UserAccountCard";

export function UserAccountsGrid({ accounts, actorId, loading, failed, busy, onEdit, onStatus }: {
  accounts: AdminUser[]; actorId?: string; loading: boolean; failed: boolean; busy: boolean;
  onEdit: (account: AdminUser) => void; onStatus: (account: AdminUser) => void;
}) {
  if (!accounts.length && loading) return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" role="status" aria-label="Loading accounts">{Array.from({ length: 6 }, (_, index) => <div key={index} className="dashboard-card h-64 animate-pulse bg-dashboard-hover" aria-hidden="true" />)}</div>;
  if (!accounts.length) return <div className="dashboard-card p-12 text-center text-sm text-dashboard-muted">{failed ? "Accounts could not be loaded." : "No accounts match your search and filter."}</div>;
  return <div aria-busy={loading} className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}>{accounts.map(account => <UserAccountCard key={account.id} account={account} actorId={actorId} disabled={busy || loading || failed} onEdit={() => onEdit(account)} onStatus={() => onStatus(account)} />)}</div>;
}
