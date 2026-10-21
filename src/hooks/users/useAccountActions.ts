"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { usersService } from "@/services/users.service";
import { accountError } from "@/lib/users/account-errors";
import type { AdminUser } from "@/types/user";
import type { AccountCommand, AccountKind } from "@/lib/users/account-form";

export type AccountEditor =
  | { mode: "create"; kind: AccountKind }
  | { mode: "edit"; kind: AccountKind; account: AdminUser };
export function useAccountActions(onSaved: (created: boolean) => void) {
  const [editor, setEditor] = useState<AccountEditor | null>(null);
  const [statusAccount, setStatusAccount] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function create(kind: AccountKind) {
    if (!lock.current) {
      setError(null);
      setEditor({ mode: "create", kind });
    }
  }
  function edit(account: AdminUser) {
    if (!lock.current) {
      setError(null);
      setEditor({
        mode: "edit",
        kind: account.user_roles.some((item) => item.role === "operator")
          ? "operator"
          : "client",
        account
      });
    }
  }
  function close() {
    if (!lock.current) {
      setEditor(null);
      setStatusAccount(null);
      setError(null);
    }
  }
  function requestStatus(account: AdminUser) {
    if (!lock.current) {
      setError(null);
      setStatusAccount(account);
    }
  }

  async function execute(
    work: () => Promise<unknown>,
    created: boolean,
    message: string
  ) {
    const actor = useAuthStore.getState().user;
    if (lock.current || !actor?.roles.includes("admin")) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await work();
      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        setEditor(null);
        setStatusAccount(null);
        toast.success(message);
        onSaved(created);
      }
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actor.id)
        setError(accountError(failure));
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function save(command: AccountCommand) {
    return execute(
      () => {
        switch (command.action) {
          case "create-operator":
            return usersService.createOperator(command.data);
          case "create-client":
            return usersService.createClient(command.data);
          case "update-operator":
            return usersService.updateOperator(command.id, command.data);
          case "update-client":
            return usersService.updateClientAccount(
              command.id,
              command.data,
            );
        }
      },
      command.action.startsWith("create"),
      command.action.startsWith("create")
        ? "Account created. Search or filter to locate it."
        : "Account updated."
    );
  }
  async function confirmStatus() {
    if (!statusAccount || statusAccount.id === useAuthStore.getState().user?.id)
      return;
    const account = statusAccount;
    return execute(
      () =>
        account.status === "active"
          ? usersService.deactivate(account.id)
          : usersService.activate(account.id),
      false,
      account.status === "active"
        ? "Account deactivated."
        : "Account activated."
    );
  }
  return {
    editor,
    statusAccount,
    busy,
    error,
    create,
    edit,
    close,
    save,
    requestStatus,
    confirmStatus
  };
}
