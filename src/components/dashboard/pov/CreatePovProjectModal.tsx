"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { FolderPlus, X } from "lucide-react";
import toast from "react-hot-toast";

import { usePovPicker } from "@/hooks/pov/usePovPicker";
import { povError } from "@/lib/pov/display";
import { customersService } from "@/services/customers.service";
import { povService } from "@/services/pov.service";
import { usersService } from "@/services/users.service";
import { useAuthStore } from "@/store/auth.store";

import type {
  CustomerListItem,
  PageQuery,
  ProjectInput
} from "@/types/production-api";

interface CreatePovProjectModalProps {
  onClose: () => void;
  onCreated: () => void;
}

interface SelectedAccount {
  id: string;
  name: string;
  email: string;
}

interface PickerPaginationProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

const INPUT_CLASS = "dashboard-input min-h-10 w-full px-3 py-2 text-[13px]";

const LABEL_CLASS = "mb-2 block text-[13px] font-medium";

function loadCustomers(params: PageQuery, signal?: AbortSignal) {
  return customersService.list(params, signal);
}

function loadAccounts(params: PageQuery, signal?: AbortSignal) {
  return usersService.list(
    {
      ...params,
      role: "client"
    },
    signal
  );
}

function PickerPagination({
  page,
  totalPages,
  disabled,
  onPageChange
}: PickerPaginationProps) {
  return (
    <div className="flex items-center justify-end gap-3 text-xs">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="dashboard-btn-secondary"
      >
        Previous
      </button>

      <span className="text-dashboard-muted">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="dashboard-btn-secondary"
      >
        Next
      </button>
    </div>
  );
}

export default function CreatePovProjectModal({
  onClose,
  onCreated
}: CreatePovProjectModalProps) {
  const id = useId();

  const accountId = useAuthStore((state) => state.user?.id);
  const isAdmin = useAuthStore((state) =>
    Boolean(state.user?.roles.includes("admin"))
  );

  const customers = usePovPicker(loadCustomers);
  const accounts = usePovPicker(loadAccounts);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const mounted = useRef(false);
  const saveLock = useRef(false);

  const [customer, setCustomer] = useState<CustomerListItem | null>(null);

  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccount[]>(
    []
  );

  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationDays, setDurationDays] = useState("7");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mounted.current = true;

    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      mounted.current = false;
      dialog?.close();
    };
  }, []);

  function close() {
    if (saveLock.current) return;
    onClose();
  }

  function selectCustomer(next: CustomerListItem) {
    setCustomer(next);

    // Suggest customer information without replacing entered values.
    setContactName((value) => (value.trim() ? value : next.name));
    setPhone((value) => (value.trim() ? value : next.phone || ""));
  }

  function toggleAccount(account: SelectedAccount) {
    setSelectedAccounts((previous) =>
      previous.some((item) => item.id === account.id)
        ? previous.filter((item) => item.id !== account.id)
        : [...previous, account]
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const actor = useAuthStore.getState().user;

    if (saveLock.current || !actor?.roles.includes("admin")) {
      return;
    }

    setError(null);

    const duration = Number(durationDays);

    if (!contactName.trim()) {
      setError("Enter the project contact name.");
      return;
    }

    if (!/^[0-9+\s-]{8,15}$/.test(phone.trim())) {
      setError("Enter a valid phone number of 8–15 characters.");
      return;
    }

    if (!startDate || Number.isNaN(Date.parse(startDate))) {
      setError("Choose a valid start date.");
      return;
    }

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 2_147_483_647
    ) {
      setError("Enter a valid duration in whole days.");
      return;
    }

    if (selectedAccounts.length === 0) {
      setError("Select at least one Client account.");
      return;
    }

    const input: ProjectInput = {
      client_name: contactName.trim(),
      phone: phone.trim(),
      start_date: startDate,
      duration_days: duration,
      contact_user_ids: selectedAccounts.map((account) => account.id),
      ...(customer ? { client_id: customer.id } : {}),
      ...(reference.trim() ? { po_invoice_number: reference.trim() } : {})
    };

    const actorId = actor.id;

    function isCurrentAccount() {
      const current = useAuthStore.getState().user;

      return (
        mounted.current &&
        current?.id === actorId &&
        Boolean(current?.roles.includes("admin"))
      );
    }

    saveLock.current = true;
    setSaving(true);

    try {
      try {
        await povService.create(input);
      } catch (failure) {
        if (isCurrentAccount()) {
          setError(povError(failure, "Could not create the project."));
        }
        return;
      }

      if (!isCurrentAccount()) return;

      toast.success("POV project created.");
      onCreated();
    } finally {
      saveLock.current = false;

      if (mounted.current) {
        setSaving(false);
      }
    }
  }

  const disabled = saving || !isAdmin || !accountId;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl
        overflow-y-auto rounded-xl border border-dashboard-border
        bg-dashboard-surface p-0 text-dashboard-text shadow-xl
        backdrop:bg-black/45
      "
    >
      <header className="flex items-start justify-between gap-4 border-b border-dashboard-border px-5 py-4">
        <div>
          <h2
            id={`${id}-title`}
            className="flex items-center gap-2 text-[15px] font-semibold"
          >
            <FolderPlus
              size={16}
              aria-hidden="true"
              className="text-dashboard-blue"
            />
            Create POV project
          </h2>

          <p
            id={`${id}-description`}
            className="mt-2 text-xs leading-5 text-dashboard-muted"
          >
            Add project information and choose the accounts allowed to access
            it.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={close}
          aria-label="Close create project modal"
          className="rounded-lg p-2 text-dashboard-muted hover:bg-dashboard-hover focus-visible:outline-2 focus-visible:outline-dashboard-focus disabled:opacity-40"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </header>

      <form onSubmit={(event) => void submit(event)}>
        <fieldset disabled={disabled} className="min-w-0 space-y-6 p-5">
          <section className="space-y-3">
            <h3 className="text-[13px] font-semibold">
              Customer link
              <span className="ml-2 font-normal text-dashboard-muted">
                Optional
              </span>
            </h3>

            <div>
              <label htmlFor={`${id}-customer-search`} className={LABEL_CLASS}>
                Search Customers
              </label>

              <input
                id={`${id}-customer-search`}
                type="search"
                value={customers.search}
                onChange={(event) => customers.setSearch(event.target.value)}
                placeholder="Search by name, email or phone"
                className={INPUT_CLASS}
              />
            </div>

            {customer && (
              <div className="flex items-center justify-between gap-3 rounded-lg bg-dashboard-hover p-3">
                <p className="min-w-0 break-words text-[13px]">
                  Selected: <strong>{customer.name}</strong>
                </p>

                <button
                  type="button"
                  onClick={() => setCustomer(null)}
                  className="shrink-0 text-xs text-dashboard-blue hover:underline"
                >
                  Remove link
                </button>
              </div>
            )}

            <div aria-busy={customers.loading} className="space-y-2">
              {customers.loading ? (
                <p role="status" className="text-xs text-dashboard-muted">
                  Loading Customers…
                </p>
              ) : customers.error ? (
                <div role="alert" className="space-y-2">
                  <p className="text-xs text-dashboard-red">
                    {customers.error}
                  </p>

                  <button
                    type="button"
                    onClick={customers.refresh}
                    className="dashboard-btn-secondary"
                  >
                    Try again
                  </button>
                </div>
              ) : customers.items.length === 0 ? (
                <p className="text-xs text-dashboard-muted">
                  No Customers found. You can continue without a link.
                </p>
              ) : (
                customers.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={customer?.id === item.id}
                    onClick={() => selectCustomer(item)}
                    className={`
                      block w-full rounded-lg border p-3 text-left
                      ${
                        customer?.id === item.id
                          ? "border-dashboard-blue bg-dashboard-blue-soft"
                          : "border-dashboard-border hover:bg-dashboard-hover"
                      }
                    `}
                  >
                    <span className="block text-[13px] font-medium">
                      {item.name}
                    </span>

                    <span className="mt-1 block break-words text-xs text-dashboard-muted">
                      {item.email || item.phone || "No contact information"}
                    </span>
                  </button>
                ))
              )}
            </div>

            <PickerPagination
              page={customers.page}
              totalPages={customers.totalPages}
              disabled={
                disabled || customers.loading || Boolean(customers.error)
              }
              onPageChange={customers.setPage}
            />
          </section>

          <section className="border-t border-dashboard-border pt-5">
            <h3 className="mb-4 text-[13px] font-semibold">
              Project information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${id}-contact`} className={LABEL_CLASS}>
                  Project contact name
                </label>

                <input
                  id={`${id}-contact`}
                  required
                  autoComplete="name"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Ahmed Abdullah"
                />
              </div>

              <div>
                <label htmlFor={`${id}-phone`} className={LABEL_CLASS}>
                  Phone
                </label>

                <input
                  id={`${id}-phone`}
                  required
                  type="tel"
                  autoComplete="tel"
                  maxLength={15}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={INPUT_CLASS}
                  placeholder="+966501234567"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${id}-reference`} className={LABEL_CLASS}>
                  PO / invoice reference
                  <span className="ml-2 font-normal text-dashboard-muted">
                    Optional
                  </span>
                </label>

                <input
                  id={`${id}-reference`}
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  className={INPUT_CLASS}
                  placeholder="PO-2026-001"
                />
              </div>

              <div>
                <label htmlFor={`${id}-start`} className={LABEL_CLASS}>
                  Start date
                </label>

                <input
                  id={`${id}-start`}
                  required
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor={`${id}-duration`} className={LABEL_CLASS}>
                  Duration in days
                </label>

                <input
                  id={`${id}-duration`}
                  required
                  type="number"
                  min={1}
                  max={2_147_483_647}
                  step={1}
                  value={durationDays}
                  onChange={(event) => setDurationDays(event.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-dashboard-border pt-5">
            <div>
              <h3 className="text-[13px] font-semibold">Project access</h3>

              <p className="mt-2 text-xs leading-5 text-dashboard-muted">
                Select at least one existing Client account. Linking a Customer
                does not automatically select accounts.
              </p>
            </div>

            <div>
              <label htmlFor={`${id}-account-search`} className={LABEL_CLASS}>
                Search Client accounts
              </label>

              <input
                id={`${id}-account-search`}
                type="search"
                value={accounts.search}
                onChange={(event) => accounts.setSearch(event.target.value)}
                className={INPUT_CLASS}
                placeholder="Search by name or email"
              />
            </div>

            <div aria-busy={accounts.loading} className="space-y-2">
              {accounts.loading ? (
                <p role="status" className="text-xs text-dashboard-muted">
                  Loading accounts…
                </p>
              ) : accounts.error ? (
                <div role="alert" className="space-y-2">
                  <p className="text-xs text-dashboard-red">{accounts.error}</p>

                  <button
                    type="button"
                    onClick={accounts.refresh}
                    className="dashboard-btn-secondary"
                  >
                    Try again
                  </button>
                </div>
              ) : accounts.items.length === 0 ? (
                <p className="text-xs text-dashboard-muted">
                  No Client accounts found. Accounts can be created in User
                  Management.
                </p>
              ) : (
                accounts.items.map((account) => {
                  const name =
                    account.profiles?.display_name?.trim() || account.email;

                  const selected = selectedAccounts.some(
                    (item) => item.id === account.id
                  );

                  return (
                    <label
                      key={account.id}
                      className={`
                        flex cursor-pointer items-start gap-3
                        rounded-lg border p-3
                        ${
                          selected
                            ? "border-dashboard-blue bg-dashboard-blue-soft"
                            : "border-dashboard-border hover:bg-dashboard-hover"
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleAccount({
                            id: account.id,
                            name,
                            email: account.email
                          })
                        }
                        className="mt-1 size-4 shrink-0 accent-blue-600"
                      />

                      <span className="min-w-0">
                        <span className="block break-words text-[13px] font-medium">
                          {name}
                        </span>

                        <span className="mt-1 block break-words text-xs text-dashboard-muted">
                          {account.email}
                          {account.status === "inactive" &&
                            " · Inactive account"}
                        </span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            <PickerPagination
              page={accounts.page}
              totalPages={accounts.totalPages}
              disabled={disabled || accounts.loading || Boolean(accounts.error)}
              onPageChange={accounts.setPage}
            />

            {selectedAccounts.length > 0 && (
              <div className="rounded-lg bg-dashboard-hover p-3">
                <p className="text-xs font-medium text-dashboard-muted">
                  Selected accounts · {selectedAccounts.length}
                </p>

                <ul className="mt-3 space-y-2">
                  {selectedAccounts.map((account) => (
                    <li
                      key={account.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <span
                        className="min-w-0 break-words text-[13px]"
                        title={account.email}
                      >
                        {account.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleAccount(account)}
                        aria-label={`Remove ${account.name} from selection`}
                        className="shrink-0 rounded p-1 text-dashboard-muted hover:text-dashboard-red"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </fieldset>

        {error && (
          <p role="alert" className="px-5 pb-4 text-[13px] text-dashboard-red">
            {error}
          </p>
        )}

        <footer className="flex justify-end gap-3 border-t border-dashboard-border px-5 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={close}
            className="dashboard-btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={disabled || selectedAccounts.length === 0}
            className="dashboard-btn-primary"
          >
            {saving ? "Creating…" : "Create project"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
