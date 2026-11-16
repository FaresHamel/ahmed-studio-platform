"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Package,
  Plus,
  UserRound,
  Boxes,
  FolderOpen,
  Layers3,
  PackageCheck,
  Truck
} from "lucide-react";
import toast from "react-hot-toast";
import {
  individualError,
  useIndividualJob
} from "@/hooks/individual/useIndividualJob";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import JobIntakeModal from "@/components/dashboard/individual/JobIntakeModal";
import JobRegistrationHistory from "@/components/dashboard/individual/JobRegistrationHistory";
import IndividualBoxesTable from "@/components/dashboard/individual/IndividualBoxesTable";

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeZone: "UTC"
      }).format(date);
}

export default function IndividualJobDetailsContainer({
  jobId
}: {
  jobId: string;
}) {
  const { job, loading, error, refresh } = useIndividualJob(jobId);
  const [shippingBoxId, setShippingBoxId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const lock = useRef(false);
  const mounted = useRef(false);
const user = useAuthStore((state) => state.user);
const isAdmin = Boolean(user?.roles.includes("admin"));

const [showIntakeModal, setShowIntakeModal] = useState(false);
const [savingIntake, setSavingIntake] = useState(false);
const [intakeError, setIntakeError] = useState<string | null>(null);

const currentContext = useRef({ jobId, accountId: user?.id });
currentContext.current = { jobId, accountId: user?.id };

useEffect(() => {
  setShowIntakeModal(false);
  setIntakeError(null);
}, [jobId, user?.id]);
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

 async function createBox() {
   const actor = useAuthStore.getState().user;
   const requestedJobId = jobId;

   if (lock.current || !actor?.roles.includes("admin")) return;

   if (!job || job.id !== requestedJobId || job.boxes_closed) {
     setActionError(
       "Allow more boxes for this INV before creating another box."
     );
     return;
   }

   function isCurrent() {
     return (
       mounted.current &&
       currentContext.current.jobId === requestedJobId &&
       currentContext.current.accountId === actor?.id &&
       useAuthStore.getState().user?.id === actor?.id
     );
   }

   lock.current = true;
   setCreating(true);
   setActionError(null);

   try {
     let box;

     try {
       box = await individualService.createBox(requestedJobId);
     } catch (failure) {
       if (isCurrent()) {
         setActionError(individualError(failure, "Could not create the box."));
       }

       return;
     }

     if (!isCurrent()) return;

     toast.success(`Box ${box.id} created.`);

     try {
       await refresh();
     } catch {
       if (isCurrent()) {
         toast.error(
           "Box created, but the page could not refresh. Reload the page."
         );
       }
     }
   } finally {
     lock.current = false;

     if (mounted.current) {
       setCreating(false);
     }
   }
 }

  async function openShipConfirmation(boxId: string) {
    const actor = useAuthStore.getState().user;
    const box = job?.ind_boxes.find((item) => item.id === boxId);

    if (
      lock.current ||
      !actor?.roles.includes("admin") ||
      !box?.shipping?.eligible
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Ship box ${box.id}?\n\n` +
        "This marks the box and all its materials as shipped. " +
        "The box cannot be reopened afterward."
    );

    if (!confirmed) return;

    lock.current = true;
    setShippingBoxId(box.id);
    setActionError(null);

    try {
      await individualService.shipBox(box.id);
    } catch (failure) {
      if (mounted.current && useAuthStore.getState().user?.id === actor.id) {
        setActionError(individualError(failure, "Could not ship the box."));
      }

      return;
    } finally {
      lock.current = false;

      if (mounted.current) {
        setShippingBoxId(null);
      }
    }

    if (!mounted.current || useAuthStore.getState().user?.id !== actor.id) {
      return;
    }

    toast.success(`Box ${box.id} shipped.`);

    try {
      await refresh();
    } catch {
      toast.error(
        "Box shipped, but the page could not refresh. Reload the page."
      );
    }
  }
async function confirmIntake(reason: string) {
  const actor = useAuthStore.getState().user;
  const requestedJobId = jobId;

  if (
    lock.current ||
    !actor?.roles.includes("admin") ||
    !job ||
    job.id !== requestedJobId
  ) {
    return;
  }

  const reopening = job.boxes_closed;

  if (reopening && !reason.trim()) {
    setIntakeError("Enter a reason for allowing more boxes.");
    return;
  }

  function isCurrent() {
    return (
      mounted.current &&
      currentContext.current.jobId === requestedJobId &&
      currentContext.current.accountId === actor?.id &&
      useAuthStore.getState().user?.id === actor?.id
    );
  }

  lock.current = true;
  setSavingIntake(true);
  setIntakeError(null);

  try {
    try {
      if (reopening) {
        await individualService.reopenIntake(requestedJobId, reason.trim());
      } else {
        await individualService.closeIntake(requestedJobId);
      }
    } catch (failure) {
      if (isCurrent()) {
        setIntakeError(
          individualError(failure, "Could not update box registration.")
        );
      }

      return;
    }

    if (!isCurrent()) return;

    setShowIntakeModal(false);

    toast.success(
      reopening
        ? "Additional boxes are now allowed."
        : "Box registration finished."
    );

    try {
      await refresh();
    } catch {
      if (isCurrent()) {
        toast.error("Change saved. Reload the page to update the details.");
      }
    }
  } finally {
    lock.current = false;

    if (mounted.current) {
      setSavingIntake(false);
    }
  }
}
  async function retryLoadJob() {
    try {
      await refresh();
    } catch {
      // The hook exposes the error to the UI.
    }
  }
  if (loading) {
    return (
      <p role="status" className="py-10 text-dashboard-muted">
        Loading job…
      </p>
    );
  }

  if (error) {
    return (
      <section className="dashboard-card space-y-4 p-6">
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>

        <button
          type="button"
          onClick={retryLoadJob}
          className="dashboard-btn-secondary"
        >
          Try again
        </button>

        <Link
          href="/dashboard/admin/individual"
          className="block text-sm underline"
        >
          Back to Individual
        </Link>
      </section>
    );
  }

  if (!job) return null;
  const busy = creating || shippingBoxId !== null || savingIntake;
  const registrationClosed = job.boxes_closed;

  const isCompany = job.clients?.client_type === "company";
  const CustomerIcon = isCompany ? Building2 : UserRound;

  const totalTapes = job.ind_boxes.reduce(
    (total, box) => total + box.ind_tapes.length,
    0
  );

  const openBoxes = job.ind_boxes.filter(
    (box) => !box.closed && !box.shipped_at
  ).length;

  const closedBoxes = job.ind_boxes.filter(
    (box) => box.closed && !box.shipped_at
  ).length;

  const shippedBoxes = job.ind_boxes.filter((box) => !!box.shipped_at).length;
  const totalBoxes = job.ind_boxes.length;

  const shipmentLabel =
    totalBoxes === 0 || shippedBoxes === 0
      ? "Not shipped"
      : shippedBoxes < totalBoxes
      ? "Partially shipped"
      : registrationClosed
      ? "Fully shipped"
      : "All current boxes shipped";
const boxTotals = [
  {
    label: "Total boxes",
    value: job.ind_boxes.length,
    icon: Boxes,
    color: "text-blue-500",
    card: "bg-blue-500/10 text-blue-500 ring-1 ring-inset ring-blue-500/40",
    iconBox: "bg-blue-500/15 text-blue-500"
  },
  {
    label: "Open boxes",
    value: openBoxes,
    icon: FolderOpen,
    color: "",
    card: "",
    iconBox: "bg-amber-500/10 text-amber-500"
  },
  {
    label: "Closed boxes",
    value: closedBoxes,
    icon: PackageCheck,
    color: "",
    card: "",
    iconBox: "bg-green-500/10 text-green-500"
  },
  {
    label: "Shipped boxes",
    value: shippedBoxes,
    icon: Truck,
    color: "",
    card: "",
    iconBox: "bg-purple-500/10 text-purple-500"
  },
  {
    label: "Total tapes",
    value: totalTapes,
    icon: Layers3,
    color: "",
    card: "",
    iconBox: "bg-orange-500/10 text-orange-500"
  }
];



  return (
    <section dir="ltr" className="space-y-6 text-dashboard-text">
      <header>
        <Link
          href="/dashboard/admin/individual"
          className="text-sm text-dashboard-muted hover:underline"
        >
          ← Back to Individual
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-500"
          >
            <Package size={24} />
          </span>

          <div>
            <h1 className="text-2xl font-semibold">INV {job.inv_no}</h1>
            <p className="mt-1 text-sm text-dashboard-muted">
              Individual job · Created {formatDate(job.created_at)}
            </p>
          </div>
        </div>
      </header>
      <section className="dashboard-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <h2 className="text-[15px] font-semibold">Box Registration</h2>

            <span
              className={`
                inline-flex rounded-full px-2.5 py-1 text-xs font-medium
                ${
                  registrationClosed
                    ? "bg-dashboard-amber-soft text-dashboard-amber"
                    : "bg-dashboard-green-soft text-dashboard-green"
                }
              `}
            >
              {registrationClosed
                ? "Adding boxes finished"
                : "Adding boxes allowed"}
            </span>

            <p className="text-[13px] leading-6 text-dashboard-muted">
              {registrationClosed
                ? "New boxes cannot be created. Existing boxes can continue their workflow."
                : "You can register additional boxes under this INV."}
            </p>

            <p className="text-[13px] text-dashboard-muted">
              <span className="font-medium text-dashboard-text">
                {shipmentLabel}
              </span>
              {" · "}
              {shippedBoxes} of {totalBoxes} boxes shipped
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              disabled={busy || (!registrationClosed && totalBoxes === 0)}
              onClick={() => {
                setIntakeError(null);
                setShowIntakeModal(true);
              }}
              className="dashboard-btn-secondary"
            >
              {registrationClosed ? "Allow more boxes" : "Finish adding boxes"}
            </button>
          )}
        </div>
      </section>
      <div className="grid gap-2 lg:grid-cols-2">
        <section className="dashboard-card p-5">
          <h2 className="font-semibold">Customer</h2>

          {job.clients ? (
            <div className="mt-5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`
                  flex size-10 shrink-0 items-center justify-center
                  rounded-lg border
                  ${
                    isCompany
                      ? "border-violet-500/25 bg-violet-500/10 text-violet-500"
                      : "border-blue-500/25 bg-blue-500/10 text-blue-500"
                  }
                `}
              >
                <CustomerIcon size={20} />
              </span>

              <div className="min-w-0">
                <Link
                  href={`/dashboard/admin/customers/${encodeURIComponent(
                    job.clients.id
                  )}`}
                  className="break-words text-sm font-medium hover:underline"
                >
                  {job.clients.name}
                </Link>

                <p className="mt-1 text-xs text-dashboard-muted">
                  {isCompany ? "Company" : "Individual person"}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-dashboard-muted">
              This legacy job is not linked to a customer.
            </p>
          )}
        </section>

        <section className="dashboard-card p-5">
          <h2 className="font-semibold">Job contact information</h2>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-dashboard-muted">Name</dt>
              <dd className="mt-1 break-words text-sm">{job.name}</dd>
            </div>

            <div>
              <dt className="text-xs text-dashboard-muted">Phone</dt>
              <dd className="mt-1 text-sm">{job.phone || "Not provided"}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-xs text-dashboard-muted">Email</dt>
              <dd className="mt-1 break-words text-sm">
                {job.email || "Not provided"}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <dl className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {boxTotals.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`dashboard-card rounded-[5px] p-4 ${item.card}`}
            >
              <div className="flex items-start justify-between gap-2">
                <dt className="text-xs text-dashboard-muted">{item.label}</dt>

                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.iconBox}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
              </div>

              <dd
                className={`mt-2 text-2xl font-semibold tabular-nums ${item.color}`}
              >
                {item.value}
              </dd>
            </div>
          );
        })}
      </dl>

      <section className="dashboard-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h2 className="font-semibold">Boxes</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Closing a box locks its materials until reopened. Shipping is a
              separate action.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              disabled={busy || registrationClosed}
              onClick={() => void createBox()}
              className="dashboard-btn-primary"
            >
              <Plus size={16} aria-hidden="true" />
              {creating ? "Creating…" : "Create box"}
            </button>
          )}
        </div>

        {actionError && (
          <p role="alert" className="px-5 pb-4 text-sm text-rose-600">
            {actionError}
          </p>
        )}

        <IndividualBoxesTable
          key={`${job.id}-${user?.id}`}
          boxes={job.ind_boxes}
          isAdmin={isAdmin}
          busy={busy}
          shippingBoxId={shippingBoxId}
          onShip={openShipConfirmation}
        />
      </section>
      <JobRegistrationHistory
        events={job.registration_activity ?? []}
        hasMore={job.registration_activity_has_more}
      />
      {showIntakeModal && isAdmin && (
        <JobIntakeModal
          key={`${job.id}-${registrationClosed}`}
          closed={registrationClosed}
          busy={savingIntake}
          error={intakeError}
          onClose={() => {
            if (lock.current) return;

            setShowIntakeModal(false);
            setIntakeError(null);
          }}
          onConfirm={confirmIntake}
        />
      )}
    </section>
  );
}
