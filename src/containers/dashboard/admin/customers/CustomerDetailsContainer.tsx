"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { CustomerAccountPicker } from "@/components/dashboard/customers/CustomerAccountPicker";
import {
  customerError,
  useCustomerDetails
} from "@/hooks/customers/useCustomerDetails";
import { customersService } from "@/services/customers.service";
import { useAuthStore } from "@/store/auth.store";
import { AccountIdentity } from "@/components/dashboard/customers/AccountIdentity";

type Confirmation =
  | { type: "unlink"; linkId: string; email: string }
  | { type: "delete" }
  | null;

export default function CustomerDetailsContainer({
  customerId
}: {
  customerId: string;
}) {
  const router = useRouter();
  const { customer, error, loading, refresh } = useCustomerDetails(customerId);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const lock = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function perform(
    work: () => Promise<unknown>,
    message: string,
    deleted = false
  ) {
    const actor = useAuthStore.getState().user;

    if (lock.current || !actor?.roles.includes("admin")) return;

    lock.current = true;
    setBusy(true);
    setActionError(null);

    try {
      await work();

      if (!mounted.current || useAuthStore.getState().user?.id !== actor.id) {
        return;
      }

      toast.success(message);
      setConfirmation(null);
      setPickerOpen(false);

      if (deleted) {
        router.replace("/dashboard/admin/customers");
      } else {
        refresh();
      }
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        setActionError(customerError(failure));
      }
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  async function confirmAction() {
    if (!confirmation) return;

    if (confirmation.type === "unlink") {
      await perform(
        () => customersService.detachUser(customerId, confirmation.linkId),
        "Customer access removed."
      );
    } else {
      await perform(
        () => customersService.remove(customerId),
        "Customer deleted.",
        true
      );
    }
  }

  if (loading) {
    return (
      <p role="status" className="py-10 text-dashboard-muted">
        Loading customer…
      </p>
    );
  }

  if (error) {
    return (
      <section className="dashboard-card space-y-4 p-6">
        <p role="alert" className="text-rose-600">
          {error}
        </p>
        <button
          type="button"
          onClick={refresh}
          className="dashboard-btn-secondary"
        >
          Try again
        </button>
        <Link
          href="/dashboard/admin/customers"
          className="block text-sm underline"
        >
          Back to Customers
        </Link>
      </section>
    );
  }

  if (!customer) return null;

  const hasWork =
    customer.ind_clients.length > 0 || customer.pov_projects.length > 0;

  return (
    <section dir="ltr" className="space-y-6 text-dashboard-text">
      <header>
        <Link
          href="/dashboard/admin/customers"
          className="text-sm text-dashboard-muted hover:underline"
        >
          ← Back to Customers
        </Link>
        <h1 className="mt-4 break-words text-2xl font-semibold">
          {customer.name}
        </h1>
        <p className="mt-2 text-sm text-dashboard-muted">
          {customer.client_type === "company" ? "Company" : "Individual person"}
        </p>
      </header>

      {actionError && (
        <p role="alert" className="text-sm text-rose-600">
          {actionError}
        </p>
      )}

      <section className="dashboard-card p-5">
        <h2 className="font-semibold">Customer information</h2>

        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-dashboard-muted">Email</dt>
            <dd className="mt-1 break-words text-sm">
              {customer.email || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-dashboard-muted">Phone</dt>
            <dd className="mt-1 text-sm">{customer.phone || "Not provided"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-dashboard-muted">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap break-words text-sm">
              {customer.notes || "No notes"}
            </dd>
          </div>
        </dl>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-dashboard-border pt-5">
          <div>
            <dt className="text-xs text-dashboard-muted">Individual jobs</dt>
            <dd className="mt-1 text-xl font-semibold">
              {customer.ind_clients.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-dashboard-muted">POV projects</dt>
            <dd className="mt-1 text-xl font-semibold">
              {customer.pov_projects.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-dashboard-muted">Linked accounts</dt>
            <dd className="mt-1 text-xl font-semibold">
              {customer.client_users.length}
            </dd>
          </div>
        </dl>
      </section>

      <section className="dashboard-card space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Accounts & Individual access</h2>
          <button
            type="button"
            disabled={busy || !!confirmation}
            onClick={() => {
              setActionError(null);
              setPickerOpen((value) => !value);
            }}
            className="dashboard-btn-secondary"
          >
            {pickerOpen ? "Close account search" : "Link account"}
          </button>
        </div>

        <p className="text-sm leading-6 text-dashboard-muted">
          Linked accounts can access all Individual jobs for this customer. POV
          access is controlled separately per project.
        </p>

        {customer.client_users.length === 0 ? (
          <p className="text-sm text-dashboard-muted">
            No accounts linked yet.
          </p>
        ) : (
          <ul className="divide-y divide-dashboard-border">
            {customer.client_users.map((link) => (
              <li
                key={link.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <AccountIdentity account={link.users} />
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setActionError(null);
                    setPickerOpen(false);
                    setConfirmation({
                      type: "unlink",
                      linkId: link.id,
                      email: link.users.email
                    });
                  }}
                  className="dashboard-btn-secondary"
                  aria-label={`Remove customer access for ${link.users.email}`}
                >
                  Remove access
                </button>
              </li>
            ))}
          </ul>
        )}

        {pickerOpen && !confirmation && (
          <div className="border-t border-dashboard-border pt-5">
            <CustomerAccountPicker
              linkedUserIds={customer.client_users.map((link) => link.user_id)}
              busy={busy}
              onLink={(userId) =>
                perform(
                  () => customersService.attachUser(customerId, userId),
                  "Account linked."
                )
              }
            />
          </div>
        )}
      </section>

      <section className="dashboard-card space-y-3 p-5">
        <h2 className="font-semibold">Delete customer</h2>
        <p className="text-sm leading-6 text-dashboard-muted">
          {hasWork
            ? "Deletion is blocked because this customer has Individual jobs or POV projects."
            : "Deleting this customer removes its customer memberships. Login accounts and independent POV memberships are preserved."}
        </p>
        <button
          type="button"
          disabled={busy || hasWork || !!confirmation}
          onClick={() => {
            setActionError(null);
            setPickerOpen(false);
            setConfirmation({ type: "delete" });
          }}
          className="dashboard-btn-secondary"
        >
          Delete customer
        </button>
      </section>

      {confirmation && (
        <section
          aria-labelledby="customer-confirmation-title"
          className="dashboard-card space-y-4 p-5"
        >
          <h2 id="customer-confirmation-title" className="font-semibold">
            {confirmation.type === "unlink"
              ? "Remove customer access?"
              : "Permanently delete customer?"}
          </h2>

          <p className="text-sm leading-6 text-dashboard-muted">
            {confirmation.type === "unlink"
              ? `${confirmation.email} will lose access through this customer membership to its Individual jobs. The login account and independent POV memberships will remain.`
              : `Delete ${customer.name}? This cannot be undone. Linked login accounts will not be deleted.`}
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setConfirmation(null);
                setActionError(null);
              }}
              className="dashboard-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void confirmAction()}
              className="dashboard-btn-primary"
            >
              {busy
                ? "Processing…"
                : confirmation.type === "unlink"
                ? "Confirm removal"
                : "Confirm deletion"}
            </button>
          </div>
        </section>
      )}
    </section>
  );
}
