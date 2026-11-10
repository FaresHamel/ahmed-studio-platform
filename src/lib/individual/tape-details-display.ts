import type { DetailTiming, TapePerson } from '@/types/tape-details';

export function personName(person: TapePerson | null | undefined, fallback = 'Not recorded') {
  return person?.profiles?.display_name?.trim() || person?.email || fallback;
}

export function display(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Not recorded';
  if (Array.isArray(value)) return value.length ? value.map(display).join(', ') : 'Not recorded';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function dateTime(value?: string | null) {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function duration(seconds: number | null) {
  if (seconds === null) return 'Not recorded';
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 3600).toString().padStart(2, '0')}:${Math.floor(total % 3600 / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

export function timingSeconds(timing: DetailTiming, now: number, serverNow: string) {
  if (!timing.started_at || (timing.status === 'manual' && !timing.ended_at)) return null;
  const extra = timing.status === 'running' ? Math.max(0, (now - Date.parse(serverNow)) / 1000) : 0;
  return timing.active_seconds + extra;
}

export function toLocalInput(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || toLocalInput(date.toISOString()) !== value) {
    throw new Error('Enter a valid local date and time.');
  }
  return date.toISOString();
}

export const timingColors: Record<DetailTiming['status'], string> = {
  manual: 'bg-dashboard-hover text-dashboard-muted',
  running: 'bg-dashboard-blue-soft text-dashboard-blue',
  paused: 'bg-dashboard-amber-soft text-dashboard-amber',
  completed: 'bg-dashboard-green-soft text-dashboard-green',
  cancelled: 'bg-dashboard-red-soft text-dashboard-red',
};
