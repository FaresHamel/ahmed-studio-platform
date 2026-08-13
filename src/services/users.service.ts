import api from "@/apis/axios";
import { PaginatedUsers } from "@/types/user";

export const usersService = {
    async list(params: { page?: number; limit?: number; search?: string }): Promise<PaginatedUsers> {
        const res = await api.get<PaginatedUsers>("/users", { params });
        return res.data;
    },

    async deactivate(id: string) {
        const res = await api.patch(`/users/${id}/deactivate`);
        return res.data;
    },

    async activate(id: string) {
        const res = await api.patch(`/users/${id}/activate`);
        return res.data;
    },
};