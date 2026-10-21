export interface OverviewJob {
  id: string;
  invNo: string;
  name: string;
  createdAt: string | null;
  boxCount: number | null;
  boxesClosed: boolean | null;
}
export interface OverviewProject {
  id: string;
  name: string;
  reference: string | null;
  createdAt: string | null;
  status: 'active' | 'paused' | 'finished';
  recordCount: number | null;
}
export type OverviewSlice<T> =
  | { ok: true; total: number; items: T[] }
  | { ok: false; total: null; items: []; error: string };
export interface AdminOverviewData {
  users: OverviewSlice<never>;
  operators: OverviewSlice<never>;
  clientAccounts: OverviewSlice<never>;
  openBoxes: OverviewSlice<never>;
  awaitingShipment: OverviewSlice<never>;
  shippedBoxes: OverviewSlice<never>;
  clients: OverviewSlice<never>;
  jobs: OverviewSlice<OverviewJob>;
  projects: OverviewSlice<OverviewProject>;
}
