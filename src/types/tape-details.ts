import type {
  IndividualTapeDetails, Station, TapeStageTiming,
} from '@/types/production-api';

export interface TapePerson {
  id: string;
  email: string;
  profiles: { display_name: string | null; operator_type: string | null } | null;
}

export interface TapeComment {
  id: string;
  tape_id: string;
  stage: Station;
  timing_id: string | null;
  author_id: string;
  text: string;
  created_at: string;
  author: TapePerson;
}

export interface DetailTiming extends TapeStageTiming {
  operator: TapePerson | null;
  note_author: TapePerson | null;
  note_author_email: string | null;
  pauses: Array<NonNullable<TapeStageTiming['pauses']>[number] & {
    author: TapePerson | null; author_email: string | null;
  }>;
  active_seconds: number;
}

export interface TapeActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  at: string;
  author: TapePerson | null;
  author_email: string;
  old_value: unknown;
  new_value: unknown;
}

export interface TapeDetails extends Omit<IndividualTapeDetails, 'stage_timings'> {
  server_now: string;
  stage_timings: DetailTiming[];
  comments: TapeComment[];
  activity: TapeActivity[];
  activity_has_more: boolean;
  people?: TapePerson[];
  context: {
    box: { id: string; closed: boolean; shipped_at: string | null; drive_url: string | null };
    job: { id: string; inv_no: string; name: string; phone: string; email: string | null } | null;
    customer: { id: string; name: string; client_type: string; phone: string | null; email: string | null } | null;
  };
}
