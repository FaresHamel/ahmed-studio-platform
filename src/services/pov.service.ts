import api from '@/apis/axios';
import type { PageQuery, Page, ProjectSummary, ProjectInput, ProjectUpdate, ProjectDetails, PovContact, RecordInput, PovRecord, RecordStatus, Message } from '@/types/production-api';
const id = encodeURIComponent;
export const povService = {
  async list(params: PageQuery = {}): Promise<Page<ProjectSummary>> {
    return (await api.get<Page<ProjectSummary>>('/pov/projects', { params })).data;
  },
  async mine(): Promise<ProjectSummary[]> {
    return (await api.get<ProjectSummary[]>('/pov/projects/my')).data;
  },
  async get(projectId: string): Promise<ProjectDetails> {
    return (await api.get<ProjectDetails>(`/pov/projects/${id(projectId)}`)).data;
  },
  async create(body: ProjectInput): Promise<ProjectSummary> {
    return (await api.post<ProjectSummary>('/pov/projects', body)).data;
  },
  async update(projectId: string, body: ProjectUpdate): Promise<ProjectSummary> {
    return (await api.patch<ProjectSummary>(`/pov/projects/${id(projectId)}`, body)).data;
  },
  async remove(projectId: string): Promise<Message> {
    return (await api.delete<Message>(`/pov/projects/${id(projectId)}`)).data;
  },
  async lifecycle(projectId: string, action: 'pause' | 'resume' | 'extend' | 'finish' | 'reopen'): Promise<ProjectSummary> {
    return (await api.patch<ProjectSummary>(`/pov/projects/${id(projectId)}/${action}`)).data;
  },
  async addContact(projectId: string, userId: string): Promise<PovContact> {
    return (await api.post<PovContact>(`/pov/projects/${id(projectId)}/contacts`, { user_id: userId })).data;
  },
  async removeContact(projectId: string, contactId: string): Promise<Message> {
    return (await api.delete<Message>(`/pov/projects/${id(projectId)}/contacts/${id(contactId)}`)).data;
  },
  async records(projectId: string, params: PageQuery = {}): Promise<Page<PovRecord>> {
    return (await api.get<Page<PovRecord>>(`/pov/projects/${id(projectId)}/records`, { params })).data;
  },
  async record(recordId: string): Promise<PovRecord> {
    return (await api.get<PovRecord>(`/pov/records/${id(recordId)}`)).data;
  },
  async addRecord(projectId: string, body: RecordInput): Promise<PovRecord> {
    return (await api.post<PovRecord>(`/pov/projects/${id(projectId)}/records`, body)).data;
  },
  async updateRecord(recordId: string, body: Partial<RecordInput>): Promise<PovRecord> {
    return (await api.patch<PovRecord>(`/pov/records/${id(recordId)}`, body)).data;
  },
  async setRecordStatus(recordId: string, status: RecordStatus): Promise<PovRecord> {
    return (await api.patch<PovRecord>(`/pov/records/${id(recordId)}/status`, { status })).data;
  },
  async removeRecord(recordId: string): Promise<Message> {
    return (await api.delete<Message>(`/pov/records/${id(recordId)}`)).data;
  },
};
