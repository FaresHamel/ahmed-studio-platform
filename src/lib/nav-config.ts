import { UserRole } from "@/types/auth";

export interface NavItem {
    label: string;
    href: string;
    icon: "overview" | "users" | "membership" | "media" | "subscription" | "storage" | "settings";
}

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
    admin: [
        { label: "Dashboard Overview", href: "/dashboard/admin", icon: "overview" },
        { label: "User Management", href: "/dashboard/admin/users", icon: "users" },
        { label: "Membership status", href: "/dashboard/admin/membership", icon: "membership" },
        { label: "Media Library", href: "/dashboard/admin/media", icon: "media" },
        { label: "Subscription Plans", href: "/dashboard/admin/subscriptions", icon: "subscription" },
        { label: "Storage Analytics", href: "/dashboard/admin/storage", icon: "storage" },
        { label: "Profile Settings", href: "/dashboard/admin/profile", icon: "settings" },
    ],
    operator: [
        { label: "Dashboard Overview", href: "/dashboard/operator", icon: "overview" },
        { label: "Profile Settings", href: "/dashboard/operator/profile", icon: "settings" },
    ],
    client: [
        { label: "Dashboard Overview", href: "/dashboard/client", icon: "overview" },
        { label: "Profile Settings", href: "/dashboard/client/profile", icon: "settings" },
    ],
};