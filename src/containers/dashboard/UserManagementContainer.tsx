"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { usersService } from "@/services/users.service";
import { AdminUser } from "@/types/user";
import { useAuthStore } from "@/store/auth.store";

export const UserManagementContainer = () => {
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // true after the very first successful fetch
  const [isFetching, setIsFetching] = useState(false); // true during any fetch (first or subsequent)
  const [actioningId, setActioningId] = useState<string | null>(null);

  const limit = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await usersService.list({
        page,
        limit,
        search: search || undefined
      });
      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
      setHasLoadedOnce(true);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Could not load users.");
    } finally {
      setIsFetching(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (isInitialized) fetchUsers();
  }, [isInitialized, fetchUsers]);

  const handleToggleStatus = async (u: AdminUser) => {
    try {
      setActioningId(u.id);
      if (u.status === "active") {
        await usersService.deactivate(u.id);
        toast.success(`${u.profiles?.display_name ?? u.email} deactivated`);
      } else {
        await usersService.activate(u.id);
        toast.success(`${u.profiles?.display_name ?? u.email} activated`);
      }
      await fetchUsers();
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      {/* Title always renders — never gated behind a loading check */}
      <p className="font-poppins text-[22px] font-[350] text-black mb-6">
        User Management
      </p>

      <div className="bg-white rounded-2xl border border-bg-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-bg-soft">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64 px-3 py-2 rounded-lg border border-section-title/30 text-[13px] outline-none focus:border-primary transition"
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-[16px] text-black border-b border-bg-soft">
              <th className="px-6 py-3 font-[500] text-[14px]">User</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Date</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Email</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Status</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Action</th>
            </tr>
          </thead>
          {/* Fade the existing rows during any subsequent fetch, instead of unmounting them */}
          <tbody
            className={`transition-opacity duration-200 ${
              isFetching ? "opacity-40" : "opacity-100"
            }`}
          >
            {!hasLoadedOnce ? (
              // Only shown on the very first load, when there's genuinely nothing to display yet
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-unselected text-[14px]"
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-unselected text-[14px]"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-bg-soft last:border-0"
                >
                  <td className="px-6 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-bg-soft flex items-center justify-center text-[14px] font-[400] text-black">
                      {(u.profiles?.display_name ?? u.email)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <span className="text-[14px] font-[400] text-black">
                      {u.profiles?.display_name ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    {u.email}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black capitalize">
                    {u.status}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      disabled={actioningId === u.id}
                      className="px-3 py-1.5 rounded-lg text-[13px] font-[400] text-black border border-section-title/30 hover:bg-[#937052] hover:text-white transition disabled:opacity-50"
                    >
                      {actioningId === u.id
                        ? "..."
                        : u.status === "active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-bg-soft text-[14px] font-[400] text-black">
          <span>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
            {total} results
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="px-3 py-1.5 rounded-lg border border-bg-soft hover:bg-[#937052] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              ←
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-[#937052] text-white font-[400]">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching}
              className="px-3 py-1.5 rounded-lg border border-bg-soft hover:bg-[#937052] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementContainer;
