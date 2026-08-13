export interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
    status: "active" | "inactive";
    user_roles: { role: string }[];
    profiles?: { display_name: string | null; phone: string | null; inv_no: string | null } | null;
}

export interface PaginatedUsers {
    data: AdminUser[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}
export function getMembershipType(user: AdminUser): string {
    return "Standard";
}
