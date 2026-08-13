"use client";
import { useState } from "react";
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

  const totalPages = Math.max(1, Math.ceil(plans.length / limit));
  const paginatedPlans = plans.slice((page - 1) * limit, page * limit);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleCancel = () => setForm(emptyForm);

  const handleSave = () => {
    if (!form.price || !form.billingCycle || !form.title) {
      toast.error("Please fill in all fields.");
      return;
    }

    // TODO: replace with POST /subscription-plans once the backend endpoint exists.
    const newPlan: SubscriptionPlan = {
      id: crypto.randomUUID(),
      planName: form.planName,
      price: parseFloat(form.price),
      billingCycle: form.billingCycle,
      title: form.title,
      features: form.features,
      subscribers: 0,
      status: "active",
      createdAt: new Date().toISOString()
    };
    setPlans((prev) => [newPlan, ...prev]);
    toast.success("Plan saved.");
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
      <p className="font-poppins text-[22px] font-[350] text-black mb-6">
        Subscription Plans
      </p>

      {/* Create/edit form card */}
      <div className="bg-white rounded-2xl border border-bg-soft p-6 mb-4">
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <label className="block text-[14px] font-[600] text-primary mb-1.5">
              Plan Name
            </label>
            <select
              value={form.planName}
              onChange={(e) => handleChange("planName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-section-title/30 text-[14px] font-[400] text-black outline-none focus:border-primary transition bg-transparent"
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
              className="w-full px-4 py-2.5 rounded-lg border border-section-title/30 text-[14px] font-[400] text-black placeholder:text-unselected/50 outline-none focus:border-primary transition bg-transparent"
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
              className="w-full px-4 py-2.5 rounded-lg border border-section-title/30 text-[14px] font-[400] text-black placeholder:text-unselected/50 outline-none focus:border-primary transition bg-transparent"
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
              className="w-full px-4 py-2.5 rounded-lg border border-section-title/30 text-[14px] font-[400] text-black placeholder:text-unselected/50 outline-none focus:border-primary transition bg-transparent"
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
            className="w-full px-4 py-2.5 rounded-lg border border-section-title/30 text-[14px] font-[400] text-black placeholder:text-unselected/50 outline-none focus:border-primary transition bg-transparent resize-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg border border-section-title/30 text-[14px] font-[500] text-black hover:bg-bg-soft transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-[#937052] text-white text-[14px] font-[500] hover:bg-dark-brown transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* Plans table card */}
      <div className="bg-white rounded-2xl border border-bg-soft overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[16px] text-black border-b border-bg-soft bg-[#FFF3E8]">
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
                  className="px-6 py-8 text-center text-unselected text-[14px]"
                >
                  No plans yet.
                </td>
              </tr>
            ) : (
              paginatedPlans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-bg-soft last:border-0"
                >
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    {plan.planName}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    ${plan.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    {plan.billingCycle}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
                    {plan.subscribers}
                  </td>
                  <td className="px-6 py-3 text-[14px] font-[400] text-black">
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
                        className="text-unselected hover:text-black transition"
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
      <div className="mt-4 bg-white rounded-2xl border border-bg-soft px-6 py-4 flex items-center justify-between text-[14px] font-[400] text-black">
        <span>
          Showing {plans.length === 0 ? 0 : (page - 1) * limit + 1}–
          {Math.min(page * limit, plans.length)} of {plans.length} results
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
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
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-bg-soft hover:bg-[#937052] hover:text-white transition"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-bg-soft hover:bg-[#937052] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansContainer;
