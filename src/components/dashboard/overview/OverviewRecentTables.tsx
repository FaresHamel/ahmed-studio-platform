import type { ReactNode } from "react";
import { AlertCircle, Layers, Film } from "lucide-react";
import type { AdminOverviewData } from "@/types/admin-overview";
import { formatDate, formatNumber } from "./overview-formatters";

/* Soft, layered shadow so cards lift off the page without looking heavy. */
const panel =
  "rounded-xl border border-dashboard-border bg-dashboard-surface shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_16px_-6px_rgba(16,24,40,0.10)]";
const th = "px-5 py-3 text-left text-xs font-medium text-dashboard-muted";
const td = "px-5 py-4 text-sm text-dashboard-text";
function Placeholder({
  loading,
  failed,
  empty
}: {
  loading: boolean;
  failed: boolean;
  empty: string;
}) {
  if (loading)
    return (
      <div className="space-y-4 p-5" role="status" aria-label="Loading records">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-9 animate-pulse rounded bg-dashboard-hover" />
        ))}
      </div>
    );
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
      {failed ? (
        <AlertCircle size={24} className="text-rose-600" aria-hidden="true" />
      ) : (
        <Layers size={24} className="text-dashboard-muted" aria-hidden="true" />
      )}
      <p className="text-sm text-dashboard-muted" role={failed ? "alert" : undefined}>
        {failed ? "Unable to load this section. Refresh to try again." : empty}
      </p>
    </div>
  );
}
function TableHeading({
  title,
  icon,
  color,
  id
}: {
  title: string;
  icon: ReactNode;
  color: string;
  id: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-dashboard-border px-5 py-5">
      <span
        className={`inline-flex size-9 items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </span>
      <div>
        <h2 id={id} className="text-sm font-semibold text-dashboard-text">
          {title}
        </h2>
        <p className="mt-1 text-xs text-dashboard-muted">Latest 5 by creation date</p>
      </div>
    </div>
  );
}
export function OverviewRecentTables({ data, loading, searchText = "" }: { data: AdminOverviewData | null; loading: boolean; searchText?: string }) {
  const badge = {
    active: "bg-dashboard-blue-soft text-dashboard-blue",
    paused: "bg-dashboard-amber-soft text-dashboard-amber",
    finished: "bg-dashboard-emerald-soft text-dashboard-emerald"
  };
  const status = { active: "Active", paused: "Paused", finished: "Finished" };
  return (
      <div className="grid gap-5 2xl:grid-cols-2">
        <section
          className={`${panel} min-w-0 overflow-hidden`}
          aria-labelledby="recent-jobs-title"
          aria-busy={loading}
        >
          <TableHeading
            title="Latest Individual jobs"
            id="recent-jobs-title"
            icon={<Layers size={18} aria-hidden="true" />}
            color="bg-dashboard-violet-soft text-dashboard-violet"
          />
          {!data?.jobs.ok || !data.jobs.items.length ? (
            <Placeholder
              loading={!data && loading}
              failed={!data?.jobs.ok}
              empty={searchText.trim() ? "No matching recent Individual jobs." : "No Individual jobs yet."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Latest Individual jobs</caption>
                <thead className="bg-dashboard-hover">
                  <tr>
                    {["Job name", "INV", "Boxes", "Created"].map((label) => (
                      <th key={label} scope="col" className={th}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-border">
                  {data.jobs.items.map((job) => (
                    <tr key={job.id} className="hover:bg-dashboard-hover">
                      <td className={`${td} max-w-52 font-medium`}>
                        <span className="block truncate" title={job.name}>
                          {job.name}
                        </span>
                      </td>
                      <td className={td}>
                        <span className="rounded bg-dashboard-hover px-2 py-1 font-mono text-xs">
                          {job.invNo}
                        </span>
                      </td>
                      <td className={td}>{formatNumber(job.boxCount)}</td>
                      <td className={`${td} whitespace-nowrap text-xs`}>
                        {formatDate(job.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section
          className={`${panel} min-w-0 overflow-hidden`}
          aria-labelledby="recent-projects-title"
          aria-busy={loading}
        >
          <TableHeading
            title="Latest POV projects"
            id="recent-projects-title"
            icon={<Film size={18} aria-hidden="true" />}
            color="bg-dashboard-cyan-soft text-dashboard-cyan"
          />
          {!data?.projects.ok || !data.projects.items.length ? (
            <Placeholder
              loading={!data && loading}
              failed={!data?.projects.ok}
              empty={searchText.trim() ? "No matching recent POV projects." : "No POV projects yet."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Latest POV projects</caption>
                <thead className="bg-dashboard-hover">
                  <tr>
                    {["Client name", "PO reference", "Records", "Status"].map(
                      (label) => (
                        <th key={label} scope="col" className={th}>
                          {label}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-border">
                  {data.projects.items.map((project) => (
                    <tr key={project.id} className="hover:bg-dashboard-hover">
                      <td className={`${td} max-w-52 font-medium`}>
                        <span className="block truncate" title={project.name}>
                          {project.name}
                        </span>
                        <span className="mt-1 block text-xs font-normal text-dashboard-muted">
                          {formatDate(project.createdAt)}
                        </span>
                      </td>
                      <td className={`${td} max-w-40`}>
                        <span
                          className="block truncate"
                          title={project.reference ?? undefined}
                        >
                          {project.reference || "—"}
                        </span>
                      </td>
                      <td className={td}>{formatNumber(project.recordCount)}</td>
                      <td className={td}>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            badge[project.status]
                          }`}
                        >
                          {status[project.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
  );
}
