// These types cover the fields used by the initial integration. Services
// return direct response bodies, matching the supplied backend services.
export interface PageQuery {
  page?: number;
  limit?: number;
  search?: string;
}
export interface Page<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface Message {
  message: string;
}
export interface Customer {
  id: string;
  client_type: "individual" | "company";
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
}
export interface CustomerInput {
  name: string;
  client_type?: "individual" | "company";
  phone?: string;
  email?: string;
  notes?: string;
}
export interface ClientLink {
  id: string;
  client_id: string;
  user_id: string;
}
export interface IndividualJobSummary {
  id: string;
  inv_no: string;
  name: string;
  created_at: string;
}
export interface CustomerForAccount extends Customer {
  ind_clients: IndividualJobSummary[];
}
export interface NewJobInput {
  client_id: string;
  inv_no: string;
  name?: string;
  phone?: string;
}
export interface IndividualJob extends IndividualJobSummary {
  client_id: string | null;
  phone: string;
  email: string | null;
}
export interface BoxSummary {
  id: string;
  closed: boolean;
  shipped_at: string | null;
}
export interface MyJob {
  id: string;
  inv_no: string;
  name: string;
  boxes_closed: boolean;
  ind_boxes: BoxSummary[];
}
export interface TapeMetadata {
  title?: string;
  internal_ref?: string;
  country?: string;
  summary?: string;
  content_tags?: string[];

  event_date?: string;
  city?: string;
  people?: string;

  singer?: string;
  musician?: string;
  words?: string;
  company?: string;
  published_date?: string;
  tape_size?: string;
  tape_speed?: string;

  // Preserve additional metadata from other workflow stages.
  [key: string]: unknown;
}

export interface TapeSummary {
  id: string;
  tape_code: string | null;
  media_type: string;
  format: string;
  status: string;
  current_station: string | null;
  metadata: TapeMetadata | null;
}

export interface TapeHistoryEntry {
  station?: string;
  result?: string;
  by?: string;
  at?: string;

  // History may also contain additional production information.
  [key: string]: unknown;
}

export interface IndividualTapeDetails extends TapeSummary {
  box_id: string;
  barcode: string;
  capacity: number | null;
  color_system: string | null;
  audio_track: number | null;
  photo_size: string | null;
  picture_key: string | null;
  created_at: string;
  history: TapeHistoryEntry[];
}
export interface MyBox extends BoxSummary {
  ind_tapes: TapeSummary[];
}
export interface MyTape extends TapeSummary {
  box_id: string;
}
export type TapeMediaType = "video" | "audio" | "photo" | "document";

export interface TapeInput {
  tape_code: string;
  media_type: TapeMediaType;
  format: string;
  capacity?: number | null;
  color_system?: string | null;
  audio_track?: number | null;
  photo_size?: string | null;

  title?: string;
  internal_ref?: string;
  country?: string;
  summary?: string;
  content_tags?: string[];

  event_date?: string;
  city?: string;
  people?: string;

  singer?: string;
  musician?: string;
  words?: string;
  company?: string;
  published_date?: string;
  tape_size?: string;
  tape_speed?: string;
}
export type Station =
  | "received"
  | "inspected"
  | "cleaning"
  | "baking"
  | "ingest"
  | "qc"
  | "restoration"
  | "ready"
  | "shipped";
export interface TransitionInput {
  to_station: Station;
  result: "OK" | "NOT_OK";
  issue_note?: string;
  photo_url?: string;
  device_id?: string;
  device_name?: string;
}
export interface ProjectSummary {
  id: string;
  client_name: string;
  client_id: string | null;
  po_invoice_number: string | null;
  phone: string;
  start_date: string;
  duration_days: number;
  extra_days: number;
  paused: boolean;
  finished: boolean;
}
export interface ProjectInput {
  client_name: string;
  client_id?: string;
  po_invoice_number?: string;
  phone: string;
  start_date: string;
  duration_days: number;
  contact_user_ids: string[];
}
// Update DTO intentionally excludes client_id/contact_user_ids: the supplied
// UpdatePovProjectDto does not accept ownership or membership changes.
export type ProjectUpdate = Partial<
  Pick<
    ProjectInput,
    | "client_name"
    | "po_invoice_number"
    | "phone"
    | "start_date"
    | "duration_days"
  >
>;
export interface ProjectDetails {
  project: ProjectSummary;
  timer: {
    deadline: string;
    is_paused: boolean;
    is_finished: boolean;
    is_overdue: boolean;
    remaining_seconds: number;
    overdue_seconds: number;
  };
  progress: {
    total: number;
    digitized: number;
    remaining: number;
    percentage: number;
  };
  formats: {
    format: string;
    quantity: number;
    digitized: number;
    remaining: number;
  }[];
}
export interface PovContact {
  id: string;
  project_id: string;
  user_id: string;
}
export interface RecordInput {
  format: string;
  label?: string;
  internal_ref?: string;
  capacity?: number;
  duration?: number;
  color_system?: string;
  frame_rate?: string;
  resolution?: string;
  aspect_ratio?: string;
  trim?: boolean;
  restoration?: boolean;
  master_file?: boolean;
  access_copy?: boolean;
  file_size?: number;
  note?: string;
  photo_url?: string;
}
export type RecordStatus = "on_shelf" | "in_progress" | "done";
export interface PovRecord {
  id: string;
  project_id: string;
  record_no: string;
  barcode: string;
  format: string;
  label: string | null;
  status: RecordStatus;
  // Prisma Decimal is commonly serialized as a string. Do not assume a JS number.
  file_size: string | number | null;
}
export interface CustomerListItem extends Customer {
  client_users: Array<
    ClientLink & {
      users: {
        id: string;
        email: string;
        status: "active" | "inactive";
        profiles: {
          display_name: string | null;
          phone: string | null;
        } | null;
      };
    }
  >;

  _count: {
    ind_clients: number;
    pov_projects: number;
  };
}
export interface CustomerDetails extends Customer {
  client_users: CustomerListItem["client_users"];
  ind_clients: IndividualJobSummary[];
  pov_projects: ProjectSummary[];
}
export interface IndividualJobListItem extends IndividualJob {
  clients: {
    id: string;
    name: string;
    client_type: "individual" | "company";
  } | null;

  ind_boxes: BoxSummary[];
}
export interface IndividualJobBox extends BoxSummary {
  ind_tapes: TapeSummary[];
}

export interface IndividualJobDetails extends IndividualJob {
  clients: Customer | null;
  ind_boxes: IndividualJobBox[];
}

export interface IndividualBoxDetails extends BoxSummary {
  client_id: string;
  drive_url: string | null;
  ind_clients: IndividualJob;
  ind_tapes: TapeSummary[];
}