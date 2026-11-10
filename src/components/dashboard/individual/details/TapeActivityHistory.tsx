import type { TapeDetails } from "@/types/tape-details";
import { dateTime, personName } from "@/lib/individual/tape-details-display";
import { stageLabel } from "@/lib/individual/tape-workflow";
import { Badge, DetailSection } from "./DetailPrimitives";

type SavedObject = Record<string, unknown>;

function asObject(value: unknown): SavedObject {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as SavedObject)
    : {};
}

const FIELD_LABELS: Record<string, string> = {
  id: "Internal ID",
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

function fieldLabel(key: string) {
  return FIELD_LABELS[key] ?? stageLabel(key);
}

function ReadableValue({
  value,
  field = "",
  people
}: {
  value: unknown;
  field?: string;
  people: ReadonlyMap<string, string>;
}) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-dashboard-muted">Not recorded</span>;
  }

    if (
      typeof value === "string" &&
      ["assigned_by", "operator_id", "author_id"].includes(field)
    ) {
      return <span>{people.get(value) ?? "Account no longer available"}</span>;
    }
  if (Array.isArray(value)) {
    if (!value.length) {
      return <span className="text-dashboard-muted">None</span>;
    }

    return (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li key={index}>
            <ReadableValue value={item} field={field} people={people} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <dl className="space-y-3">
        {Object.entries(value).map(([key, item]) => (
          <div
            key={key}
            className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3"
          >
            <dt className="text-dashboard-muted">{fieldLabel(key)}</dt>

            <dd className="min-w-0 whitespace-pre-wrap break-words">
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

    if (
      [
        "station",
        "current_station",
        "from_station",
        "media_type",
        "status"
      ].includes(field)
    ) {
      return <>{stageLabel(value)}</>;
    }
  }

  return <>{String(value)}</>;
}

function actionLabel(action: string) {
  if (action === "create") return "Created material";
  if (action === "update") return "Updated material";
  if (action === "update_schedule") return "Updated schedule";
  if (action === "start") return "Started work";
  if (action === "pause") return "Paused work";
  if (action === "resume") return "Resumed work";
  if (action === "finish") return "Finished work";
  if (action === "cancel") return "Cancelled work attempt";
  if (action === "comment") return "Added a comment";

  if (action.startsWith("station:")) {
    const [from, to] = action.slice("station:".length).split("->");

    return `Moved ${stageLabel(from)} → ${stageLabel(to)}`;
  }

  return stageLabel(action);
}

export default function TapeActivityHistory({ tape }: { tape: TapeDetails }) {
    const people = new Map(
      (tape.people ?? []).map((person) => [person.id, personName(person)])
    );
  return (
    <DetailSection title="Activity and production history">
      {tape.activity.length ? (
        <ol className="space-y-4">
          {tape.activity.map((event) => {
            const saved = asObject(event.new_value);
            const materialId =
              typeof saved.tape_code === "string"
                ? saved.tape_code
                : tape.tape_code ?? tape.id;

            return (
              <li
                key={event.id}
                className="rounded-lg border border-dashboard-border p-4"
              >
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {personName(event.author, event.author_email)}
                  </p>

                  <time
                    dateTime={event.at}
                    className="text-xs text-dashboard-muted"
                  >
                    {dateTime(event.at)}
                  </time>
                </header>

                <p className="mt-2 text-sm text-dashboard-text">
                  {actionLabel(event.action)}

                  {event.action === "create" && (
                    <span className="ml-1 font-medium text-dashboard-blue">
                      {materialId}
                    </span>
                  )}
                </p>

                {event.action === "create" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {typeof saved.media_type === "string" && (
                      <Badge>{stageLabel(saved.media_type)}</Badge>
                    )}

                    {typeof saved.format === "string" && (
                      <Badge>{saved.format}</Badge>
                    )}

                    {typeof saved.current_station === "string" && (
                      <Badge className="bg-dashboard-blue-soft text-dashboard-blue">
                        {stageLabel(saved.current_station)}
                      </Badge>
                    )}
                  </div>
                )}

                <details className="mt-4 border-t border-dashboard-border pt-3">
                  <summary className="cursor-pointer text-xs text-dashboard-blue">
                    View saved changes
                  </summary>

                  <div className="mt-4 space-y-5 text-xs leading-5">
                    {event.old_value !== null &&
                      event.old_value !== undefined && (
                        <section>
                          <h4 className="mb-3 font-semibold">Before</h4>
                          <ReadableValue
                            value={event.old_value}
                            people={people}
                          />
                        </section>
                      )}

                    <section>
                      <h4 className="mb-3 font-semibold">After</h4>
                      <ReadableValue value={event.new_value} people={people} />
                    </section>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-sm text-dashboard-muted">
          No audit activity recorded.
        </p>
      )}

      {tape.activity_has_more && (
        <p className="mt-4 text-xs text-dashboard-muted">
          Showing the latest 200 audit events.
        </p>
      )}

      <details className="mt-6 border-t border-dashboard-border pt-5">
        <summary className="cursor-pointer text-sm font-medium">
          Station history · {tape.history.length}
        </summary>

        <ol className="mt-4 space-y-3">
          {tape.history.map((entry, index) => (
            <li
              key={`${entry.at ?? "history"}-${index}`}
              className="rounded-lg bg-dashboard-hover p-4"
            >
              <header className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">
                  {stageLabel(entry.station ?? null)}
                </span>

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
              </header>

              <p className="mt-2 text-xs text-dashboard-muted">
                {entry.by || "Author not recorded"}
                {" · "}
                {dateTime(entry.at)}
              </p>

              {typeof entry.issue_note === "string" &&
                entry.issue_note.trim() && (
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">
                    {entry.issue_note}
                  </p>
                )}
            </li>
          ))}
        </ol>

        {!tape.history.length && (
          <p className="mt-3 text-sm text-dashboard-muted">
            No station history recorded.
          </p>
        )}
      </details>
    </DetailSection>
  );
}
