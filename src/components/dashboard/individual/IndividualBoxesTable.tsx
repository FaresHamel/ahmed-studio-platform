"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, Package, Search, Truck } from "lucide-react";

import type { IndividualJobBox } from "@/types/production-api";

interface IndividualBoxesTableProps {
  boxes: IndividualJobBox[];
  isAdmin: boolean;
  busy: boolean;
  shippingBoxId: string | null;
  onShip: (boxId: string) => Promise<void>;
}

type BoxFilter = "all" | "open" | "closed" | "ready" | "shipped";

const FILTERS: Array<{ value: BoxFilter; label: string }> = [
  { value: "all", label: "All boxes" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "ready", label: "Ready to ship" },
  { value: "shipped", label: "Shipped" }
];

const MEDIA_TYPES = [
  { type: "video", label: "Video" },
  { type: "audio", label: "Audio" },
  { type: "photo", label: "Photo" },
  { type: "document", label: "Document" }
] as const;

const SHIP_BUTTON = `
  ml-auto inline-flex min-h-9 shrink-0 items-center
  justify-center gap-2 whitespace-nowrap rounded-lg
  border border-blue-200 bg-blue-50 px-3 py-2
  text-xs font-medium text-blue-700 transition-colors
  hover:border-blue-300 hover:bg-blue-100
  focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-dashboard-focus
  disabled:cursor-not-allowed disabled:opacity-50
  dark:border-blue-500/30 dark:bg-blue-500/15
  dark:text-blue-300 dark:hover:border-blue-400/50
  dark:hover:bg-blue-500/25
`;

function canShipBox(box: IndividualJobBox): boolean {
  return Boolean(box.closed && !box.shipped_at && box.shipping?.eligible);
}

function matchesFilter(box: IndividualJobBox, filter: BoxFilter): boolean {
  switch (filter) {
    case "open":
      return !box.closed && !box.shipped_at;
    case "closed":
      return box.closed && !box.shipped_at;
    case "ready":
      return canShipBox(box);
    case "shipped":
      return Boolean(box.shipped_at);
    default:
      return true;
  }
}

function boxStatus(box: IndividualJobBox) {
  if (box.shipped_at) {
    return {
      label: "Shipped",
      color: "bg-dashboard-purple-soft text-dashboard-purple"
    };
  }

  if (box.closed) {
    return {
      label: "Closed",
      color: "bg-dashboard-amber-soft text-dashboard-amber"
    };
  }

  return {
    label: "Open",
    color: "bg-dashboard-green-soft text-dashboard-green"
  };
}

function mediaBreakdown(box: IndividualJobBox): string {
  const counts = new Map<string, number>();

  for (const tape of box.ind_tapes) {
    counts.set(tape.media_type, (counts.get(tape.media_type) ?? 0) + 1);
  }

  const parts: string[] = [];

  for (const media of MEDIA_TYPES) {
    const count = counts.get(media.type) ?? 0;

    if (count > 0) {
      parts.push(`${count} ${media.label}`);
    }
  }

  const otherCount = box.ind_tapes.filter(
    (tape) => !MEDIA_TYPES.some((media) => media.type === tape.media_type)
  ).length;

  if (otherCount > 0) {
    parts.push(`${otherCount} Other`);
  }

  return parts.join(" · ") || "No materials";
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium"
  }).format(date);
}

function ProductionProgress({ box }: { box: IndividualJobBox }) {
  const total = box.ind_tapes.length;

  const completed = box.ind_tapes.filter(
    (tape) =>
      tape.current_station === "ready" || tape.current_station === "shipped"
  ).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-w-[170px] space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-dashboard-text">
          {completed} of {total}
        </span>

        <span className="tabular-nums text-dashboard-muted">{percentage}%</span>
      </div>

      <div
        role="progressbar"
        aria-label={`Production completion for box ${box.id}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={`${completed} of ${total} materials ready or shipped`}
        className="h-1.5 overflow-hidden rounded-full bg-dashboard-hover"
      >
        <div
          className={`
            h-full rounded-full
            ${percentage === 100 ? "bg-dashboard-green" : "bg-dashboard-blue"}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[11px] text-dashboard-muted">
        {total === 0 ? "No materials registered" : "Ready or shipped"}
      </p>
    </div>
  );
}

function ShippingStatus({ box }: { box: IndividualJobBox }) {
  if (box.shipped_at) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-dashboard-purple">Shipped</p>

        <time
          dateTime={box.shipped_at}
          className="text-xs text-dashboard-muted"
        >
          {formatDate(box.shipped_at)}
        </time>
      </div>
    );
  }

  if (canShipBox(box)) {
    return (
      <span
        className="
          inline-flex whitespace-nowrap rounded-full
          bg-dashboard-green-soft px-2.5 py-1
          text-xs font-medium text-dashboard-green
        "
      >
        Ready to ship
      </span>
    );
  }

  return (
    <p className="max-w-56 text-xs leading-5 text-dashboard-muted">
      {box.shipping?.blocked_reason ?? "Open box details to check readiness."}
    </p>
  );
}

export default function IndividualBoxesTable({
  boxes,
  isAdmin,
  busy,
  shippingBoxId,
  onShip
}: IndividualBoxesTableProps) {
  const id = useId();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BoxFilter>("all");

  const query = search.trim().toLowerCase();

  const visibleBoxes = boxes.filter(
    (box) => box.id.toLowerCase().includes(query) && matchesFilter(box, filter)
  );

  const hasFilters = Boolean(query) || filter !== "all";

  function resetFilters() {
    setSearch("");
    setFilter("all");
  }

  return (
    <div>
      <div className="space-y-3 border-t border-dashboard-border px-5 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <label htmlFor={`${id}-search`} className="block w-full sm:max-w-xs">
            <span className="mb-2 block text-xs text-dashboard-muted">
              Search boxes
            </span>

            <div className="relative">
              <Search
                size={15}
                aria-hidden="true"
                className="
                  pointer-events-none absolute left-3 top-1/2
                  -translate-y-1/2 text-dashboard-muted
                "
              />

              <input
                id={`${id}-search`}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by box ID…"
                className="
                  dashboard-input min-h-10 w-full
                  py-2 pl-9 pr-3 text-[13px]
                "
              />
            </div>
          </label>

          <label htmlFor={`${id}-filter`} className="block w-full sm:w-48">
            <span className="mb-2 block text-xs text-dashboard-muted">
              Box status
            </span>

            <div className="relative">
              <select
                id={`${id}-filter`}
                value={filter}
                onChange={(event) => setFilter(event.target.value as BoxFilter)}
                className="
                  dashboard-input min-h-10 w-full
                  appearance-none py-2 pl-3 pr-10 text-[13px]
                "
              >
                {FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                aria-hidden="true"
                className="
                  pointer-events-none absolute right-3 top-1/2
                  -translate-y-1/2 text-dashboard-muted
                "
              />
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p role="status" className="text-xs text-dashboard-muted">
            {visibleBoxes.length} of {boxes.length} boxes
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="
                rounded text-xs font-medium text-dashboard-blue
                hover:underline focus-visible:outline-2
                focus-visible:outline-dashboard-focus
              "
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-[13px]">
          <caption className="sr-only">
            Individual job boxes, production progress, and shipping actions
          </caption>

          <thead className="bg-dashboard-hover text-dashboard-muted">
            <tr>
              {[
                "Box ID",
                "Status",
                "Materials",
                "Production progress",
                "Shipping",
                "Actions"
              ].map((title) => (
                <th key={title} scope="col" className="px-5 py-3 font-medium">
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleBoxes.map((box) => {
              const status = boxStatus(box);

              const boxUrl =
                `/dashboard/admin/individual/boxes/` +
                encodeURIComponent(box.id);

              const shipping = shippingBoxId === box.id;

              return (
                <tr
                  key={box.id}
                  className="
                    border-t border-dashboard-border
                    transition-colors hover:bg-dashboard-hover/50
                  "
                >
                  <td className="px-5 py-4">
                    <Link
                      href={boxUrl}
                      className="
                        inline-flex items-center gap-2
                        whitespace-nowrap rounded font-medium
                        text-dashboard-blue hover:underline
                        focus-visible:outline-2
                        focus-visible:outline-dashboard-focus
                      "
                    >
                      <Package size={15} aria-hidden="true" />
                      {box.id}
                    </Link>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex rounded-full px-2.5 py-1
                        text-xs font-medium ${status.color}
                      `}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium tabular-nums">
                      {box.ind_tapes.length}
                    </p>

                    <p className="mt-1 min-w-36 text-xs leading-5 text-dashboard-muted">
                      {mediaBreakdown(box)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <ProductionProgress box={box} />
                  </td>

                  <td className="px-5 py-4">
                    <ShippingStatus box={box} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex min-w-[220px] items-center justify-between gap-6">
                      <Link
                        href={boxUrl}
                        className="
                          shrink-0 whitespace-nowrap rounded
                          text-xs font-medium text-dashboard-blue
                          hover:underline focus-visible:outline-2
                          focus-visible:outline-dashboard-focus
                        "
                      >
                        Open details
                      </Link>

                      {isAdmin && canShipBox(box) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void onShip(box.id)}
                          aria-label={`Ship box ${box.id}`}
                          className={SHIP_BUTTON}
                        >
                          <Truck size={14} aria-hidden="true" />
                          {shipping ? "Shipping…" : "Ship box"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {visibleBoxes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-dashboard-muted"
                >
                  {boxes.length === 0
                    ? "No boxes registered for this job."
                    : "No boxes match your search and filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
