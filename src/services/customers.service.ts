import api from "@/apis/axios";
import type {
    Customer,
    CustomerInput,
    CustomerListItem,
    Page,
    PageQuery,
    CustomerDetails,
    ClientLink,
    Message,
} from "@/types/production-api";

export const customersService = {
    async list(
        params: PageQuery,
        signal?: AbortSignal,
    ): Promise<Page<CustomerListItem>> {
        const { data } = await api.get<Page<CustomerListItem>>(
            "/clients",
            { params, signal },
        );

        return data;
    },

    async create(input: CustomerInput): Promise<Customer> {
        const { data } = await api.post<Customer>("/clients", input);
        return data;
    },

    async update(
        id: string,
        input: Partial<CustomerInput>,
    ): Promise<Customer> {
        const { data } = await api.patch<Customer>(
            `/clients/${encodeURIComponent(id)}`,
            input,
        );

        return data;
    },
    async get(
        id: string,
        signal?: AbortSignal,
    ): Promise<CustomerDetails> {
        const { data } = await api.get<CustomerDetails>(
            `/clients/${encodeURIComponent(id)}`,
            { signal },
        );

        return data;
    },

    async attachUser(
        customerId: string,
        userId: string,
    ): Promise<ClientLink> {
        const { data } = await api.post<ClientLink>(
            `/clients/${encodeURIComponent(customerId)}/users`,
            { user_id: userId },
        );

        return data;
    },

    async detachUser(
        customerId: string,
        linkId: string,
    ): Promise<Message> {
        const { data } = await api.delete<Message>(
            `/clients/${encodeURIComponent(customerId)}/users/${encodeURIComponent(linkId)}`,
        );

        return data;
    },

    async remove(id: string): Promise<Message> {
        const { data } = await api.delete<Message>(
            `/clients/${encodeURIComponent(id)}`,
        );

        return data;
    },
};