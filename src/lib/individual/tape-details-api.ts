import api from '@/apis/axios';
import type { Station } from '@/types/production-api';
import type { TapeComment, TapeDetails } from '@/types/tape-details';

export const tapeDetailsApi = {
  async get(tapeId: string, signal?: AbortSignal): Promise<TapeDetails> {
    return (await api.get<TapeDetails>(
      `/individual/tapes/${encodeURIComponent(tapeId)}`, { signal },
    )).data;
  },
  async comment(tapeId: string, body: {
    stage: Station; text: string; timing_id?: string;
  }): Promise<TapeComment> {
    return (await api.post<TapeComment>(
      `/individual/tapes/${encodeURIComponent(tapeId)}/comments`, body,
    )).data;
  },
};
