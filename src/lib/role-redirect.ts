import { UserRole } from "@/types/auth";

export function getDashboardPath(roles: UserRole[]): string {
    if (roles.includes("admin")) return "/dashboard/admin";
    if (roles.includes("operator")) return "/dashboard/operator";
    return "/dashboard/client";
}