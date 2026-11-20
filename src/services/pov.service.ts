import api from "@/apis/axios";

import type {
  Message,
  Page,
  PageQuery,
  PovContact,
  PovLifecycleAction,
  PovProjectActivityResponse,
  PovProjectComment,
  PovProjectData,
  PovRecord,
  ProjectDetails,
  ProjectInput,
  ProjectSummary,
  ProjectUpdate,
  RecordInput,
  RecordStatus
} from "@/types/production-api";

const projectPath = (projectId: string) =>
  `/pov/projects/${encodeURIComponent(projectId)}`;

const recordPath = (recordId: string) =>
  `/pov/records/${encodeURIComponent(recordId)}`;

const REASON_REQUIRED: ReadonlySet<PovLifecycleAction> = new Set([
  "pause",
  "extend",
  "reopen"
]);

export const povService = {
  async list(
    params: PageQuery = {},
    signal?: AbortSignal
  ): Promise<Page<ProjectSummary>> {
    const { data } = await api.get<Page<ProjectSummary>>(
      "/pov/projects",
      { params, signal }
    );

    return data;
  },

  async mine(signal?: AbortSignal): Promise<PovProjectData[]> {
    const { data } = await api.get<PovProjectData[]>(
      "/pov/projects/my",
      { signal }
    );

    return data;
  },

  async get(
    projectId: string,
    signal?: AbortSignal
  ): Promise<ProjectDetails> {
    const { data } = await api.get<ProjectDetails>(
      projectPath(projectId),
      { signal }
    );

    return data;
  },

  async create(
    body: ProjectInput
  ): Promise<ProjectDetails["project"]> {
    const { data } = await api.post<ProjectDetails["project"]>(
      "/pov/projects",
      body
    );

    return data;
  },

  async update(
    projectId: string,
    body: ProjectUpdate
  ): Promise<PovProjectData> {
    const { data } = await api.patch<PovProjectData>(
      projectPath(projectId),
      body
    );

    return data;
  },

  async remove(projectId: string): Promise<Message> {
    const { data } = await api.delete<Message>(
      projectPath(projectId)
    );

    return data;
  },

  async lifecycle(
    projectId: string,
    action: PovLifecycleAction,
    reason?: string
  ): Promise<PovProjectData> {
    const cleanedReason = reason?.trim();
    const requiresReason = REASON_REQUIRED.has(action);

    if (
      requiresReason &&
      (!cleanedReason || cleanedReason.length > 1000)
    ) {
      throw new Error("Enter a reason of 1–1000 characters.");
    }

    const { data } = await api.patch<PovProjectData>(
      `${projectPath(projectId)}/${action}`,
      requiresReason ? { reason: cleanedReason } : {}
    );

    return data;
  },

  async addContact(
    projectId: string,
    userId: string
  ): Promise<PovContact> {
    const { data } = await api.post<PovContact>(
      `${projectPath(projectId)}/contacts`,
      { user_id: userId }
    );

    return data;
  },

  async removeContact(
    projectId: string,
    contactId: string
  ): Promise<Message> {
    const { data } = await api.delete<Message>(
      `${projectPath(projectId)}/contacts/${encodeURIComponent(contactId)}`
    );

    return data;
  },

  async records(
    projectId: string,
    params: PageQuery = {},
    signal?: AbortSignal
  ): Promise<Page<PovRecord>> {
    const { data } = await api.get<Page<PovRecord>>(
      `${projectPath(projectId)}/records`,
      { params, signal }
    );

    return data;
  },

  async record(
    recordId: string,
    signal?: AbortSignal
  ): Promise<PovRecord> {
    const { data } = await api.get<PovRecord>(
      recordPath(recordId),
      { signal }
    );

    return data;
  },

  async addRecord(
    projectId: string,
    body: RecordInput
  ): Promise<PovRecord> {
    const { data } = await api.post<PovRecord>(
      `${projectPath(projectId)}/records`,
      body
    );

    return data;
  },

  async updateRecord(
    recordId: string,
    body: Partial<RecordInput>
  ): Promise<PovRecord> {
    const { data } = await api.patch<PovRecord>(
      recordPath(recordId),
      body
    );

    return data;
  },

  async setRecordStatus(
    recordId: string,
    status: RecordStatus
  ): Promise<PovRecord> {
    const { data } = await api.patch<PovRecord>(
      `${recordPath(recordId)}/status`,
      { status }
    );

    return data;
  },

  async removeRecord(recordId: string): Promise<Message> {
    const { data } = await api.delete<Message>(
      recordPath(recordId)
    );

    return data;
  },

  async activity(
    projectId: string,
    signal?: AbortSignal
  ): Promise<PovProjectActivityResponse> {
    const { data } = await api.get<PovProjectActivityResponse>(
      `${projectPath(projectId)}/activity`,
      { signal }
    );

    return data;
  },

  async comments(
    projectId: string,
    params: PageQuery = {},
    signal?: AbortSignal
  ): Promise<Page<PovProjectComment>> {
    const { data } = await api.get<Page<PovProjectComment>>(
      `${projectPath(projectId)}/comments`,
      { params, signal }
    );

    return data;
  },

  async addComment(
    projectId: string,
    text: string
  ): Promise<PovProjectComment> {
    const cleanedText = text.trim();

    if (!cleanedText || cleanedText.length > 4000) {
      throw new Error("Enter a comment of 1–4000 characters.");
    }

    const { data } = await api.post<PovProjectComment>(
      `${projectPath(projectId)}/comments`,
      { text: cleanedText }
    );

    return data;
  }
};