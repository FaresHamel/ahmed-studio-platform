import type { TapeDetails, TapePerson } from "@/types/tape-details";
import { dateTime, personName } from "@/lib/individual/tape-details-display";
import { stageLabel } from "@/lib/individual/tape-workflow";
import { Badge, DetailSection } from "./DetailPrimitives";

type ObjectValue = Record<string, unknown>;
type PeopleMap = ReadonlyMap<string, string>;
type ActivityEvent = TapeDetails["activity"][number];
type HistoryEntry = TapeDetails["history"][number];

interface Props {
  tape: TapeDetails & {
    people?: TapePerson[];
  };
}

interface ReadableValueProps {
  value: unknown;
  field?: string;
  people: PeopleMap;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PERSON_FIELDS = new Set(["assigned_by", "operator_id", "author_id"]);

const FORMATTED_FIELDS = new Set([
  "station",
  "current_station",
  "from_station",
  "media_type",
  "status",
  "skipped_stations"
]);

const FIELD_LABELS: Record<string, string> = {
  id: "Reference",
  tape_id: "Internal material ID",
  tape_code: "Material ID",
  box_id: "Box",
  media_type: "Media type",
  current_station: "Production stage",
  content_tags: "Categories",
  internal_ref: "Internal reference",
  event_date: "Original event date",
  by: "Recorded by",
  at: "Recorded at",
  issue_note: "Note",
  from_station: "Previous stage",
  skipped_stations: "Skipped stages",
  assigned_by: "Assigned by",
  operator_id: "Operator",
  author_id: "Author"
};

const ACTION_LABELS: Record<string, string> = {
  update_schedule: "Updated schedule",
  assign_operator: "Assigned operator",
  start: "Started work",
  pause: "Paused work",
  resume: "Resumed work",
  finish: "Finished work",
  cancel: "Cancelled work attempt",
  comment: "Added comment"
};

const ENTITY_LABELS: Record<string, string> = {
  ind_tape_assignments: "assignment",
  ind_tape_stage_timings: "stage dates"
};

const TABLE_COLUMNS = ["Action", "Date and time", "Recorded by", "Details"];

const CELL_CLASS = "px-4 py-4";

function isObject(value: unknown): value is ObjectValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isVisibleField([key, value]: [string, unknown]) {
  return !(
    key === "id" &&
    typeof value === "string" &&
    UUID_PATTERN.test(value)
  );
}

function actionLabel(action: string, entityType: string) {
  if (action.startsWith("station:")) {
    const [from, to] = action.slice("station:".length).split("->");

    return `Moved ${stageLabel(from ?? null)} → ` + stageLabel(to ?? null);
  }

  if (ACTION_LABELS[action]) {
    return ACTION_LABELS[action];
  }

  if (action === "create" || action === "update") {
    const verb = action === "create" ? "Created" : "Updated";
    const target = ENTITY_LABELS[entityType] ?? "material";

    return `${verb} ${target}`;
  }

  return stageLabel(action);
}

function buildPeopleMap(tape: Props["tape"]): PeopleMap {
  const people = new Map<string, string>();

  function addPerson(person: TapePerson | null | undefined) {
    if (person) {
      people.set(person.id, personName(person));
    }
  }

  for (const person of tape.people ?? []) {
    addPerson(person);
  }

  for (const assignment of tape.assignments ?? []) {
    addPerson(assignment.operator);
  }

  for (const timing of tape.stage_timings) {
    addPerson(timing.operator);
  }

  for (const comment of tape.comments) {
    addPerson(comment.author);
  }

  for (const event of tape.activity) {
    addPerson(event.author);
  }

  return people;
}

function ReadableValue({ value, field = "", people }: ReadableValueProps) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-dashboard-muted">Not recorded</span>;
  }

  if (typeof value === "string" && PERSON_FIELDS.has(field)) {
    return <>{people.get(value) ?? "Account not available"}</>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-dashboard-muted">None</span>;
    }

    return (
      <ul className="space-y-3">
        {value.map((item, index) => (
          <li key={index} className="min-w-0">
            <ReadableValue value={item} field={field} people={people} />
          </li>
        ))}
      </ul>
    );
  }

  if (isObject(value)) {
    return (
      <dl className="space-y-5">
        {Object.entries(value)
          .filter(isVisibleField)
          .map(([key, item]) => (
            <div key={key} className="min-w-0">
              <dt className="text-dashboard-muted">
                {FIELD_LABELS[key] ?? stageLabel(key)}
              </dt>

              <dd className="mt-3 min-w-0 whitespace-pre-wrap break-words text-dashboard-text">
                <ReadableValue value={item} field={key} people={people} />
              </dd>
            </div>
          ))}
      </dl>
    );
  }

  if (typeof value === "boolean") {
    return <>{value ? "Yes" : "No"}</>;
  }

  if (typeof value === "string") {
    if (field === "at" || field.endsWith("_at")) {
      return <>{dateTime(value)}</>;
    }

    if (FORMATTED_FIELDS.has(field)) {
      return <>{stageLabel(value)}</>;
    }
  }

  return <>{String(value)}</>;
}

function ChangeSnapshot({
  title,
  value,
  people
}: {
  title: string;
  value: unknown;
  people: PeopleMap;
}) {
  return (
    <div className="min-w-0">
      <h4 className="mb-3 font-semibold text-dashboard-text">{title}</h4>

      <ReadableValue value={value} people={people} />
    </div>
  );
}

function ActivityRow({
  event,
  materialId,
  people
}: {
  event: ActivityEvent;
  materialId: string;
  people: PeopleMap;
}) {
  const saved = isObject(event.new_value) ? event.new_value : {};

  const reference =
    typeof saved.tape_code === "string" ? saved.tape_code : materialId;

  const materialCreated =
    event.action === "create" && event.entity_type === "ind_tapes";

  const hasPreviousValue =
    event.old_value !== null && event.old_value !== undefined;

  return (
    <tr
      className="
        border-t border-dashboard-border align-top
        transition-colors hover:bg-dashboard-hover/50
      "
    >
      <td className={CELL_CLASS}>
        <p className="font-medium text-dashboard-text">
          {actionLabel(event.action, event.entity_type)}
        </p>

        {materialCreated && (
          <p className="mt-3 break-all text-xs text-dashboard-blue">
            {reference}
          </p>
        )}
      </td>

      <td className={`${CELL_CLASS} whitespace-nowrap text-dashboard-muted`}>
        <time dateTime={event.at}>{dateTime(event.at)}</time>
      </td>

      <td className={CELL_CLASS}>
        {personName(event.author, event.author_email)}
      </td>

      <td className={`${CELL_CLASS} min-w-52`}>
        <details>
          <summary className="cursor-pointer text-dashboard-blue">
            View changes
          </summary>

          <div className="mt-5 space-y-6 text-xs leading-5">
            {hasPreviousValue && (
              <ChangeSnapshot
                title="Before"
                value={event.old_value}
                people={people}
              />
            )}

            <ChangeSnapshot
              title="After"
              value={event.new_value}
              people={people}
            />
          </div>
        </details>
      </td>
    </tr>
  );
}

function ActivityTable({
  tape,
  people
}: {
  tape: Props["tape"];
  people: PeopleMap;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-dashboard-border">
      <table className="w-full min-w-[620px] text-left text-[13px] leading-6">
        <caption className="sr-only">
          Material changes, authors, timestamps and saved details
        </caption>

        <thead className="bg-dashboard-hover text-dashboard-muted">
          <tr>
            {TABLE_COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-normal">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tape.activity.map((event) => (
            <ActivityRow
              key={event.id}
              event={event}
              materialId={tape.tape_code ?? tape.id}
              people={people}
            />
          ))}

          {tape.activity.length === 0 && (
            <tr>
              <td
                colSpan={TABLE_COLUMNS.length}
                className="px-4 py-8 text-center text-dashboard-muted"
              >
                No activity recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StationHistoryEntry({
  entry,
  people
}: {
  entry: HistoryEntry;
  people: PeopleMap;
}) {
  const note =
    typeof entry.issue_note === "string" ? entry.issue_note.trim() : "";

  return (
    <li className="rounded-lg border border-dashboard-border bg-dashboard-hover p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-dashboard-text">
          {stageLabel(entry.station ?? null)}
        </p>

        {entry.result && (
          <Badge
            className={
              entry.result === "OK"
                ? "bg-dashboard-green-soft text-dashboard-green"
                : "bg-dashboard-red-soft text-dashboard-red"
            }
          >
            {entry.result}
          </Badge>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-dashboard-muted">
        {entry.by || "Author not recorded"}
        {" · "}
        {dateTime(entry.at)}
      </p>

      {note && (
        <p className="mt-4 whitespace-pre-wrap break-words text-[13px] leading-6 text-dashboard-text">
          {note}
        </p>
      )}

      <details className="mt-4 text-xs leading-5">
        <summary className="cursor-pointer text-dashboard-blue">
          View full station entry
        </summary>

        <div className="mt-4">
          <ReadableValue value={entry} people={people} />
        </div>
      </details>
    </li>
  );
}

function StationHistory({
  history,
  people
}: {
  history: TapeDetails["history"];
  people: PeopleMap;
}) {
  return (
    <details className="mt-6 border-t border-dashboard-border pt-5">
      <summary className="cursor-pointer text-[13px] font-medium text-dashboard-text">
        Station history · {history.length}
      </summary>

      {history.length > 0 ? (
        <ol className="mt-5 space-y-4">
          {history.map((entry, index) => (
            <StationHistoryEntry
              key={`${entry.at ?? "history"}-${index}`}
              entry={entry}
              people={people}
            />
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-[13px] text-dashboard-muted">
          No station history recorded.
        </p>
      )}
    </details>
  );
}

export default function TapeActivityHistory({ tape }: Props) {
  const people = buildPeopleMap(tape);

  return (
    <DetailSection title="Recent activity">
      <ActivityTable tape={tape} people={people} />

      {tape.activity_has_more && (
        <p className="mt-4 text-xs leading-5 text-dashboard-muted">
          Showing the latest 200 audit events. Earlier events remain saved.
        </p>
      )}

      <StationHistory history={tape.history} people={people} />
    </DetailSection>
  );
}
