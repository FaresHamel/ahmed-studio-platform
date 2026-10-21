export type DashboardTheme = "light" | "dark";

const STORAGE_KEY = "ahmed-studio-dashboard-theme";
const CHANGE_EVENT = "ahmed-studio-theme-change";
let sessionTheme: DashboardTheme | null = null;

export function getThemeSnapshot(): DashboardTheme {
  if (typeof window === "undefined") return "light";
  if (sessionTheme) return sessionTheme;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Browser storage can be unavailable.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getServerThemeSnapshot(): DashboardTheme {
  return "light";
}

export function subscribeTheme(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      sessionTheme = null;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  media.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

export function toggleDashboardTheme() {
  const next = getThemeSnapshot() === "dark" ? "light" : "dark";
  sessionTheme = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Retain the selected theme in memory for this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
