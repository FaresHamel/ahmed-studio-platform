import api from '@/apis/axios';
import type { AdminOverviewData, OverviewJob, OverviewProject, OverviewSlice } from '@/types/admin-overview';

type JsonObject = Record<string, unknown>;
function object(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function optionalText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}
function requiredText(value: unknown): string {
  const text = optionalText(value);
  if (!text) throw new Error('Unexpected overview response');
  return text;
}
function count(value: unknown): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null;
}
function page(value: unknown): { total: number; rows: unknown[] } {
  if (!object(value) || !Array.isArray(value.data) || !object(value.meta)) {
    throw new Error('Unexpected paginated overview response');
  }
  const total = count(value.meta.total);
  if (total === null) throw new Error('Missing overview total');
  return { total, rows: value.data };
}
function job(value: unknown): OverviewJob {
  if (!object(value)) throw new Error('Unexpected Individual job');
  return {
    id: requiredText(value.id), invNo: requiredText(value.inv_no), name: requiredText(value.name),
    createdAt: optionalText(value.created_at),
    boxCount: Array.isArray(value.ind_boxes) ? value.ind_boxes.length : null,
    boxesClosed: typeof value.boxes_closed === 'boolean' ? value.boxes_closed : null,
  };
}
function project(value: unknown): OverviewProject {
  if (!object(value) || typeof value.finished !== 'boolean' || typeof value.paused !== 'boolean') {
    throw new Error('Unexpected POV project');
  }
  return {
    id: requiredText(value.id), name: requiredText(value.client_name),
    reference: optionalText(value.po_invoice_number), createdAt: optionalText(value.created_at),
    status: value.finished ? 'finished' : value.paused ? 'paused' : 'active',
    recordCount: object(value._count) ? count(value._count.pov_records) : null,
  };
}
function slice<T>(result: PromiseSettledResult<{ total: number; items: T[] }>): OverviewSlice<T> {
  return result.status === 'fulfilled'
    ? { ok: true, ...result.value }
    : { ok: false, total: null, items: [], error: 'Unable to load this section' };
}
async function totals(path: string, signal?: AbortSignal, filters: Record<string, string> = {}): Promise<{ total: number; items: never[] }> {
  const response = await api.get<unknown>(path, { params: { page: 1, limit: 1, ...filters }, signal });
  return { total: page(response.data).total, items: [] };
}
async function rows<T>(path: string, map: (value: unknown) => T, signal?: AbortSignal): Promise<{ total: number; items: T[] }> {
  const response = await api.get<unknown>(path, { params: { page: 1, limit: 5 }, signal });
  const parsed = page(response.data);
  return { total: parsed.total, items: parsed.rows.map(map) };
}
export const adminOverviewService = {
  async load(signal?: AbortSignal): Promise<AdminOverviewData> {
    // Independent sections remain usable when one endpoint fails.
    const [users, clients, jobs, projects, operators, clientAccounts, openBoxes, awaitingShipment, shippedBoxes] = await Promise.allSettled([
      totals('/users', signal),
      totals('/clients', signal),
      rows('/individual/clients', job, signal),
      rows('/pov/projects', project, signal),
      totals('/users', signal, { role: 'operator' }),
      totals('/users', signal, { role: 'client' }),
      totals('/individual/boxes', signal, { status: 'open' }),
      totals('/individual/boxes', signal, { status: 'closed' }),
      totals('/individual/boxes', signal, { status: 'shipped' }),
    ]);
    return {
      users: slice(users), clients: slice(clients), jobs: slice(jobs), projects: slice(projects),
      operators: slice(operators), clientAccounts: slice(clientAccounts), openBoxes: slice(openBoxes),
      awaitingShipment: slice(awaitingShipment), shippedBoxes: slice(shippedBoxes),
    };
  },
};
