"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Building2,
  CheckSquare,
  Clock,
  FileText,
  Film,
  Folder,
  Layers,
  LayoutDashboard,
  Package,
  Users,
  type LucideIcon
} from "lucide-react";
import toast from "react-hot-toast";

import { SidebarAccount } from "./SidebarAccount";
import { NAV_BY_ROLE, type NavGroup, type NavIcon } from "@/lib/nav-config";
import { getPrimaryRole } from "@/lib/role-redirect";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

const GROUPS: NavGroup[] = ["Workspace", "Management", "Production"];

const ICONS: Record<NavIcon, { component: LucideIcon; color: string }> = {
  overview: {
    component: LayoutDashboard,
    color: "text-dashboard-muted"
  },
  recent: {
    component: Clock,
    color: "text-dashboard-muted"
  },
  users: {
    component: Users,
    color: "text-blue-500"
  },
  customers: {
    component: Building2,
    color: "text-violet-500"
  },
  individual: {
    component: Package,
    color: "text-orange-500"
  },
  pov: {
    component: Folder,
    color: "text-cyan-500"
  },
  operations: {
    component: Activity,
    color: "text-emerald-500"
  },
  tasks: {
    component: CheckSquare,
    color: "text-amber-500"
  },
  documents: {
    component: FileText,
    color: "text-pink-500"
  },
  materials: {
    component: Layers,
    color: "text-teal-500"
  }
};

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const role = getPrimaryRole(user?.roles);
  const navItems = role ? NAV_BY_ROLE[role] : [];

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authService.logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error(
        "Signed out locally. Server sign-out failed; retry when connected."
      );
    } finally {
      router.replace("/login");
      setIsLoggingOut(false);
    }
  }

  return (
    <aside
      dir="ltr"
      className="dashboard-sidebar sticky top-0 flex h-dvh w-64 shrink-0 flex-col"
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white"
          aria-hidden="true"
        >
          <Film size={21} strokeWidth={1.75} />
        </div>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-dashboard-text">
            Ahmed Studio
          </h1>
          <p className="mt-0.5 text-xs text-dashboard-muted">
            AI Cloud Storage
          </p>
        </div>
      </div>

      <nav
        aria-label="Dashboard navigation"
        aria-busy={!isInitialized}
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-5"
      >
        {!isInitialized ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-10 animate-pulse rounded-lg bg-dashboard-hover"
              />
            ))}
          </div>
        ) : (
          GROUPS.map((group) => {
            const items = navItems.filter((item) => item.group === group);
            if (!items.length) return null;

            return (
              <section key={group} className="mb-5">
                <h2 className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-dashboard-muted">
                  {group}
                </h2>

                <div className="space-y-1">
                  {items.map((item) => {
                    const { component: Icon, color } = ICONS[item.icon];

                    const isRoot =
                      /^\/dashboard\/(admin|operator|client)$/.test(item.href);

                    const isActive =
                      !item.plannedHref &&
                      (pathname === item.href ||
                        (!isRoot && pathname.startsWith(`${item.href}/`)));

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        title={
                          item.plannedHref
                            ? `${item.label} — coming soon; opens Overview`
                            : item.label
                        }
                        className={`dashboard-nav-item ${
                          isActive ? "dashboard-nav-item-active" : ""
                        }`}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.75}
                          aria-hidden="true"
                          className={`shrink-0 ${color}`}
                        />

                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>

                        {item.plannedHref && (
                          <span className="shrink-0 text-[10px] text-dashboard-muted">
                            Soon
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </nav>

      <div className="border-t border-dashboard-border p-3">
        {!isInitialized ? (
          <div aria-hidden="true" className="flex items-center gap-3 px-2 py-3">
            <div className="size-9 shrink-0 animate-pulse rounded-full bg-dashboard-hover" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-dashboard-hover" />
              <div className="h-2.5 w-32 animate-pulse rounded bg-dashboard-hover" />
            </div>
          </div>
        ) : (
          <SidebarAccount
            user={user}
            isInitialized={isInitialized}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        )}
      </div>
    </aside>
  );
};
