"use client";

import { useEffect, useId, useState } from "react";
import { usersService } from "@/services/users.service";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { customerError } from "@/hooks/customers/useCustomerDetails";
import type { AdminUser } from "@/types/user";
import { AccountIdentity } from "./AccountIdentity";

interface Props {
  linkedUserIds: string[];
  busy: boolean;
  onLink: (userId: string) => Promise<void>;
}

interface SearchResult {
  key: string;
  users: AdminUser[];
  totalPages: number;
  error?: string;
}

export function CustomerAccountPicker({ linkedUserIds, busy, onLink }: Props) {
  const id = useId();
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim());

  const [pagination, setPagination] = useState({
    query: "",
    page: 1
  });
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<SearchResult | null>(null);

  const page = pagination.query === query ? pagination.page : 1;
  const key = JSON.stringify([query, page, revision]);
  const current = result?.key === key ? result : null;
  const loading = search.trim() !== query || !current;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await usersService.list(
          {
            page,
            limit: 10,
            search: query || undefined,
            role: "client"
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
          users: response.data,
          totalPages
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({
            key,
            users: [],
            totalPages: 1,
            error: customerError(error, "Could not load accounts.")
          });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [key, page, query]);

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold">Link an existing account</h3>
        <p className="mt-2 text-sm leading-6 text-dashboard-muted">
          Membership grants access to all current and future Individual jobs for
          this customer. It grants no POV access.
        </p>
      </div>

      <div>
        <label htmlFor={id} className="mb-2 block text-sm">
          Search Client accounts
        </label>
        <input
          id={id}
          type="search"
          value={search}
          disabled={busy}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search accounts..."
          className="dashboard-input px-3 py-3"
        />
      </div>

      <div aria-busy={loading} className="space-y-2">
        {loading ? (
          <p role="status" className="text-sm text-dashboard-muted">
            Loading accounts…
          </p>
        ) : current?.error ? (
          <div role="alert" className="space-y-3">
            <p className="text-sm text-rose-600">{current.error}</p>
            <button
              type="button"
              onClick={() => setRevision((value) => value + 1)}
              className="dashboard-btn-secondary"
            >
              Try again
            </button>
          </div>
        ) : current?.users.length === 0 ? (
          <p className="text-sm text-dashboard-muted">
            No Client accounts found. Create accounts in User Management.
          </p>
        ) : (
          current?.users.map((account) => {
            const linked = linkedUserIds.includes(account.id);
            const name =
              account.profiles?.display_name?.trim() || account.email;

            return (
              <div
                key={account.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashboard-border p-3"
              >
                <div className="min-w-0">
                  <AccountIdentity account={account} />
                  {account.status === "inactive" && (
                    <p className="mt-1 text-xs text-dashboard-muted">
                      Inactive account
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={busy || linked}
                  onClick={() => void onLink(account.id)}
                  className="dashboard-btn-secondary"
                  aria-label={`${linked ? "Already linked" : "Link"} ${
                    account.email
                  }`}
                >
                  {linked ? "Linked" : "Link account"}
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-end gap-3 text-sm">
        <button
          type="button"
          disabled={busy || loading || !!current?.error || page <= 1}
          onClick={() => setPagination({ query, page: page - 1 })}
          className="dashboard-btn-secondary"
        >
          Previous
        </button>

        <span>
          Page {page} of {current?.totalPages ?? 1}
        </span>

        <button
          type="button"
          disabled={
            busy ||
            loading ||
            !!current?.error ||
            page >= (current?.totalPages ?? 1)
          }
          onClick={() => setPagination({ query, page: page + 1 })}
          className="dashboard-btn-secondary"
        >
          Next
        </button>
      </div>
    </section>
  );
}
