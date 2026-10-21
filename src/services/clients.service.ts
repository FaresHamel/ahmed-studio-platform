import api from "@/apis/axios";
import type {
  PageQuery,
  Page,
  Customer,
  CustomerInput,
  CustomerForAccount,
  ClientLink,
  Message
} from "@/types/production-api";
const id = encodeURIComponent;
export const clientsService = {
  async list(params: PageQuery = {}): Promise<Page<Customer>> {
    return (await api.get<Page<Customer>>("/clients", { params })).data;
  },
  async get(clientId: string): Promise<Customer> {
    return (await api.get<Customer>(`/clients/${id(clientId)}`)).data;
  },
  async create(body: CustomerInput): Promise<Customer> {
    return (await api.post<Customer>("/clients", body)).data;
  },
  async update(
    clientId: string,
    body: Partial<CustomerInput>
  ): Promise<Customer> {
    return (await api.patch<Customer>(`/clients/${id(clientId)}`, body)).data;
  },
  async remove(clientId: string): Promise<Message> {
    return (await api.delete<Message>(`/clients/${id(clientId)}`)).data;
  },
  async mine(): Promise<CustomerForAccount[]> {
    return (await api.get<CustomerForAccount[]>("/clients/my")).data;
  },
  async attachUser(clientId: string, userId: string): Promise<ClientLink> {
    return (
      await api.post<ClientLink>(`/clients/${id(clientId)}/users`, {
        user_id: userId
      })
    ).data;
  },
  async detachUser(clientId: string, linkId: string): Promise<Message> {
    return (
      await api.delete<Message>(`/clients/${id(clientId)}/users/${id(linkId)}`)
    ).data;
  }
};
