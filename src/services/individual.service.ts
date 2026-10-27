import api from "@/apis/axios";
import type {
  PageQuery,
  Page,
  IndividualJobSummary,
  IndividualJob,
  NewJobInput,
  MyJob,
  BoxSummary,
  MyBox,
  MyTape,
  TapeSummary,
  TapeInput,
  TransitionInput,
  Message,
  IndividualJobListItem,
  IndividualJobDetails,
  IndividualBoxDetails,
  IndividualTapeDetails
} from "@/types/production-api";
const id = encodeURIComponent;
export const individualService = {
  async getJob(
    jobId: string,
    signal?: AbortSignal,
  ): Promise<IndividualJobDetails> {
    const { data } = await api.get<IndividualJobDetails>(
      `/individual/clients/${id(jobId)}`,
      { signal },
    );

    return data;
  },
  async listJobs(
    params: PageQuery = {},
    signal?: AbortSignal,
  ): Promise<Page<IndividualJobListItem>> {
    const { data } = await api.get<Page<IndividualJobListItem>>(
      "/individual/clients",
      { params, signal },
    );

    return data;
  },
  async createJob(body: NewJobInput): Promise<IndividualJob> {
    return (await api.post<IndividualJob>("/individual/jobs", body)).data;
  },
  async updateJob(
    jobId: string,
    body: { name?: string; phone?: string; email?: string }
  ): Promise<IndividualJob> {
    return (
      await api.patch<IndividualJob>(`/individual/clients/${id(jobId)}`, body)
    ).data;
  },
  async removeJob(jobId: string): Promise<Message> {
    return (await api.delete<Message>(`/individual/clients/${id(jobId)}`)).data;
  },
  async myJobs(): Promise<IndividualJobSummary[]> {
    return (await api.get<IndividualJobSummary[]>("/individual/my/jobs")).data;
  },
  async myJob(jobId: string): Promise<MyJob> {
    return (await api.get<MyJob>(`/individual/my/jobs/${id(jobId)}`)).data;
  },
  async myBox(boxId: string): Promise<MyBox> {
    return (await api.get<MyBox>(`/individual/my/boxes/${id(boxId)}`)).data;
  },
  async myTape(tapeId: string): Promise<MyTape> {
    return (await api.get<MyTape>(`/individual/my/tapes/${id(tapeId)}`)).data;
  },
  async createBox(jobId: string): Promise<BoxSummary> {
    return (
      await api.post<BoxSummary>(`/individual/clients/${id(jobId)}/boxes`)
    ).data;
  },
  async listBoxes(
    params: PageQuery & {
      client_id?: string;
      status?: "open" | "closed" | "shipped";
    } = {}
  ): Promise<Page<BoxSummary>> {
    // Here client_id is the INDIVIDUAL JOB id, not clients.id.
    return (await api.get<Page<BoxSummary>>("/individual/boxes", { params }))
      .data;
  },
  async closeBox(boxId: string, driveUrl?: string): Promise<BoxSummary> {
    return (
      await api.patch<BoxSummary>(
        `/individual/boxes/${id(boxId)}/close`,
        driveUrl ? { drive_url: driveUrl } : {}
      )
    ).data;
  },
  async shipBox(boxId: string): Promise<BoxSummary> {
    return (await api.patch<BoxSummary>(`/individual/boxes/${id(boxId)}/ship`))
      .data;
  },
  async setDeliveryUrl(boxId: string, driveUrl: string): Promise<BoxSummary> {
    return (
      await api.patch<BoxSummary>(`/individual/boxes/${id(boxId)}/drive-url`, {
        drive_url: driveUrl
      })
    ).data;
  },
  async removeBox(boxId: string): Promise<Message> {
    return (await api.delete<Message>(`/individual/boxes/${id(boxId)}`)).data;
  },
  async addTape(boxId: string, body: TapeInput): Promise<TapeSummary> {
    return (
      await api.post<TapeSummary>(`/individual/boxes/${id(boxId)}/tapes`, body)
    ).data;
  },
  async updateTape(
    tapeId: string,
    body: Partial<TapeInput>
  ): Promise<TapeSummary> {
    return (
      await api.patch<TapeSummary>(`/individual/tapes/${id(tapeId)}`, body)
    ).data;
  },
  async transition(
    tapeId: string,
    body: TransitionInput
  ): Promise<TapeSummary> {
    return (
      await api.patch<TapeSummary>(
        `/individual/tapes/${id(tapeId)}/station`,
        body
      )
    ).data;
  },
  async removeTape(tapeId: string): Promise<Message> {
    return (await api.delete<Message>(`/individual/tapes/${id(tapeId)}`)).data;
  },
  async getBox(
    boxId: string,
    signal?: AbortSignal,
  ): Promise<IndividualBoxDetails> {
    const { data } = await api.get<IndividualBoxDetails>(
      `/individual/boxes/${id(boxId)}`,
      { signal },
    );

    return data;
  },
  async getTape(
    tapeId: string,
    signal?: AbortSignal,
  ): Promise<IndividualTapeDetails> {
    const { data } = await api.get<IndividualTapeDetails>(
      `/individual/tapes/${id(tapeId)}`,
      { signal },
    );

    return data;
  },
};
