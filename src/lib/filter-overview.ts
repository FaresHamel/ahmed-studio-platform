import type { AdminOverviewData } from "@/types/admin-overview";

export function filterOverview(data: AdminOverviewData | null, search: string): AdminOverviewData | null {
  const query = search.trim().toLowerCase();
  if (!data || !query) return data;

  return {
    ...data,
    jobs: data.jobs.ok ? {
      ...data.jobs,
      items: data.jobs.items.filter(job =>
        [job.name, job.invNo].some(value => value.toLowerCase().includes(query))),
    } : data.jobs,
    projects: data.projects.ok ? {
      ...data.projects,
      items: data.projects.items.filter(project =>
        [project.name, project.reference ?? "", project.status].some(value => value.toLowerCase().includes(query))),
    } : data.projects,
  };
}
