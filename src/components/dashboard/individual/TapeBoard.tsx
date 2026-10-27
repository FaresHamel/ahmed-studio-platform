"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, UserRound } from "lucide-react";
import type { TapeSummary } from "@/types/production-api";

interface TapeAssignee {
  id: string;
  name: string;
}

type BoardTape = TapeSummary & {
  // Only populate from a real backend assignment.
  assigned_to?: TapeAssignee | null;
};

interface Props {
  tapes: BoardTape[];
}

const STAGES = [
  "received",
  "inspected",
  "cleaning",
  "baking",
  "ingest",
  "qc",
  "restoration",
  "ready",
  "shipped"
] as const;

const COLUMNS = [
  {
    key: "received",
    label: "Received",
    style: "bg-sky-500/10 text-sky-600",
    border: "border-t-sky-500"
  },
  {
    key: "production",
    label: "In production",
    style: "bg-amber-500/10 text-amber-600",
    border: "border-t-amber-500"
  },
  {
    key: "ready",
    label: "Ready",
    style: "bg-emerald-500/10 text-emerald-600",
    border: "border-t-emerald-500"
  },
  {
    key: "shipped",
    label: "Shipped",
    style: "bg-violet-500/10 text-violet-600",
    border: "border-t-violet-500"
  },
  {
    key: "other",
    label: "Needs review",
    style: "bg-slate-500/10 text-slate-500",
    border: "border-t-slate-400"
  }
] as const;

function stageLabel(value: string | null) {
  if (!value) return "Not recorded";
  if (value === "qc") return "QC";

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function columnFor(tape: BoardTape) {
  if (tape.status === "shipped" || tape.current_station === "shipped") {
    return "shipped";
  }

  const stage = tape.current_station;

  if (stage === "ready") return "ready";
  if (stage === "received") return "received";

  if (
    stage &&
    ["inspected", "cleaning", "baking", "ingest", "qc", "restoration"].includes(
      stage
    )
  ) {
    return "production";
  }

  return "other";
}

const mediaStyles: Record<string, string> = {
  video: "bg-blue-500/10 text-blue-600",
  audio: "bg-purple-500/10 text-purple-600",
  photo: "bg-pink-500/10 text-pink-600",
  document: "bg-orange-500/10 text-orange-600"
};

export default function TapeBoard({ tapes }: Props) {
  const [search, setSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  const query = search.trim().toLowerCase();

  const filtered = tapes.filter((tape) => {
    const matchesMedia =
      mediaFilter === "all" || tape.media_type === mediaFilter;

    const searchable = [
      tape.id,
      tape.tape_code,
      tape.metadata?.title,
      tape.format,
      tape.media_type,
      tape.assigned_to?.name
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesMedia && searchable.includes(query);
  });

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Materials board</h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            {filtered.length} of {tapes.length} materials
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <label className="sr-only" htmlFor="tape-media-filter">
            Filter by media type
          </label>
          <select
            id="tape-media-filter"
            value={mediaFilter}
            onChange={(event) => setMediaFilter(event.target.value)}
            className="dashboard-input min-h-11 px-3 py-2"
          >
            <option value="all">All media</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="photo">Photo</option>
            <option value="document">Document</option>
          </select>

          <label className="relative min-w-0 flex-1 sm:w-64">
            <span className="sr-only">Search materials</span>
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dashboard-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search materials…"
              className="dashboard-input min-h-11 w-full py-2 pl-10 pr-3"
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex items-start gap-5">
          {COLUMNS.map((column) => {
            const items = filtered.filter(
              (tape) => columnFor(tape) === column.key
            );

            // Unexpected / legacy statuses remain visible.
            if (column.key === "other" && items.length === 0) {
              return null;
            }

            return (
              <section
                key={column.key}
                aria-label={column.label}
                className="w-80 shrink-0 space-y-4"
              >
                <header className="flex items-center gap-2 rounded-xl bg-dashboard-hover p-3">
                  <h3
                    className={`rounded-md px-2.5 py-1 text-sm font-medium ${column.style}`}
                  >
                    {column.label}
                  </h3>
                  <span className="text-sm text-dashboard-muted">
                    {items.length}
                  </span>
                </header>

                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-dashboard-border p-6 text-center text-sm text-dashboard-muted">
                    No materials
                  </p>
                ) : (
                  items.map((tape) => {
                    const categories = tape.metadata?.content_tags ?? [];

                    return (
                      <article
                        key={tape.id}
                        className={`dashboard-card space-y-4 border-t-4 p-4 ${column.border}`}
                      >
                        <div>
                          <Link
                            href={`/dashboard/admin/individual/tapes/${encodeURIComponent(
                              tape.id
                            )}`}
                            className="break-words font-semibold hover:underline"
                          >
                            {tape.tape_code ?? tape.id}
                          </Link>

                          <p className="mt-2 break-words text-sm">
                            {tape.metadata?.title || "Untitled material"}
                          </p>

                          <p className="mt-1 text-xs text-dashboard-muted">
                            Internal ID: {tape.id}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-md px-2 py-1 text-xs capitalize ${
                              mediaStyles[tape.media_type] ??
                              "bg-dashboard-hover text-dashboard-muted"
                            }`}
                          >
                            {tape.media_type}
                          </span>

                          <span className="rounded-md bg-dashboard-hover px-2 py-1 text-xs">
                            {tape.format}
                          </span>
                        </div>

                        <dl className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <dt className="text-dashboard-muted">
                              Current stage
                            </dt>
                            <dd className="mt-1 font-medium">
                              {stageLabel(tape.current_station)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-dashboard-muted">Status</dt>
                            <dd className="mt-1 font-medium">
                              {stageLabel(tape.status)}
                            </dd>
                          </div>
                        </dl>

                        <div>
                          <p className="mb-2 text-xs text-dashboard-muted">
                            Production stages
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {STAGES.map((stage) => {
                              const active = tape.current_station === stage;

                              return (
                                <span
                                  key={stage}
                                  className={`rounded px-2 py-1 text-[11px] ${
                                    active
                                      ? "bg-orange-500/15 font-semibold text-orange-600"
                                      : "bg-dashboard-hover text-dashboard-muted"
                                  }`}
                                >
                                  {stageLabel(stage)}
                                  {active ? " · Current" : ""}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {categories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {categories.map((category) => (
                              <span
                                key={category}
                                className="rounded-md bg-violet-500/10 px-2 py-1 text-xs text-violet-600"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}

                        <footer className="flex items-center gap-3 border-t border-dashboard-border pt-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-dashboard-hover">
                            <UserRound size={17} aria-hidden="true" />
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs text-dashboard-muted">
                              Assigned to
                            </p>
                            <p className="truncate text-sm font-medium">
                              {tape.assigned_to?.name ??
                                "Assignment not configured"}
                            </p>
                          </div>
                        </footer>
                      </article>
                    );
                  })
                )}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
