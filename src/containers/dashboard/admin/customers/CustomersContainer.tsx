"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import CustomerCard from "@/components/dashboard/customers/CustomerCard";
import CustomerEditorModal from "@/components/dashboard/customers/CustomerEditorModal";
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
    if (typeof message === "string" && message.trim()) return message;
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

  const accountId = useAuthStore((state) => state.user?.id);

  const [editor, setEditor] = useState<Editor>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveLock = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setEditor(null);
    setSaveError(null);
  }, [accountId, canLoad]);

  function openEditor(next: NonNullable<Editor>) {
    const actor = useAuthStore.getState().user;

    if (saveLock.current || !canLoad || !actor?.roles.includes("admin")) {
      return;
    }

    setSaveError(null);
    setEditor(next);
  }

  function closeEditor() {
    if (saveLock.current) return;

    setEditor(null);
    setSaveError(null);
  }

  async function save(input: CustomerInput) {
    const actor = useAuthStore.getState().user;
    const currentEditor = editor;

    if (!currentEditor || saveLock.current || !actor?.roles.includes("admin")) {
      return;
    }

    function isCurrent() {
      const currentUser = useAuthStore.getState().user;

      return (
        mounted.current &&
        currentUser?.id === actor?.id &&
        Boolean(currentUser?.roles.includes("admin"))
      );
    }

    saveLock.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      try {
        if (currentEditor.mode === "edit") {
          await customersService.update(currentEditor.customer.id, input);
        } else {
          await customersService.create(input);
        }
      } catch (failure) {
        if (isCurrent()) {
          setSaveError(errorMessage(failure));
        }

        return;
      }

      if (!isCurrent()) return;

      toast.success(
        currentEditor.mode === "edit"
          ? "Customer updated."
          : "Customer created."
      );

      setEditor(null);
      setSaveError(null);

      try {
        await refresh();
      } catch {
        if (isCurrent()) {
          toast.error(
            "Customer saved, but the list could not refresh. Reload the page."
          );
        }
      }
    } finally {
      saveLock.current = false;

      if (mounted.current) {
        setSaving(false);
      }
    }
  }

  async function retryLoad() {
    try {
      await refresh();
    } catch {
      // The hook exposes the loading error.
    }
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <section dir="ltr" className="min-w-0 space-y-6 text-dashboard-text">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>

          <p className="mt-2 text-sm text-dashboard-muted">
            Search by name, email, or phone using the top bar.
          </p>
        </div>

        <button
          type="button"
          disabled={!canLoad || saving}
          onClick={() => openEditor({ mode: "create" })}
          className="dashboard-btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} aria-hidden="true" />
          Create customer
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="
            flex flex-wrap items-center justify-between gap-3
            rounded-[4px] border border-dashboard-border
            bg-dashboard-surface p-4
          "
        >
          <p className="text-sm text-dashboard-red">{error}</p>

          <button
            type="button"
            onClick={retryLoad}
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
        ) : !canLoad ? (
          <p className="py-10 text-center text-dashboard-muted">
            Customers are unavailable for this account.
          </p>
        ) : !error && customers.length === 0 ? (
          <div className="rounded-[4px] border border-dashboard-border bg-dashboard-surface p-10 text-center">
            <p className="font-medium">No customers found.</p>

            <p className="mt-2 text-sm text-dashboard-muted">
              Create a customer or try another search.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                disabled={saving || !canLoad}
                onEdit={(selectedCustomer) =>
                  openEditor({
                    mode: "edit",
                    customer: selectedCustomer
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <p className="text-dashboard-muted">
          Showing {start}–{end} of {total}
        </p>

        <nav
          aria-label="Customers pagination"
          className="flex items-center gap-3"
        >
          <button
            type="button"
            disabled={!canLoad || loading || Boolean(error) || page <= 1}
            onClick={() => setPage(page - 1)}
            className="dashboard-btn-secondary"
          >
            Previous
          </button>

          <span className="whitespace-nowrap">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={
              !canLoad || loading || Boolean(error) || page >= totalPages
            }
            onClick={() => setPage(page + 1)}
            className="dashboard-btn-secondary"
          >
            Next
          </button>
        </nav>
      </footer>

      {editor && canLoad && (
        <CustomerEditorModal
          key={`${accountId}-${
            editor.mode === "edit" ? editor.customer.id : "new"
          }`}
          customer={editor.mode === "edit" ? editor.customer : undefined}
          busy={saving}
          error={saveError}
          onSubmit={save}
          onClose={closeEditor}
        />
      )}
    </section>
  );
}
