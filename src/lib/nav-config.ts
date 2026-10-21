import type { UserRole } from "@/types/auth";

export type NavIcon =
    | "overview"
    | "recent"
    | "users"
    | "customers"
    | "individual"
    | "pov"
    | "operations"
    | "tasks"
    | "documents"
    | "materials";

export type NavGroup = "Workspace" | "Management" | "Production";

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: NavIcon;
    group: NavGroup;
    plannedHref?: string;
}

const adminHome = "/dashboard/admin";

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
    admin: [
        {
            id: "admin-overview",
            label: "Overview",
            href: adminHome,
            icon: "overview",
            group: "Workspace",
        },
        {
            id: "admin-recent",
            label: "Recent",
            href: adminHome,
            plannedHref: `${adminHome}/recent`,
            icon: "recent",
            group: "Workspace",
        },
        {
            id: "admin-users",
            label: "User Management",
            href: `${adminHome}/users`,
            icon: "users",
            group: "Management",
        },
        {
            id: "admin-customers",
            label: "Customers",
            href: "/dashboard/admin/customers",
            icon: "customers",
            group: "Management",
        },
           {
            id: "admin-individual",
            label: "Individual",
            href: "/dashboard/admin/individual",
            icon: "individual",
            group: "Production",
        },
        {
            id: "admin-pov",
            label: "POV Projects",
            href: adminHome,
            plannedHref: `${adminHome}/pov`,
            icon: "pov",
            group: "Production",
        },
        {
            id: "admin-operations",
            label: "Operations",
            href: adminHome,
            plannedHref: `${adminHome}/operations`,
            icon: "operations",
            group: "Production",
        },
        {
            id: "admin-tasks",
            label: "Tasks",
            href: adminHome,
            plannedHref: `${adminHome}/tasks`,
            icon: "tasks",
            group: "Production",
        },
        {
            id: "admin-documents",
            label: "Documents",
            href: adminHome,
            plannedHref: `${adminHome}/documents`,
            icon: "documents",
            group: "Workspace",
        },
        {
            id: "admin-materials",
            label: "Materials",
            href: adminHome,
            plannedHref: `${adminHome}/materials`,
            icon: "materials",
            group: "Workspace",
        },
    ],

    operator: [
        {
            id: "operator-overview",
            label: "Overview",
            href: "/dashboard/operator",
            icon: "overview",
            group: "Workspace",
        },
        {
            id: "operator-tasks",
            label: "My Tasks",
            href: "/dashboard/operator",
            plannedHref: "/dashboard/operator/tasks",
            icon: "tasks",
            group: "Production",
        },
    ],

    client: [
        {
            id: "client-overview",
            label: "Overview",
            href: "/dashboard/client",
            icon: "overview",
            group: "Workspace",
        },
    ],
};