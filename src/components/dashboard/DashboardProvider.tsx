"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  getThemeSnapshot,
  getServerThemeSnapshot,
  subscribeTheme,
  toggleDashboardTheme,
  type DashboardTheme,
} from "@/lib/dashboard-theme";

interface DashboardContextValue {
  search: string;
  setSearch: (value: string) => void;
  theme: DashboardTheme;
  toggleTheme: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [searchByPath, setSearchByPath] = useState<Record<string, string>>({});
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const setSearch = (value: string) => {
    setSearchByPath(current => ({ ...current, [pathname]: value }));
  };

  return (
    <DashboardContext.Provider value={{
      search: searchByPath[pathname] ?? "",
      setSearch,
      theme,
      toggleTheme: toggleDashboardTheme,
    }}>
      <div className="dashboard-shell" data-theme={theme}>{children}</div>
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used inside DashboardProvider");
  return context;
}
