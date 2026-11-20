"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Folder,
  Layers,
  RefreshCw,
  Timer,
  UsersRound
} from "lucide-react";

import { usePovProject } from "@/hooks/pov/usePovProject";
import { povDate, povDuration, povName } from "@/lib/pov/display";

import PovProjectRecords from "@/components/dashboard/pov/PovProjectRecords";
import PovProjectStatusBadge from "@/components/dashboard/pov/PovProjectStatusBadge";

import {
  PovDetailsTabs,
  PovField,
  PovSection
} from "@/components/dashboard/pov/PovDetailsLayout";

import {
  PovProjectActivity,
  PovProjectComments
} from "@/components/dashboard/pov/PovProjectDiscussion";

interface PovProjectDetailsContainerProps {
  projectId: string;
}

export default function PovProjectDetailsContainer({
  projectId
}: PovProjectDetailsContainerProps) {
  const {
    initialized,
    canLoad,
    details,
    activity,
    comments,
    detailsError,
    activityError,
    commentsError,
    loading,
    refreshing,
    commentsPage,
    commentsTotalPages,
    setCommentsPage,
    refresh
  } = usePovProject(projectId);

  function retry() {
    void refresh();
  }

  if (!initialized || loading) {
    return (
      <p role="status" className="py-10 text-dashboard-muted">
        Loading project…
      </p>
    );
  }

  if (!canLoad) {
    return (
      <p role="alert" className="py-10 text-dashboard-muted">
        You do not have access to this page.
      </p>
    );
  }

  if (!details) {
    return (
      <section className="dashboard-card space-y-4 p-5">
        <p role="alert" className="text-[13px] text-dashboard-red">
          {detailsError || "Project not available."}
        </p>

        <button
          type="button"
          onClick={retry}
          className="dashboard-btn-secondary"
        >
          Try again
        </button>

        <Link
          href="/dashboard/admin/pov"
          className="block text-[13px] text-dashboard-blue hover:underline"
        >
          Back to POV Projects
        </Link>
      </section>
    );
  }

  const { project, timer, progress, formats } = details;

  const percentage = Math.min(100, Math.max(0, progress.percentage));

  const statistics = [
    {
      label: "Total records",
      value: progress.total
    },
    {
      label: "Completed",
      value: progress.digitized
    },
    {
      label: "Remaining",
      value: progress.remaining
    }
  ];

  return (
    <section dir="ltr" className="min-w-0 space-y-6 text-dashboard-text">
      <header>
        <Link
          href="/dashboard/admin/pov"
          className="text-[13px] text-dashboard-muted hover:underline"
        >
          ← Back to POV Projects
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-dashboard-hover text-dashboard-cyan"
          >
            <Folder size={21} strokeWidth={1.75} />
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-semibold">
              {project.client_name}
            </h1>

            <p className="mt-1 text-[13px] text-dashboard-muted">
              {project.po_invoice_number
                ? `PO / invoice: ${project.po_invoice_number}`
                : "No PO / invoice reference"}
            </p>
          </div>

          <PovProjectStatusBadge
            finished={project.finished}
            paused={project.paused}
          />

          <button
            type="button"
            disabled={refreshing}
            onClick={retry}
            className="dashboard-btn-secondary"
          >
            <RefreshCw
              size={15}
              aria-hidden="true"
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      {detailsError && (
        <p
          role="alert"
          className="rounded-lg bg-dashboard-hover p-4 text-[13px] text-dashboard-red"
        >
          {detailsError} Previously loaded information is displayed.
        </p>
      )}

      {project.finished && (
        <p className="rounded-lg bg-dashboard-hover p-4 text-[13px] leading-6 text-dashboard-muted">
          This project is finished. Reopen it before changing project
          information, materials or comments.
        </p>
      )}

      <PovDetailsTabs>
        {{
          overview: (
            <>
              <div className="grid items-start gap-5 lg:grid-cols-2">
                <PovSection title="Project information" icon={ClipboardList}>
                  <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                    <PovField label="Project contact">
                      {project.client_name}
                    </PovField>

                    <PovField label="Phone">
                      {project.phone || "Not recorded"}
                    </PovField>

                    <PovField label="PO / invoice">
                      {project.po_invoice_number || "Not recorded"}
                    </PovField>

                    <PovField label="Created by">{project.created_by}</PovField>

                    <PovField label="Created">
                      {povDate(project.created_at)}
                    </PovField>

                    <PovField label="Last updated">
                      {povDate(project.updated_at)}
                    </PovField>
                  </dl>
                </PovSection>

                <PovSection title="Project schedule" icon={CalendarDays}>
                  <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                    <PovField label="Start date">
                      {povDate(project.start_date, false)}
                    </PovField>

                    <PovField label="Configured duration">
                      {project.duration_days}{" "}
                      {project.duration_days === 1 ? "day" : "days"}
                    </PovField>

                    <PovField label="Extra days">{project.extra_days}</PovField>

                    <PovField label="Calculated deadline">
                      {povDate(timer.deadline)}
                    </PovField>

                    <PovField label="Excluded time">
                      {povDuration(project.accumulated_pause_seconds)}
                    </PovField>

                    <PovField label="Finished">
                      {povDate(project.finished_at)}
                    </PovField>
                  </dl>
                </PovSection>
              </div>

              <PovSection title="Production overview" icon={Timer}>
                <dl className="grid gap-4 sm:grid-cols-3">
                  {statistics.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-dashboard-border bg-dashboard-hover p-4"
                    >
                      <dt className="text-[13px] text-dashboard-muted">
                        {item.label}
                      </dt>

                      <dd className="mt-3 text-xl font-semibold tabular-nums">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[13px]">
                    <span className="text-dashboard-muted">Completion</span>

                    <span>{percentage}%</span>
                  </div>

                  <div
                    role="progressbar"
                    aria-label="Completed records"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                    className="h-2 overflow-hidden rounded-full bg-dashboard-hover"
                  >
                    <div
                      className="h-full rounded-full bg-dashboard-green"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-[13px] text-dashboard-muted">
                  {timer.is_overdue ? "Overdue by " : "Time remaining: "}

                  <span
                    className={timer.is_overdue ? "text-dashboard-red" : ""}
                  >
                    {povDuration(
                      timer.is_overdue
                        ? timer.overdue_seconds
                        : timer.remaining_seconds
                    )}
                  </span>

                  {project.paused && " · Paused"}
                  {project.finished && " · Finished"}
                </p>

                <p className="mt-2 text-xs text-dashboard-muted">
                  Time values reflect the latest refresh.
                </p>
              </PovSection>

              <PovSection title="Records by format" icon={Layers}>
                <div className="overflow-x-auto rounded-lg border border-dashboard-border">
                  <table className="w-full min-w-[420px] text-left text-[13px]">
                    <caption className="sr-only">
                      Materials completion grouped by format
                    </caption>

                    <thead className="bg-dashboard-hover text-dashboard-muted">
                      <tr>
                        {["Format", "Total", "Completed", "Remaining"].map(
                          (label) => (
                            <th
                              key={label}
                              scope="col"
                              className="px-4 py-3 font-medium"
                            >
                              {label}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {formats.map((format) => (
                        <tr
                          key={format.format}
                          className="border-t border-dashboard-border"
                        >
                          <td className="px-4 py-3">{format.format}</td>

                          <td className="px-4 py-3">{format.quantity}</td>

                          <td className="px-4 py-3">{format.digitized}</td>

                          <td className="px-4 py-3">{format.remaining}</td>
                        </tr>
                      ))}

                      {formats.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-6 text-center text-dashboard-muted"
                          >
                            No records added.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </PovSection>
            </>
          ),

          records: (
            <PovProjectRecords
              key={projectId}
              projectId={projectId}
              finished={project.finished}
              projectRefreshing={refreshing}
              onProjectUpdated={refresh}
            />
          ),

          contacts: (
            <PovSection title="Project access" icon={UsersRound}>
              <p className="mb-5 text-xs leading-5 text-dashboard-muted">
                These accounts can access this POV project. Customer account
                membership does not automatically grant POV access.
              </p>

              <ul className="space-y-3">
                {project.pov_contacts.map((contact) => {
                  const name =
                    contact.users.profiles?.display_name?.trim() ||
                    contact.users.email;

                  return (
                    <li
                      key={contact.id}
                      className="flex items-center gap-3 rounded-lg border border-dashboard-border p-4"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-dashboard-blue-soft text-[13px] font-semibold text-dashboard-blue"
                      >
                        {name.charAt(0).toUpperCase()}
                      </span>

                      <div className="min-w-0">
                        <p className="break-words text-[13px] font-medium">
                          {povName(name)}
                        </p>

                        <p className="mt-1 break-words text-xs text-dashboard-muted">
                          {contact.users.email}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {project.pov_contacts.length === 0 && (
                <p className="text-[13px] text-dashboard-muted">
                  No accounts linked to this project.
                </p>
              )}
            </PovSection>
          ),

          comments: (
            <PovProjectComments
              key={projectId}
              projectId={projectId}
              finished={project.finished}
              comments={comments}
              error={commentsError}
              refreshing={refreshing}
              page={commentsPage}
              totalPages={commentsTotalPages}
              onPageChange={setCommentsPage}
              onSaved={refresh}
            />
          ),

          activity: (
            <PovProjectActivity activity={activity} error={activityError} />
          )
        }}
      </PovDetailsTabs>
    </section>
  );
}
