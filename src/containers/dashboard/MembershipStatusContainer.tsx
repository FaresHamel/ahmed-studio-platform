"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { usersService } from "@/services/users.service";
import { AdminUser, getMembershipType } from "@/types/user";
import { useAuthStore } from "@/store/auth.store";

export const MembershipStatusContainer = () => {
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const limit = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await usersService.list({ page, limit });
      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
      setHasLoadedOnce(true);
    } catch (err) {
      console.error("Failed to load members:", err);
      toast.error("Could not load members.");
    } finally {
      setIsFetching(false);
    }
  }, [page]);

  useEffect(() => {
    if (isInitialized) fetchUsers();
  }, [isInitialized, fetchUsers]);

  const handleToggleStatus = async (u: AdminUser) => {
    try {
      setActioningId(u.id);
      if (u.status === "active") {
        await usersService.deactivate(u.id);
        toast.success(`${u.profiles?.display_name ?? u.email} suspended`);
      } else {
        await usersService.activate(u.id);
        toast.success(`${u.profiles?.display_name ?? u.email} reactivated`);
      }
      await fetchUsers();
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  const handleView = (u: AdminUser) => {
    // TODO: navigate to a member detail page once that view is built.
    toast("Member details view coming soon.");
  };

  return (
    <div>
      <p className="font-poppins text-[22px] font-[350] text-black mb-6">
        Membership Status
      </p>

      <div className="bg-white rounded-2xl border border-bg-soft overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[16px] text-black border-b border-bg-soft">
              <th className="px-6 py-3 font-[500] text-[14px]">User Name</th>
              <th className="px-6 py-3 font-[500] text-[14px]">
                Membership Type
              </th>
              <th className="px-6 py-3 font-[500] text-[14px]">Phone Number</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Date</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Action</th>
            </tr>
          </thead>
          <tbody
            className={`transition-opacity duration-200 ${
              isFetching ? "opacity-40" : "opacity-100"
            }`}
          >
            {!hasLoadedOnce ? (
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
                  No members found.
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
                    {getMembershipType(u)}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    {u.profiles?.phone ?? "Phone number not provided"}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={actioningId === u.id}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-[500] text-white transition disabled:opacity-50 ${
                          u.status === "active"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {actioningId === u.id
                          ? "..."
                          : u.status === "active"
                          ? "Suspend"
                          : "Reactivate"}
                      </button>
                      <button
                        onClick={() => handleView(u)}
                        className="text-unselected hover:text-black transition"
                        aria-label="View details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Separate pagination card, with a gap above it */}
        <div className="mt-10 bg-white rounded-2xl border border-bg-soft px-6 py-4 flex items-center justify-between text-[14px] font-[400] text-black">
          <span>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
            {total} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-bg-soft hover:bg-[#937052] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              ←
            </button>

            <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#937052] text-white font-[500]">
              {page}
            </span>

            {totalPages > 1 && page !== totalPages && (
              <>
                {page < totalPages - 1 && (
                  <span className="w-9 h-9 flex items-center justify-center text-unselected">
                    …
                  </span>
                )}
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={isFetching}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-bg-soft hover:bg-[#937052] hover:text-white transition disabled:opacity-40"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-bg-soft hover:bg-[#937052] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipStatusContainer;
