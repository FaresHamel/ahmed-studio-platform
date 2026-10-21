"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { getMembershipType } from "@/types/user";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", {
    day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

export function UserAccountsTable({ membership = false }: { membership?: boolean }) {
  const { users, total, totalPages, page, limit, loading, error, actioningId, setPage, retry, toggleStatus } = useAdminUsers();
  const columns = membership
    ? ["User", "Membership type", "Phone", "Created", "Account status", "Action"]
    : ["User", "Email", "Created", "Account status", "Action"];
  const disabled = loading || !!actioningId || !!error;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  return <section dir="ltr" className="space-y-4 text-dashboard-text">
    <div>
      <h1 className="text-2xl font-semibold">{membership ? "Membership Status" : "User Management"}</h1>
      <p className="mt-2 text-sm text-dashboard-muted">Use the search in the top bar to find accounts.</p>
    </div>

    {error && <div role="alert" className="dashboard-card flex flex-wrap items-center justify-between gap-3 p-4">
      <p className="text-sm text-rose-600">{error}</p>
      <button type="button" onClick={retry} disabled={loading} className="dashboard-btn-secondary">Try again</button>
    </div>}

    <div className="dashboard-card overflow-hidden" aria-busy={loading}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{membership ? "Membership accounts" : "User accounts"}</caption>
          <thead className="bg-dashboard-hover text-dashboard-muted"><tr>{columns.map(column => <th key={column} scope="col" className="whitespace-nowrap px-5 py-3 font-medium">{column}</th>)}</tr></thead>
          <tbody className={loading ? "opacity-50" : ""}>
            {users.length === 0 ? <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-dashboard-muted">
              {loading ? "Loading accounts…" : error ? "Accounts could not be loaded." : "No accounts found."}
            </td></tr> : users.map(account => {
              const name = account.profiles?.display_name?.trim() || account.email;
              return <tr key={account.id} className="border-t border-dashboard-border hover:bg-dashboard-hover">
                <td className="px-5 py-4"><div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-dashboard-hover font-medium">{name.charAt(0).toUpperCase()}</span>
                  <span className="max-w-60 truncate" title={name}>{name}</span>
                </div></td>
                {membership ? <><td className="px-5 py-4">{getMembershipType(account)}</td><td className="whitespace-nowrap px-5 py-4">{account.profiles?.phone || "—"}</td></> : <td className="px-5 py-4">{account.email}</td>}
                <td className="whitespace-nowrap px-5 py-4 text-dashboard-muted">{formatDate(account.created_at)}</td>
                <td className="px-5 py-4"><span className="capitalize">{account.status}</span></td>
                <td className="px-5 py-4"><button type="button" disabled={disabled} onClick={() => void toggleStatus(account)} className="dashboard-btn-secondary whitespace-nowrap" aria-label={`${account.status === "active" ? "Deactivate" : "Activate"} ${name}`}>
                  {actioningId === account.id ? "Updating…" : account.status === "active" ? "Deactivate" : "Activate"}
                </button></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border px-5 py-4 text-sm">
        <p className="text-dashboard-muted">Showing {start}–{Math.min(page * limit, total)} of {total} results</p>
        <nav aria-label="Accounts pagination" className="flex items-center gap-3">
          <button type="button" disabled={disabled || page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page" className="dashboard-btn-secondary"><ChevronLeft size={16} aria-hidden="true" /></button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" disabled={disabled || page >= totalPages} onClick={() => setPage(page + 1)} aria-label="Next page" className="dashboard-btn-secondary"><ChevronRight size={16} aria-hidden="true" /></button>
        </nav>
      </div>
    </div>
  </section>;
}
