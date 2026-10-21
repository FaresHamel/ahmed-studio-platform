import type { AdminUser, OperatorType } from "@/types/user";

export const OPERATOR_OPTIONS: { value: OperatorType; label: string; legacy?: boolean }[] = [
  { value: "audio_specialist", label: "Audio Specialist" },
  { value: "video_specialist", label: "Video Specialist" },
  { value: "audio_qc", label: "Audio QC" },
  { value: "video_qc", label: "Video QC" },
  { value: "restoration", label: "Restoration Specialist" },
  { value: "data_entry", label: "Data Entry", legacy: true },
  { value: "supervisor", label: "Supervisor", legacy: true },
];
export function accountName(account: AdminUser): string {
  return account.profiles?.display_name?.trim() || account.email;
}
export function accountInitials(account: AdminUser): string {
  const parts = accountName(account).split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => Array.from(part)[0]).join("").toUpperCase();
}
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800", "bg-violet-100 text-violet-800",
  "bg-emerald-100 text-emerald-800", "bg-orange-100 text-orange-800", "bg-rose-100 text-rose-800",
];
export function avatarColor(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
export function operatorLabel(value?: string | null): string {
  return OPERATOR_OPTIONS.find(option => option.value === value)?.label ?? value ?? "Not assigned";
}
export function formatAccountDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
