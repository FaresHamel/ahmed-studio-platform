export const formatNumber = (value: number | null) =>
  value === null ? "—" : new Intl.NumberFormat("en").format(value);
export function formatDate(value: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(parsed);
}
