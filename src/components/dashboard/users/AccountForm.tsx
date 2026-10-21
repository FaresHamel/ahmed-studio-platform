"use client";

import { useState, type FormEvent } from "react";
import type { AdminUser } from "@/types/user";
import { OPERATOR_OPTIONS } from "@/lib/users/account-display";
import {
  initialAccountFields,
  buildAccountCommand,
  type AccountCommand,
  type AccountKind
} from "@/lib/users/account-form";

export function AccountForm({
  kind,
  account,
  busy,
  error,
  onSubmit,
  onCancel
}: {
  kind: AccountKind;
  account?: AdminUser;
  busy: boolean;
  error: string | null;
  onSubmit: (command: AccountCommand) => Promise<void>;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState(() => initialAccountFields(account));
  const [validation, setValidation] = useState<string | null>(null);
  const operator = account
    ? account.user_roles.some(({ role }) => role === "operator")
    : kind === "operator";
  const options = OPERATOR_OPTIONS.filter(
    (option) =>
      !option.legacy || option.value === account?.profiles?.operator_type
  );
  const unknownSpecialty =
    !!fields.operatorType &&
    !OPERATOR_OPTIONS.some((option) => option.value === fields.operatorType);
  function change(field: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setValidation(null);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    let command: AccountCommand;
    try {
      command = buildAccountCommand(fields, kind, account);
    } catch (failure) {
      setValidation(
        failure instanceof Error ? failure.message : "Check the form."
      );
      return;
    }
    await onSubmit(command);
  }
  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      {!operator && (
        <p className="rounded-lg bg-dashboard-hover p-3 text-xs leading-5 text-dashboard-muted">
          Personal details belong to this login account. Customer membership and
          POV project access are managed separately. No INV is created here.
        </p>
      )}
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
        <label className="block space-y-1.5 text-sm">
          <span>Full name</span>
          <input
            autoComplete="name"
            className="dashboard-input px-3 py-2.5"
            required
            value={fields.name}
            onChange={(event) => change("name", event.target.value)}
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span>Email</span>
          <input
            type="email"
            autoComplete="off"
            className="dashboard-input px-3 py-2.5"
            required
            value={fields.email}
            onChange={(event) => change("email", event.target.value)}
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span>
            Phone <span className="text-dashboard-muted">(optional)</span>
          </span>
          <input
            type="tel"
            autoComplete="tel"
            className="dashboard-input px-3 py-2.5"
            value={fields.phone}
            onChange={(event) => change("phone", event.target.value)}
          />
        </label>
        {operator && (
          <>
            <label className="block space-y-1.5 text-sm">
              <span>Operator specialty</span>
              <select
                required
                className="dashboard-input px-3 py-2.5"
                value={fields.operatorType}
                onChange={(event) => change("operatorType", event.target.value)}
              >
                <option value="" disabled>
                  Select a specialty
                </option>
                {unknownSpecialty && (
                  <option value={fields.operatorType} disabled>
                    {fields.operatorType} — select a supported value
                  </option>
                )}
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                    {option.legacy ? " (existing account)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {!account && (
          <label className="block space-y-1.5 text-sm">
            <span>Password</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="dashboard-input px-3 py-2.5"
              value={fields.password}
              onChange={(event) => change("password", event.target.value)}
            />
            <span className="block text-xs text-dashboard-muted">
              At least 8 characters.
            </span>
          </label>
        )}
      </fieldset>
      {(validation || error) && (
        <p role="alert" className="text-sm text-rose-600">
          {validation || error}
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="dashboard-btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" disabled={busy} className="dashboard-btn-primary">
          {busy ? "Saving…" : account ? "Save changes" : "Create account"}
        </button>
      </div>
    </form>
  );
}
