"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/types/auth";
import { getDashboardPath } from "@/lib/role-redirect";

export function RoleGuard({
  allow,
  children
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return; // wait for silent refresh to finish

    if (!user) {
      router.replace("/login");
      return;
    }

    const hasAccess = allow.some((role) => user.roles.includes(role));
    if (!hasAccess) {
      router.replace(getDashboardPath(user.roles)); // send them to their own dashboard instead
    }
  }, [user, isInitialized, router, allow]);

  if (!isInitialized || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return <>{children}</>;
}
