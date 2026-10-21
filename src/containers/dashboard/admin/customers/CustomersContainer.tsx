"use client";

import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Building2, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { CustomerForm } from "@/components/dashboard/customers/CustomerForm";
import { useCustomers } from "@/hooks/customers/useCustomers";
import { customersService } from "@/services/customers.service";
import { useAuthStore } from "@/store/auth.store";
import type { CustomerInput, CustomerListItem } from "@/types/production-api";

type Editor =
  | { mode: "create" }
  | { mode: "edit"; customer: CustomerListItem }
  | null;

function errorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
  }

  return "Could not save the customer. Please try again.";
}

export default function CustomersContainer() {
  const {
    customers,
    total,
    totalPages,
    page,
    limit,
    loading,
    error,
    canLoad,
    setPage,
    refresh
  } = useCustomers();

  const [editor, setEditor] = useState<Editor>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveLock = useRef(false);

  function openEditor(next: NonNullable<Editor>) {
    if (saveLock.current) return;
    setSaveError(null);
    setEditor(next);
  }

  async function save(input: CustomerInput) {
    const actor = useAuthStore.getState().user;

    if (!editor || saveLock.current || !actor?.roles.includes("admin")) {
      return;
    }

    saveLock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      if (editor.mode === "edit") {
        await customersService.update(editor.customer.id, input);
      } else {
        await customersService.create(input);
      }

      if (useAuthStore.getState().user?.id !== actor.id) return;

      toast.success(
        editor.mode === "edit" ? "Customer updated." : "Customer created."
      );

      setEditor(null);
      refresh();
    } catch (failure) {
      if (useAuthStore.getState().user?.id === actor.id) {
        setSaveError(errorMessage(failure));
      }
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  return (
    <section dir="ltr" className="space-y-6 text-dashboard-text">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="mt-2 text-sm text-dashboard-muted">
            Manage business customers. Search by name, email, or phone using the
            top bar.
          </p>
        </div>

        <button
          type="button"
          disabled={!canLoad || saving}
          onClick={() => openEditor({ mode: "create" })}
          className="dashboard-btn-primary"
        >
          <Plus size={16} aria-hidden="true" />
          Create customer
        </button>
      </header>

      {editor && (
        <section className="dashboard-card max-w-2xl space-y-4 p-5">
          <CustomerForm
            key={editor.mode === "edit" ? editor.customer.id : "new-customer"}
            customer={editor.mode === "edit" ? editor.customer : undefined}
            busy={saving}
            error={saveError}
            onSubmit={save}
            onCancel={() => {
              if (!saveLock.current) setEditor(null);
            }}
          />
        </section>
      )}

      {error && (
        <div
          role="alert"
          className="dashboard-card flex items-center justify-between gap-3 p-4"
        >
          <p className="text-sm text-rose-600">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="dashboard-btn-secondary"
          >
            Try again
          </button>
        </div>
      )}

      <div aria-busy={loading}>
        {loading ? (
          <p role="status" className="py-10 text-center text-dashboard-muted">
            Loading customers…
          </p>
        ) : !error && customers.length === 0 ? (
          <div className="dashboard-card p-10 text-center">
            <p className="font-medium">No customers found.</p>
            <p className="mt-2 text-sm text-dashboard-muted">
              Create a customer or try another search.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => {
              const Icon =
                customer.client_type === "company" ? Building2 : UserRound;

              return (
                <article
                  key={customer.id}
                  className="dashboard-card flex flex-col p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                      <Icon size={20} aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2
                        className="truncate font-semibold"
                        title={customer.name}
                      >
                        {customer.name}
                      </h2>
                      <p className="mt-1 text-xs text-dashboard-muted">
                        {customer.client_type === "company"
                          ? "Company"
                          : "Individual person"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-dashboard-muted">
                    <p className="break-words">
                      {customer.email || "No email provided"}
                    </p>
                    <p>{customer.phone || "No phone provided"}</p>
                  </div>

                  <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-dashboard-border pt-4 text-center">
                    {[
                      ["Jobs", customer._count.ind_clients],
                      ["POV", customer._count.pov_projects],
                      ["Accounts", customer.client_users.length]
                    ].map(([label, count]) => (
                      <div key={label}>
                        <dt className="text-xs text-dashboard-muted">
                          {label}
                        </dt>
                        <dd className="mt-1 font-semibold">{count}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/admin/customers/${encodeURIComponent(
                        customer.id
                      )}`}
                      className="dashboard-btn-secondary"
                    >
                      View details
                    </Link>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        openEditor({
                          mode: "edit",
                          customer
                        })
                      }
                      className="dashboard-btn-secondary"
                    >
                      Edit customer
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-dashboard-muted">
          Showing {start}–{Math.min(page * limit, total)} of {total}
        </p>

        <nav
          aria-label="Customers pagination"
          className="flex items-center gap-3"
        >
          <button
            type="button"
            disabled={!canLoad || loading || !!error || page <= 1}
            onClick={() => setPage(page - 1)}
            className="dashboard-btn-secondary"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={!canLoad || loading || !!error || page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="dashboard-btn-secondary"
          >
            Next
          </button>
        </nav>
      </footer>
    </section>
  );
}
