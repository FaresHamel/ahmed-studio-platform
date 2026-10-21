import api from "@/apis/axios";
import type {
    IndividualJob,
    IndividualJobListItem,
    NewJobInput,
    Page,
    PageQuery,
} from "@/types/production-api";

export const individualJobsService = {
    async list(
        params: PageQuery,
        signal?: AbortSignal,
    ): Promise<Page<IndividualJobListItem>> {
        const { data } = await api.get<Page<IndividualJobListItem>>(
            "/individual/clients",
            { params, signal },
        );

        return data;
    },

    async create(input: NewJobInput): Promise<IndividualJob> {
        const { data } = await api.post<IndividualJob>(
            "/individual/jobs",
            input,
        );

        return data;
    },
};