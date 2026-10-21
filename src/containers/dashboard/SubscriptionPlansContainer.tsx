"use client";
import { useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  SubscriptionPlan,
  MOCK_PLANS,
  PLAN_NAME_OPTIONS
} from "@/types/subscription";

const emptyForm = {
  planName: PLAN_NAME_OPTIONS[0],
  price: "",
  billingCycle: "",
  title: "",
  features: ""
};

export const SubscriptionPlansContainer = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(MOCK_PLANS);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { search } = useDashboard();
  const query = search.trim().toLowerCase();
  const [pageQuery, setPageQuery] = useState("");
  const filteredPlans = plans.filter(plan =>
    [plan.planName, plan.title, plan.billingCycle, plan.features, plan.status]
      .some(value => value.toLowerCase().includes(query)),
  );

  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / limit));
  const currentPage = query === pageQuery ? Math.min(page, totalPages) : 1;
  const changePage = (next: number) => {
    setPageQuery(query);
    setPage(Math.max(1, Math.min(totalPages, next)));
  };
  const paginatedPlans = filteredPlans.slice((currentPage - 1) * limit, currentPage * limit);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleCancel = () => setForm(emptyForm);

  const handleSave = () => {
    if (!form.price || !form.billingCycle || !form.title) {
      toast.error("Please fill in all fields.");
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Enter a valid non-negative price.");
      return;
    }

    // TODO: replace with POST /subscription-plans once the backend endpoint exists.
    const newPlan: SubscriptionPlan = {
      id: crypto.randomUUID(),
      planName: form.planName,
      price,
      billingCycle: form.billingCycle,
      title: form.title,
      features: form.features,
      subscribers: 0,
      status: "active",
      createdAt: new Date().toISOString()
    };
    setPlans((prev) => [newPlan, ...prev]);
    toast.success("Demo plan saved locally for this session.");
    handleCancel();
  };

  const handleToggleStatus = (id: string) => {
    // TODO: replace with PATCH /subscription-plans/:id once the backend endpoint exists.
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  const handleDelete = (id: string) => {
    // TODO: replace with DELETE /subscription-plans/:id once the backend endpoint exists.
    setPlans((prev) => prev.filter((p) => p.id !== id));
    toast.success("Plan removed.");
  };

  const handleView = (plan: SubscriptionPlan) => {
    toast(plan.title);
  };

  return (
    <div>
      <p className="text-[22px] font-[350] text-dashboard-text mb-6">
        Subscription Plans
      </p>

      <p role="note" className="mb-4 text-sm text-dashboard-muted">Demo data: changes are local to this session and are not saved to the backend.</p>

      {/* Create/edit form card */}
      <div className="bg-dashboard-surface rounded-2xl border border-dashboard-border p-6 mb-4">
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <label className="block text-[14px] font-[600] text-primary mb-1.5">
              Plan Name
            </label>
            <select
              value={form.planName}
              onChange={(e) => handleChange("planName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-dashboard-border text-[14px] font-[400] text-dashboard-text outline-none focus:border-primary transition bg-transparent"
            >
              {PLAN_NAME_OPTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[14px] font-[600] text-primary mb-1.5">
              Price
            </label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="$29.00"
              className="w-full px-4 py-2.5 rounded-lg border border-dashboard-border text-[14px] font-[400] text-dashboard-text placeholder:text-dashboard-muted/50 outline-none focus:border-primary transition bg-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <label className="block text-[14px] font-[600] text-primary mb-1.5">
              Billing Cycle
            </label>
            <input
              type="text"
              value={form.billingCycle}
              onChange={(e) => handleChange("billingCycle", e.target.value)}
              placeholder="Yearly"
              className="w-full px-4 py-2.5 rounded-lg border border-dashboard-border text-[14px] font-[400] text-dashboard-text placeholder:text-dashboard-muted/50 outline-none focus:border-primary transition bg-transparent"
            />
          </div>
          <div>
            <label className="block text-[14px] font-[600] text-primary mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="The complete solution for serious business grant seekers."
              className="w-full px-4 py-2.5 rounded-lg border border-dashboard-border text-[14px] font-[400] text-dashboard-text placeholder:text-dashboard-muted/50 outline-none focus:border-primary transition bg-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[14px] font-[600] text-primary mb-1.5">
            This Package Include
          </label>
          <textarea
            value={form.features}
            onChange={(e) => handleChange("features", e.target.value)}
            placeholder="Unlimited grant searches, Unlimited saved grants, Advanced filters & sorting, Personalized recommendations, Deadline reminders"
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-dashboard-border text-[14px] font-[400] text-dashboard-text placeholder:text-dashboard-muted/50 outline-none focus:border-primary transition bg-transparent resize-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg border border-dashboard-border text-[14px] font-[500] text-dashboard-text hover:bg-dashboard-hover transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-dashboard-action text-dashboard-action-text text-[14px] font-[500] hover:bg-dashboard-action-hover transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* Plans table card */}
      <div className="bg-dashboard-surface rounded-2xl border border-dashboard-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[16px] text-dashboard-text border-b border-dashboard-border bg-dashboard-hover">
              <th className="px-6 py-3 font-[500] text-[14px]">Plan Name</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Price</th>
              <th className="px-6 py-3 font-[500] text-[14px]">
                Billing Cycle
              </th>
              <th className="px-6 py-3 font-[500] text-[14px]">Subscribers</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Date</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Status</th>
              <th className="px-6 py-3 font-[500] text-[14px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlans.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-dashboard-muted text-[14px]"
                >
                  No matching plans.
                </td>
              </tr>
            ) : (
              paginatedPlans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-dashboard-border last:border-0"
                >
                  <td className="px-6 py-3 text-[14px] font-[400] text-dashboard-text">
                    {plan.planName}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-dashboard-text">
                    ${plan.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-dashboard-text">
                    {plan.billingCycle}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-dashboard-text">
                    {plan.subscribers}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-dashboard-text">
                    {new Date(plan.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleStatus(plan.id)}
                      className={`px-3 py-1 rounded-full text-[12px] font-[500] transition ${
                        plan.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {plan.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleView(plan)}
                        className="text-dashboard-muted hover:text-dashboard-text transition"
                        aria-label="View plan"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        aria-label="Delete plan"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination card */}
      <div className="mt-4 bg-dashboard-surface rounded-2xl border border-dashboard-border px-6 py-4 flex items-center justify-between text-[14px] font-[400] text-dashboard-text">
        <span>
          Showing {filteredPlans.length === 0 ? 0 : (currentPage - 1) * limit + 1}–
          {Math.min(currentPage * limit, filteredPlans.length)} of {filteredPlans.length} results
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-dashboard-border hover:bg-dashboard-action hover:text-dashboard-action-text transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dashboard-text"
          >
            ←
          </button>
          <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-dashboard-action text-dashboard-action-text font-[500]">
            {currentPage}
          </span>
          {totalPages > 1 && currentPage !== totalPages && (
            <>
              {currentPage < totalPages - 1 && (
                <span className="w-9 h-9 flex items-center justify-center text-dashboard-muted">
                  …
                </span>
              )}
              <button
                onClick={() => changePage(totalPages)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-dashboard-border hover:bg-dashboard-action hover:text-dashboard-action-text transition"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-dashboard-border hover:bg-dashboard-action hover:text-dashboard-action-text transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dashboard-text"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansContainer;
