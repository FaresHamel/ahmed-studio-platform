const SEARCH_PLACEHOLDERS: Record<string, string> = {
    "/dashboard/admin": "Search recent jobs, INV or PO…",
    "/dashboard/admin/users": "Search users by name or email…",
    "/dashboard/admin/membership": "Search members by name or email…",
    "/dashboard/admin/subscriptions": "Search subscription plans…",

    "/dashboard/operator": "Search…",
    "/dashboard/client": "Search…",
};

export function getSearchPlaceholder(pathname: string): string {
    return SEARCH_PLACEHOLDERS[pathname] ?? "Search this page…";
}