"use client";

import { DashboardDialog } from "@/components/ui/DashboardDialog";
import { AccountForm } from "./AccountForm";
import { accountName } from "@/lib/users/account-display";
import type { useAccountActions } from "@/hooks/users/useAccountActions";

export function AccountDialogs({ actions }: { actions: ReturnType<typeof useAccountActions> }) {
  const { editor, statusAccount, busy, error } = actions;
  return <>
    {editor && <DashboardDialog title={editor.mode === "edit" ? "Edit account" : editor.kind === "operator" ? "Create operator" : "Create client account"} busy={busy} onClose={actions.close}>
      <AccountForm key={editor.mode === "edit" ? editor.account.id : editor.kind} kind={editor.kind} account={editor.mode === "edit" ? editor.account : undefined} busy={busy} error={error} onSubmit={actions.save} onCancel={actions.close} />
    </DashboardDialog>}
    {statusAccount && <DashboardDialog title={statusAccount.status === "active" ? "Deactivate account?" : "Activate account?"} busy={busy} onClose={actions.close}>
      <p className="text-sm leading-6 text-dashboard-muted">{statusAccount.status === "active" ? "This blocks access to the account. Customer records, jobs and project memberships are retained." : "This restores access according to the account’s existing roles and memberships."}</p>
      <p className="mt-3 break-words text-sm font-medium">{accountName(statusAccount)} — {statusAccount.email}</p>
      {error && <p role="alert" className="mt-4 text-sm text-rose-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-2"><button type="button" disabled={busy} onClick={actions.close} className="dashboard-btn-secondary">Cancel</button><button type="button" disabled={busy} onClick={() => void actions.confirmStatus()} className="dashboard-btn-primary">{busy ? "Updating…" : statusAccount.status === "active" ? "Deactivate" : "Activate"}</button></div>
    </DashboardDialog>}
  </>;
}
