export type AccountRole = "admin" | "operator" | "client";
export type UserRoleFilter = "all" | "operator" | "client";
export type OperatorType = "data_entry" | "audio_specialist" | "video_specialist" | "audio_qc" | "video_qc" | "restoration" | "supervisor";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive";
  user_roles: { role: string }[];
  profiles?: {
    display_name: string | null;
    phone: string | null;
    inv_no: string | null;
    operator_type?: string | null;
  } | null;
}
export interface PaginatedUsers {
  data: AdminUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: AccountRole;
}
export interface CreateOperatorInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  operatorType: OperatorType;
}
export interface UpdateOperatorInput {
  name?: string;
  email?: string;
  phone?: string;
  operatorType?: OperatorType;
}

// Kept for imports in older membership screens. Account roles are not paid plans.
export function getMembershipType(user: AdminUser): string {
  return user.user_roles.map(({ role }) => role).join(", ") || "—";
}
export interface CreateClientAccountInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface UpdateClientAccountInput {
  name?: string;
  email?: string;
  phone?: string | null;
}