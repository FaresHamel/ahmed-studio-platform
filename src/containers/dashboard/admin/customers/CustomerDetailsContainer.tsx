"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  FolderOpen,
  Link2,
  Mail,
  Phone,
  ShieldAlert,
  Trash2,
  UsersRound,
  UserRound,
  type LucideIcon
} from "lucide-react";
import toast from "react-hot-toast";

import { CustomerAccountPicker } from "@/components/dashboard/customers/CustomerAccountPicker";
import { AccountIdentity } from "@/components/dashboard/customers/AccountIdentity";
import CustomerDetailsModal from "@/components/dashboard/customers/CustomerDetailsModal";

import {
  customerError,
  useCustomerDetails
} from "@/hooks/customers/useCustomerDetails";

import { customersService } from "@/services/customers.service";
import { useAuthStore } from "@/store/auth.store";

type Confirmation =
  | { type: "unlink"; linkId: string; email: string }
  | { type: "delete" }
  | null;

interface SectionProps {
  title: string;
  icon: LucideIcon;
  color?: string;
  action?: ReactNode;
  children: ReactNode;
}

function DetailSection({
  title,
  icon: Icon,
  color = "text-dashboard-blue",
  action,
  children
}: SectionProps) {
  return (
    <section className="min-w-0 rounded-xl border border-dashboard-border bg-dashboard-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-dashboard-border px-5 py-4">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold">
          <Icon
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
            className={`shrink-0 ${color}`}
          />
          {title}
        </h2>

        {action}
      </header>

      <div className="p-5">{children}</div>
    </section>
  );
}

function ContactField({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string | null;
  icon: LucideIcon;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 text-xs text-dashboard-muted">
        <Icon size={14} aria-hidden="true" className="text-dashboard-blue" />
        {title}
      </dt>

      <dd className="mt-3 break-words text-[13px] leading-6">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

export default function CustomerDetailsContainer({
  customerId
}: {
  customerId: string;
}) {
  const router = useRouter();

  const { customer, error, loading, refresh } = useCustomerDetails(customerId);

  const user = useAuthStore((state) => state.user);
  const isAdmin = Boolean(user?.roles.includes("admin"));

  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const lock = useRef(false);
  const mounted = useRef(false);
  const contextRef = useRef({ customerId, accountId: user?.id });

  contextRef.current = { customerId, accountId: user?.id };

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setPickerOpen(false);
    setConfirmation(null);
    setActionError(null);
  }, [customerId, user?.id]);

  function closeModal() {
    if (lock.current) return;

    setPickerOpen(false);
    setConfirmation(null);
    setActionError(null);
  }

  async function perform(
    work: () => Promise<unknown>,
    message: string,
    deleted = false
  ) {
    const actor = useAuthStore.getState().user;
    const requestedCustomerId = customerId;

    if (lock.current || !actor?.roles.includes("admin")) return;

    function isCurrent() {
      const currentUser = useAuthStore.getState().user;

      return (
        mounted.current &&
        contextRef.current.customerId === requestedCustomerId &&
        contextRef.current.accountId === actor?.id &&
        currentUser?.id === actor?.id &&
        Boolean(currentUser?.roles.includes("admin"))
      );
    }

    lock.current = true;
    setBusy(true);
    setActionError(null);

    try {
      try {
        await work();
      } catch (failure) {
        if (isCurrent()) {
          setActionError(customerError(failure));
        }

        return;
      }

      if (!isCurrent()) return;

      toast.success(message);
      setConfirmation(null);
      setPickerOpen(false);

      if (deleted) {
        router.replace("/dashboard/admin/customers");
        return;
      }

      try {
        await refresh();
      } catch {
        if (isCurrent()) {
          toast.error(
            "Change saved, but the page could not refresh. Reload the page."
          );
        }
      }
    } finally {
      lock.current = false;

      if (mounted.current) {
        setBusy(false);
      }
    }
  }

  async function confirmAction() {
    if (!confirmation) return;

    if (confirmation.type === "unlink") {
      await perform(
        () => customersService.detachUser(customerId, confirmation.linkId),
        "Customer access removed."
      );
      return;
    }

    await perform(
      () => customersService.remove(customerId),
      "Customer deleted.",
      true
    );
  }

  async function retryLoad() {
    try {
      await refresh();
    } catch {
      // The hook exposes the loading error.
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
      <section className="space-y-4 rounded-xl border border-dashboard-border bg-dashboard-surface p-6">
        <p role="alert" className="text-sm text-dashboard-red">
          {error}
        </p>

        <button
          type="button"
          onClick={retryLoad}
          className="dashboard-btn-secondary"
        >
          Try again
        </button>

        <Link
          href="/dashboard/admin/customers"
          className="block text-sm text-dashboard-blue hover:underline"
        >
          Back to Customers
        </Link>
      </section>
    );
  }

  if (!customer) return null;

  const isCompany = customer.client_type === "company";
  const CustomerIcon = isCompany ? Building2 : UserRound;

  const hasWork =
    customer.ind_clients.length > 0 || customer.pov_projects.length > 0;

  const activeAccounts = customer.client_users.filter(
    (link) => link.users.status === "active"
  ).length;

  const inactiveAccounts = customer.client_users.length - activeAccounts;

  const statistics = [
    {
      label: "Individual jobs",
      value: customer.ind_clients.length,
      icon: FolderOpen,
      color: "text-dashboard-blue",
      background: "bg-dashboard-blue-soft"
    },
    {
      label: "POV projects",
      value: customer.pov_projects.length,
      icon: FileText,
      color: "text-dashboard-purple",
      background: "bg-dashboard-purple-soft"
    },
    {
      label: "Linked accounts",
      value: customer.client_users.length,
      icon: UsersRound,
      color: "text-dashboard-orange",
      background: "bg-dashboard-orange-soft"
    }
  ];

  return (
    <section dir="ltr" className="min-w-0 space-y-6 text-dashboard-text">
      <header className="space-y-4">
        <Link
          href="/dashboard/admin/customers"
          className="text-sm text-dashboard-muted hover:underline"
        >
          ← Back to Customers
        </Link>

        <div className="flex items-center gap-3 mt-10">
          <span
            aria-hidden="true"
            className={`
              flex size-11 shrink-0 items-center justify-center
              rounded-xl
              ${
                isCompany
                  ? "bg-dashboard-purple-soft text-dashboard-purple"
                  : "bg-dashboard-blue-soft text-dashboard-blue"
              }
            `}
          >
            <CustomerIcon size={21} strokeWidth={1.75} />
          </span>

          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold">
              {customer.name}
            </h1>

            <p className="mt-1 text-xs text-dashboard-muted">
              {isCompany ? "Company" : "Individual person"}
            </p>
          </div>
        </div>
      </header>

      <dl className="grid gap-4 sm:grid-cols-3">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-dashboard-border bg-dashboard-surface p-5"
            >
              <dt className="flex items-center justify-between gap-3 text-xs text-dashboard-muted">
                {item.label}

                <span
                  aria-hidden="true"
                  className={`
                    flex size-8 items-center justify-center
                    rounded-lg ${item.background} ${item.color}
                  `}
                >
                  <Icon size={16} />
                </span>
              </dt>

              <dd className="mt-3 text-2xl font-semibold tabular-nums">
                {item.value}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <DetailSection title="Customer Information" icon={CustomerIcon}>
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-dashboard-muted">Customer name</dt>
              <dd className="mt-3 break-words text-[13px] leading-6">
                {customer.name}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-dashboard-muted">Type</dt>
              <dd className="mt-3 text-[13px] leading-6">
                {isCompany ? "Company" : "Individual person"}
              </dd>
            </div>

            <ContactField title="Email" value={customer.email} icon={Mail} />

            <ContactField title="Phone" value={customer.phone} icon={Phone} />
          </dl>
        </DetailSection>

        <DetailSection
          title="Customer Notes"
          icon={FileText}
          color="text-dashboard-purple"
        >
          <div className="rounded-lg bg-[#EAECF0] p-4 dark:bg-slate-800">
            <p className="whitespace-pre-wrap break-words text-[13px] leading-6 text-slate-800 dark:text-slate-200">
              {customer.notes?.trim() || "No notes recorded."}
            </p>
          </div>
        </DetailSection>
      </div>

      <DetailSection
        title="Accounts & Individual Access"
        icon={UsersRound}
        color="text-dashboard-cyan"
        action={
          isAdmin && (
            <button
              type="button"
              disabled={busy || Boolean(confirmation)}
              onClick={() => {
                setActionError(null);
                setPickerOpen(true);
              }}
              className="dashboard-btn-secondary inline-flex items-center gap-2"
            >
              <Link2 size={14} aria-hidden="true" />
              Link account
            </button>
          )
        }
      >
        <p className="text-[13px] leading-6 text-dashboard-muted">
          Linked accounts receive access to this customer’s Individual jobs. POV
          access is managed separately for each project. Inactive accounts
          remain blocked from signing in or accessing protected resources.
        </p>

        {customer.client_users.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-dashboard-green-soft px-2 py-1 text-dashboard-green">
              {activeAccounts} active accounts
            </span>

            {inactiveAccounts > 0 && (
              <span className="rounded-md bg-dashboard-amber-soft px-2 py-1 text-dashboard-amber">
                {inactiveAccounts} inactive accounts
              </span>
            )}
          </div>
        )}

        {customer.client_users.length === 0 ? (
          <p className="mt-5 rounded-lg bg-dashboard-hover p-4 text-[13px] text-dashboard-muted">
            No accounts linked yet. Link an existing Client account to grant
            Individual access.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-dashboard-border">
            {customer.client_users.map((link) => (
              <li
                key={link.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <AccountIdentity account={link.users} />
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setActionError(null);
                      setConfirmation({
                        type: "unlink",
                        linkId: link.id,
                        email: link.users.email
                      });
                    }}
                    aria-label={`Remove customer access for ${link.users.email}`}
                    className="
                      rounded-lg px-3 py-2 text-xs font-medium
                      text-dashboard-red transition-colors
                      hover:bg-dashboard-red-soft
                      focus-visible:outline-2
                      focus-visible:outline-dashboard-focus
                      disabled:opacity-40
                    "
                  >
                    Remove access
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Individual Jobs" icon={FolderOpen}>
        {customer.ind_clients.length === 0 ? (
          <p className="text-[13px] text-dashboard-muted">
            No Individual jobs registered.
          </p>
        ) : (
          <ul className="divide-y divide-dashboard-border">
            {customer.ind_clients.map((job) => (
              <li
                key={job.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">INV {job.inv_no}</p>

                  <p className="mt-1 break-words text-xs text-dashboard-muted">
                    {job.name}
                  </p>
                </div>

                <Link
                  href={`/dashboard/admin/individual/${encodeURIComponent(
                    job.id
                  )}`}
                  className="text-xs font-medium text-dashboard-blue hover:underline"
                >
                  Open job
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {isAdmin && (
        <DetailSection
          title="Delete Customer"
          icon={ShieldAlert}
          color="text-dashboard-red"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-2xl text-[13px] leading-6 text-dashboard-muted">
              {hasWork
                ? "Deletion is blocked because this customer has Individual jobs or POV projects."
                : "Deleting this customer removes its customer memberships. Login accounts and independent POV memberships remain."}
            </p>

            <button
              type="button"
              disabled={busy || hasWork || Boolean(confirmation)}
              onClick={() => {
                setActionError(null);
                setConfirmation({ type: "delete" });
              }}
              className="dashboard-btn-secondary inline-flex items-center gap-2 text-dashboard-red"
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete customer
            </button>
          </div>
        </DetailSection>
      )}

      {actionError && !pickerOpen && !confirmation && (
        <p role="alert" className="text-[13px] text-dashboard-red">
          {actionError}
        </p>
      )}

      {pickerOpen && isAdmin && (
        <CustomerDetailsModal
          key={`link-${customer.id}`}
          title="Link Client Account"
          busy={busy}
          onClose={closeModal}
        >
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

          {actionError && (
            <p role="alert" className="mt-4 text-[13px] text-dashboard-red">
              {actionError}
            </p>
          )}
        </CustomerDetailsModal>
      )}

      {confirmation && isAdmin && (
        <CustomerDetailsModal
          key={`${customer.id}-${confirmation.type}`}
          title={
            confirmation.type === "unlink"
              ? "Remove Customer Access?"
              : "Delete Customer?"
          }
          busy={busy}
          onClose={closeModal}
        >
          <div className="space-y-5">
            <p className="text-[13px] leading-6 text-dashboard-muted">
              {confirmation.type === "unlink"
                ? `${confirmation.email} will lose access through this customer membership to its Individual jobs. The login account and independent POV memberships remain.`
                : `Delete ${customer.name}? This cannot be undone. Linked login accounts will not be deleted.`}
            </p>

            {actionError && (
              <p role="alert" className="text-[13px] text-dashboard-red">
                {actionError}
              </p>
            )}

            <footer className="flex justify-end gap-3 border-t border-dashboard-border pt-4">
              <button
                type="button"
                autoFocus
                disabled={busy}
                onClick={closeModal}
                className="dashboard-btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmAction()}
                className="
                  inline-flex min-h-10 items-center justify-center
                  rounded-lg bg-red-700 px-4 py-2 text-[13px]
                  font-medium text-white transition-colors
                  hover:bg-red-800 focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-dashboard-focus
                  disabled:cursor-not-allowed disabled:opacity-40
                  dark:bg-red-600 dark:hover:bg-red-500
                "
              >
                {busy
                  ? "Processing…"
                  : confirmation.type === "unlink"
                  ? "Remove access"
                  : "Delete customer"}
              </button>
            </footer>
          </div>
        </CustomerDetailsModal>
      )}
    </section>
  );
}
