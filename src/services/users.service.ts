import api from "@/apis/axios";
import type {
  AdminUser,
  PaginatedUsers,
  ListUsersParams,
  CreateOperatorInput,
  UpdateOperatorInput,
  CreateClientAccountInput,
  UpdateClientAccountInput,
} from "@/types/user";

export const usersService = {
  async list(
    params: ListUsersParams,
    signal?: AbortSignal
  ): Promise<PaginatedUsers> {
    const { data } = await api.get<PaginatedUsers>("/users", {
      params,
      signal
    });
    return data;
  },
  async get(id: string, signal?: AbortSignal): Promise<AdminUser> {
    const { data } = await api.get<AdminUser>(
      `/users/${encodeURIComponent(id)}`,
      { signal }
    );
    return data;
  },
  async createOperator(input: CreateOperatorInput): Promise<unknown> {
    const { data } = await api.post<unknown>("/users/operators", input);
    return data;
  },
  async updateOperator(
    id: string,
    input: UpdateOperatorInput
  ): Promise<AdminUser> {
    const { data } = await api.patch<AdminUser>(
      `/users/operators/${encodeURIComponent(id)}`,
      input
    );
    return data;
  },
  async createClient(input: CreateClientAccountInput): Promise<unknown> {
    const { data } = await api.post<unknown>("/users/clients", input);
    return data;
  },
  async updateEmail(id: string, email: string): Promise<unknown> {
    const { data } = await api.patch<unknown>(
      `/users/${encodeURIComponent(id)}`,
      { email }
    );
    return data;
  },
  async deactivate(id: string): Promise<unknown> {
    const { data } = await api.patch<unknown>(
      `/users/${encodeURIComponent(id)}/deactivate`
    );
    return data;
  },
  async activate(id: string): Promise<unknown> {
    const { data } = await api.patch<unknown>(
      `/users/${encodeURIComponent(id)}/activate`
    );
    return data;
  },
  async updateClientAccount(
    id: string,
    input: UpdateClientAccountInput,
  ): Promise<AdminUser> {
    const { data } = await api.patch<AdminUser>(
      `/users/${encodeURIComponent(id)}`,
      input,
    );

    return data;
  },
};
