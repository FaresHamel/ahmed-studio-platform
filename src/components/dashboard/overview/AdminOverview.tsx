"use client";

import { Users, UserRound, Headphones, Building2, Layers, Film, PackageOpen, PackageCheck, Truck } from "lucide-react";
import type { AdminOverviewData } from "@/types/admin-overview";
import { OverviewMetric } from "./OverviewMetric";
import { OverviewHeader } from "./OverviewHeader";
import { OverviewRecentTables } from "./OverviewRecentTables";

export function AdminOverview({
  data,
  loading,
  updatedAt,
  userName,
  onRefresh,
  searchText = ""
}: {
  data: AdminOverviewData | null;
  loading: boolean;
  updatedAt: Date | null;
  userName: string;
  language?: "ar" | "en";
  searchText?: string;
  onRefresh: () => void;
}) {
  const metrics = [
    {
      title: "Total accounts",
      hint: "All login accounts, across roles",
      section: data?.users,
      icon: <Users size={18} />,
      color: "bg-dashboard-hover text-dashboard-text"
    },
    {
      title: "Operators",
      hint: "Accounts with the operator role",
      section: data?.operators,
      icon: <Headphones size={18} />,
      color: "bg-dashboard-blue-soft text-dashboard-blue"
    },
    {
      title: "Client accounts",
      hint: "Accounts with the client role",
      section: data?.clientAccounts,
      icon: <UserRound size={18} />,
      color: "bg-dashboard-emerald-soft text-dashboard-emerald"
    },
    {
      title: "Customer records",
      hint: "People & companies in Clients",
      section: data?.clients,
      icon: <Building2 size={18} />,
      color: "bg-dashboard-orange-soft text-dashboard-orange"
    },
    {
      title: "Individual jobs",
      hint: "Separate jobs identified by INV",
      section: data?.jobs,
      icon: <Layers size={18} />,
      color: "bg-dashboard-violet-soft text-dashboard-violet"
    },
    {
      title: "POV projects",
      hint: "All registered POV projects",
      section: data?.projects,
      icon: <Film size={18} />,
      color: "bg-dashboard-cyan-soft text-dashboard-cyan"
    }
  ];
  const boxes = [
    {
      title: "Open boxes",
      hint: "Boxes that are not closed",
      section: data?.openBoxes,
      icon: <PackageOpen size={18} />,
      color: "bg-dashboard-blue-soft text-dashboard-blue"
    },
    {
      title: "Closed, not shipped",
      hint: "Closed boxes without a shipment date",
      section: data?.awaitingShipment,
      icon: <PackageCheck size={18} />,
      color: "bg-dashboard-amber-soft text-dashboard-amber"
    },
    {
      title: "Shipped boxes",
      hint: "Boxes with a shipment date",
      section: data?.shippedBoxes,
      icon: <Truck size={18} />,
      color: "bg-dashboard-emerald-soft text-dashboard-emerald"
    }
  ];
  return (
    <div
      dir="ltr"
      className="mx-auto w-full max-w-7xl space-y-6 pb-8 text-left text-dashboard-text"
    >
      <OverviewHeader userName={userName} loading={loading} updatedAt={updatedAt} onRefresh={onRefresh} />

      {/* Account and production totals */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <OverviewMetric key={metric.title} {...metric} loading={loading} />
        ))}
      </div>

      <p className="text-xs text-dashboard-muted">
        Role counts may overlap when an account has multiple roles. Customer
        records are separate from login accounts.
      </p>
      <section aria-labelledby="box-operations-title" className="space-y-3">
        <h2 id="box-operations-title" className="text-base font-semibold">
          Individual box operations
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {boxes.map((metric) => (
            <OverviewMetric key={metric.title} {...metric} loading={loading} />
          ))}
        </div>
      </section>
      <OverviewRecentTables data={data} loading={loading} searchText={searchText} />
    </div>
  );
}
