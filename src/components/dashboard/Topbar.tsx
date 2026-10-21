"use client";
import { usePathname } from "next/navigation";
import { Moon, Search, Sun, X } from "lucide-react";
import { NAV_BY_ROLE } from "@/lib/nav-config";
import { useDashboard } from "./DashboardProvider";
import { getSearchPlaceholder } from "@/lib/dashboard-search";
const navigationItems = Object.values(NAV_BY_ROLE)
  .flat()
  .sort((first, second) => second.href.length - first.href.length);

function getPageTitle(pathname: string) {
  const item = navigationItems.find(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`)
  );

  if (!item) return "Dashboard";

  return item.label === "Dashboard Overview" ? "Dashboard" : item.label;
}

export function Topbar() {
  const pathname = usePathname();
  const { search, setSearch, theme, toggleTheme } = useDashboard();
const searchPlaceholder = getSearchPlaceholder(pathname);
  const title = getPageTitle(pathname);
  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header
      dir="ltr"
      className="dashboard-topbar flex flex-wrap items-center gap-4 px-4 py-4 sm:px-8"
    >
      <p className="min-w-0 flex-1 truncate text-base font-semibold">{title}</p>

      <div
        role="search"
        aria-label={`Search ${title}`}
        className="relative order-last w-full sm:order-none sm:w-72 lg:w-80"
      >
        <Search
          size={17}
          aria-hidden="true"
          className="dashboard-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="dashboard-input w-full rounded-lg py-2.5 pl-10 pr-10 text-sm [&::-webkit-search-cancel-button]:appearance-none"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="dashboard-icon-button absolute right-1 top-1/2 -translate-y-1/2"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
        className="dashboard-icon-button"
      >
        {theme === "dark" ? (
          <Sun size={21} aria-hidden="true" />
        ) : (
          <Moon size={21} aria-hidden="true" />
        )}
      </button>
    </header>
  );
}
