"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Building2, Check, UserRound, X } from "lucide-react";
import { customersService } from "@/services/customers.service";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { CustomerListItem, NewJobInput } from "@/types/production-api";

interface Props {
  busy: boolean;
  error: string | null;
  onSubmit: (input: NewJobInput) => Promise<void>;
  onCancel: () => void;
}

export function CreateIndividualJobForm({
  busy,
  error,
  onSubmit,
  onCancel
}: Props) {
  const id = useId();

  const [selected, setSelected] = useState<CustomerListItem | null>(null);
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim());

  const [pagination, setPagination] = useState({
    query: "",
    page: 1
  });

  const [revision, setRevision] = useState(0);

  const [result, setResult] = useState<{
    key: string;
    customers: CustomerListItem[];
    totalPages: number;
    error?: string;
  } | null>(null);

  const [inv, setInv] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [validation, setValidation] = useState<string | null>(null);

  const page = pagination.query === query ? pagination.page : 1;
  const key = JSON.stringify([query, page, revision]);
  const current = result?.key === key ? result : null;
  const searching = search.trim() !== query || !current;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await customersService.list(
          {
            page,
            limit: 10,
            search: query || undefined
          },
          controller.signal
        );

        if (controller.signal.aborted) return;

        const totalPages = Math.max(1, response.meta.totalPages);

        if (page > totalPages) {
          setPagination({ query, page: totalPages });
          return;
        }

        setResult({
          key,
          customers: response.data,
          totalPages
        });
      } catch {
        if (!controller.signal.aborted) {
          setResult({
            key,
            customers: [],
            totalPages: 1,
            error: "Could not load customers."
          });
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [key, page, query]);

  function unselectCustomer() {
    setSelected(null);
    setValidation(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    if (!selected) {
      setValidation("Select a customer.");
      return;
    }

    if (!/^[0-9]{6}$/.test(inv)) {
      setValidation("INV must contain exactly six digits.");
      return;
    }

    const cleanPhone = phone.trim();

    if (cleanPhone && !/^[0-9+\s-]{8,15}$/.test(cleanPhone)) {
      setValidation("Enter a valid phone number.");
      return;
    }

    setValidation(null);

    await onSubmit({
      client_id: selected.id,
      inv_no: inv,
      ...(name.trim() ? { name: name.trim() } : {}),
      ...(cleanPhone ? { phone: cleanPhone } : {})
    });
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      aria-busy={busy}
      className="space-y-6"
    >
      <header>
        <h2 className="text-lg font-semibold text-dashboard-text">
          Create Individual job
        </h2>

        <p className="mt-2 text-sm leading-6 text-dashboard-muted">
          Select an existing customer, then enter the job information. This
          creates one INV job without creating a login account.
        </p>
      </header>

      <fieldset disabled={busy} className="space-y-6">
        <section aria-labelledby={`${id}-customer-title`} className="space-y-4">
          <div>
            <h3
              id={`${id}-customer-title`}
              className="text-sm font-semibold text-dashboard-text"
            >
              Choose customer
            </h3>

            <p className="mt-1 text-xs leading-5 text-dashboard-muted">
              Choose the person or company that owns this job.
            </p>
          </div>

          <div>
            <label
              htmlFor={`${id}-customer`}
              className="mb-2 block text-sm font-medium"
            >
              Search customers
            </label>

            <input
              id={`${id}-customer`}
              type="search"
              className="dashboard-input min-h-12 px-3 py-3"
              placeholder="Name, email, or phone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {selected && (
            <div
              role="status"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-500/25 bg-blue-500/10 p-3"
            >
              <div className="min-w-0">
                <p className="text-xs text-dashboard-muted">
                  Selected customer
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-dashboard-text">
                  {selected.name}
                </p>
              </div>

              <button
                type="button"
                onClick={unselectCustomer}
                className="
                  inline-flex items-center gap-1.5 rounded-lg
                  border border-rose-500/25 bg-rose-500/10
                  px-3 py-2 text-xs font-medium text-rose-500
                  transition-colors hover:bg-rose-500/20
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-dashboard-focus
                "
              >
                <X size={14} aria-hidden="true" />
                Unselect
              </button>
            </div>
          )}

          <div aria-busy={searching}>
            {searching ? (
              <p role="status" className="text-sm text-dashboard-muted">
                Loading customers…
              </p>
            ) : current?.error ? (
              <div role="alert" className="space-y-2">
                <p className="text-sm text-rose-600">{current.error}</p>

                <button
                  type="button"
                  onClick={() => setRevision((value) => value + 1)}
                  className="dashboard-btn-secondary"
                >
                  Try again
                </button>
              </div>
            ) : current?.customers.length === 0 ? (
              <p className="text-sm text-dashboard-muted">
                No customers found. Create one in Customers first.
              </p>
            ) : (
              <div className="space-y-2">
                {current?.customers.map((customer) => {
                  const isSelected = selected?.id === customer.id;
                  const isCompany = customer.client_type === "company";
                  const Icon = isCompany ? Building2 : UserRound;

                  return (
                    <button
                      key={customer.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? "Unselect" : "Select"} ${
                        customer.name
                      }`}
                      onClick={() => {
                        setSelected(isSelected ? null : customer);
                        setValidation(null);
                      }}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-xl border p-3 text-left
                        text-dashboard-text transition-colors
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-dashboard-focus
                        ${
                          isSelected
                            ? "border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/15"
                            : "border-dashboard-border bg-dashboard-surface hover:border-blue-500/30 hover:bg-dashboard-hover"
                        }
                      `}
                    >
                      <span
                        aria-hidden="true"
                        className={`
                          flex size-11 shrink-0
                          items-center justify-center
                          rounded-xl border
                          ${
                            isCompany
                              ? "border-violet-500/25 bg-violet-500/10 text-violet-500"
                              : "border-blue-500/25 bg-blue-500/10 text-blue-500"
                          }
                        `}
                      >
                        <Icon size={21} strokeWidth={1.75} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className="
                            block truncate text-sm font-semibold
                            transition-colors
                            group-hover:text-blue-500
                          "
                        >
                          {customer.name}
                        </span>

                        <span className="mt-1 block truncate text-xs text-dashboard-muted">
                          {isCompany ? "Company" : "Individual person"}

                          {customer.email
                            ? ` · ${customer.email}`
                            : customer.phone
                            ? ` · ${customer.phone}`
                            : ""}
                        </span>
                      </span>

                      <span
                        className={`
                          inline-flex shrink-0 items-center gap-1.5
                          rounded-lg border px-3 py-2
                          text-xs font-medium transition-colors
                          ${
                            isSelected
                              ? "border-rose-500/25 bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/15"
                              : "border-blue-500/25 bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/15"
                          }
                        `}
                      >
                        {isSelected ? (
                          <X size={14} aria-hidden="true" />
                        ) : (
                          <Check size={14} aria-hidden="true" />
                        )}

                        {isSelected ? "Unselect" : "Select"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <nav
            aria-label="Customer search pagination"
            className="flex flex-wrap items-center justify-end gap-3 text-sm"
          >
            <button
              type="button"
              disabled={searching || !!current?.error || page <= 1}
              onClick={() => setPagination({ query, page: page - 1 })}
              className="dashboard-btn-secondary"
            >
              Previous
            </button>

            <span className="text-dashboard-muted">
              Page {page} of {current?.totalPages ?? 1}
            </span>

            <button
              type="button"
              disabled={
                searching ||
                !!current?.error ||
                page >= (current?.totalPages ?? 1)
              }
              onClick={() => setPagination({ query, page: page + 1 })}
              className="dashboard-btn-secondary"
            >
              Next
            </button>
          </nav>
        </section>

        <section
          aria-labelledby={`${id}-job-information`}
          className="space-y-5 rounded-xl border border-dashboard-border p-4 sm:p-5"
        >
          <div>
            <h3
              id={`${id}-job-information`}
              className="text-sm font-semibold text-dashboard-text"
            >
              Job information
            </h3>

            <p className="mt-1 text-xs leading-5 text-dashboard-muted">
              Enter a unique six-digit INV. Leave the contact fields empty to
              use the selected customer’s information.
            </p>
          </div>

          <div>
            <label
              htmlFor={`${id}-inv`}
              className="mb-2 block text-sm font-medium"
            >
              INV number
              <span className="ms-1 text-dashboard-muted">*</span>
            </label>

            <input
              id={`${id}-inv`}
              type="text"
              inputMode="numeric"
              required
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              placeholder="123456"
              aria-describedby={`${id}-inv-help`}
              className="dashboard-input min-h-12 px-3 py-3"
              value={inv}
              onChange={(event) => {
                setInv(event.target.value);
                setValidation(null);
              }}
            />

            <p
              id={`${id}-inv-help`}
              className="mt-2 text-xs text-dashboard-muted"
            >
              Exactly six digits, including any leading zeros.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${id}-name`}
                className="mb-2 block text-sm font-medium"
              >
                Job contact name
                <span className="ms-1 font-normal text-dashboard-muted">
                  (optional)
                </span>
              </label>

              <input
                id={`${id}-name`}
                autoComplete="name"
                className="dashboard-input min-h-12 px-3 py-3"
                placeholder={selected?.name || "Uses customer name"}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setValidation(null);
                }}
              />
            </div>

            <div>
              <label
                htmlFor={`${id}-phone`}
                className="mb-2 block text-sm font-medium"
              >
                Job contact phone
                <span className="ms-1 font-normal text-dashboard-muted">
                  (optional)
                </span>
              </label>

              <input
                id={`${id}-phone`}
                type="tel"
                autoComplete="tel"
                className="dashboard-input min-h-12 px-3 py-3"
                placeholder={selected?.phone || "Uses customer phone"}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setValidation(null);
                }}
              />
            </div>
          </div>
        </section>
      </fieldset>

      {(validation || error) && (
        <p role="alert" className="text-sm text-rose-600">
          {validation || error}
        </p>
      )}

      <footer className="flex justify-end gap-2 border-t border-dashboard-border pt-5">
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="dashboard-btn-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={busy || !selected}
          className="dashboard-btn-primary"
        >
          {busy ? "Creating…" : "Create job"}
        </button>
      </footer>
    </form>
  );
}
