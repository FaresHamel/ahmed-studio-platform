"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_BY_ROLE } from "@/lib/nav-config";
import { NAV_ICONS, LogOut } from "./icons";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isInitialized, clearAuth } = useAuthStore();

  const navItems = user
    ? NAV_BY_ROLE[user.roles[0] as keyof typeof NAV_BY_ROLE] ?? []
    : [];

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // proceed with local logout even if the backend call fails
    } finally {
      clearAuth();
      toast.success("Logged out successfully");
      router.replace("/login");
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-bg-soft flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6">
        <h1 className="text-[20px] font-[700] text-primary">Ahmed Studio</h1>
        <p className="text-[12px] text-unselected font-[350]">
          AI Cloud Storage
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {!isInitialized
          ? // Skeleton placeholders — same size/shape as real nav items,
            // so the sidebar never looks broken or empty during the brief auth check
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-lg bg-bg-soft/60 animate-pulse mb-1"
              />
            ))
          : navItems.map((item) => {
              const Icon = NAV_ICONS[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center mt-[10] gap-3 px-3 py-2.5 rounded-lg text-[14px] font-[400] transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-black hover:bg-bg-soft"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
      </nav>

      <div className="px-4 py-6 border-t border-bg-soft space-y-3">
        {!isInitialized ? (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-bg-soft animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-bg-soft animate-pulse" />
              <div className="h-2.5 w-32 rounded bg-bg-soft animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-bg-soft overflow-hidden flex items-center justify-center text-[13px] font-[600] text-section-title">
              {user?.name?.charAt(0)?.toUpperCase() ??
                user?.email?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-[600] text-dark-brown truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-[12px] text-unselected truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition text-[13px] font-[500]"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
};
