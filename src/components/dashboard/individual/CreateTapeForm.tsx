"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent
} from "react";
import { ChevronDown } from "lucide-react";
import { individualError } from "@/hooks/individual/useIndividualJob";
import type { TapeInput, TapeMediaType } from "@/types/production-api";

interface Props {
  open: boolean;
  boxId: string;
  busy: boolean;
  error: string | null;
  onSubmit: (input: TapeInput) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "dashboard-input min-h-12 px-4 py-3 placeholder:text-dashboard-muted";

const FORMATS: Record<TapeMediaType, readonly string[]> = {
  video: [
    "VHS",
    "VHS-C",
    "S-VHS",
    "Hi8/D8",
    "MiniDV",
    "MicroMV",
    "Betamax",
    "CD",
    "DVD",
    "MiniDisk",
    "Betacam SP",
    "Betacam SX",
    "Digital Betacam",
    "HDCAM",
    "HDV",
    "DVCAM",
    "DVCPRO",
    "DVCPRO HD",
    "U-Matic SP",
    "U-Matic",
    "1-inch",
    "2-inch"
  ],
  audio: [
    "Audio Cassette",
    "Micro Cassette",
    "Vinyl",
    "Reel",
    "DAT",
    "Cartridge"
  ],
  photo: ["Printed Photo", "Slide", "Negative", "Positive", "Microfiche"],
  document: ["Document"]
};

const CAPACITIES = ["30", "60", "90", "120", "180", "240"];
const VINYL_CAPACITIES = ["8", "15", "30", "40"];
const COLOR_SYSTEMS = ["PAL 625", "NTSC 525", "SECAM 625", "MESECAM 625"];
const AUDIO_TRACKS = ["2", "4", "8"];
const VINYL_SIZES = ['7"', '10"', '12"'];
const VINYL_SPEEDS = ["33 1/3", "45", "78"];
const REEL_SIZES = ['3"', '7"', '10.5"'];
const REEL_SPEEDS = ["1 7/8", "3 3/4", "7 1/2", "15", "30"];

const SIZES = [
  "A1 (23x33 in)",
  "A2 (16x23 in)",
  "A3 (12x16 in)",
  "A4 (8x12 in)",
  "A5 (6x8 in)",
  "A6 (4x6 in)",
  "A7 (3x4 in)",
  "A8 (2x3 in)",
  "A9 (1.5x2 in)",
  "A10 (1x1.5 in)"
];

const CATEGORIES = [
  "Family",
  "Party",
  "Sport",
  "Religious",
  "Documentary",
  "News",
  "Event",
  "Commercial",
  "Cultural Heritage"
];

const MEDIA_LABELS: Record<TapeMediaType, string> = {
  video: "Video",
  audio: "Audio",
  photo: "Photo",
  document: "Document"
};

const MEDIA_SUFFIX: Record<TapeMediaType, string> = {
  video: "V",
  audio: "A",
  photo: "P",
  document: "D"
};

const PLACEHOLDERS: Record<string, string> = {
  title: "e.g. Wedding of Karim and Sara",
  internal_ref: "e.g. FAM-1998-03",
  country: "e.g. Algeria",
  city: "e.g. Oran",
  people: "e.g. Karim, Sara, family",
  singer: "e.g. Ahmed Wahby",
  musician: "e.g. Oran Orchestra",
  words: "e.g. Traditional",
  company: "e.g. Disques Oasis",
  published_date: "e.g. 1972 or 1972-06-15"
};

type Values = Record<string, string>;

function FormSelect({
  children,
  className = "",
  disabled,
  ...props
}: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        {...props}
        disabled={disabled}
        className={`
          dashboard-input min-h-12 appearance-none
          py-3 pl-4 pr-12
          ${className}
        `}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        aria-hidden="true"
        className={`
          pointer-events-none absolute right-4 top-1/2
          -translate-y-1/2 text-dashboard-muted
          ${disabled ? "opacity-50" : ""}
        `}
      />
    </div>
  );
}

interface DateFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function DateField({ id, name, label, value, onChange }: DateFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2 text-sm">
      <span>{label}</span>

      <input
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        aria-describedby={`${id}-help`}
      />

      <span
        id={`${id}-help`}
        className="block text-xs leading-5 text-dashboard-muted"
      >
        Example: 18 March 2027. Choose from the calendar or type using the
        format shown in the field.
      </span>
    </label>
  );
}

interface ScheduleFieldsProps {
  id: string;
  prefix: "start" | "due";
  label: string;
  date: string;
  time: string;
  disabled: boolean;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

function ScheduleFields({
  id,
  prefix,
  label,
  date,
  time,
  disabled,
  onDateChange,
  onTimeChange
}: ScheduleFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DateField
        id={`${id}-${prefix}-date`}
        name={`${prefix}_date`}
        label={`${label} date`}
        value={date}
        onChange={onDateChange}
      />

      <label
        htmlFor={`${id}-${prefix}-time`}
        className="block space-y-2 text-sm"
      >
        <span>{label} time</span>

        <input
          id={`${id}-${prefix}-time`}
          name={`${prefix}_time`}
          type="time"
          step={60}
          disabled={disabled || !date}
          required={Boolean(date)}
          className={inputClass}
          value={time}
          onChange={(event) => onTimeChange(event.target.value)}
          aria-describedby={`${id}-${prefix}-time-help`}
        />

        <span
          id={`${id}-${prefix}-time-help`}
          className="block text-xs leading-5 text-dashboard-muted"
        >
          Example: 09:30. Required when a date is selected.
        </span>
      </label>
    </div>
  );
}

function scheduleTimestamp(
  dateValue: string | undefined,
  timeValue: string | undefined,
  label: string
): string | undefined {
  const date = dateValue?.trim() ?? "";
  const time = timeValue?.trim() ?? "";

  if (!date && !time) return undefined;

  if (!date || !time) {
    throw new Error(`Enter both the ${label} date and time.`);
  }

  const parsed = new Date(`${date}T${time}`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Enter a valid ${label} date and time.`);
  }

  // Reject invalid dates and local times that were normalized,
  // such as a time that does not exist during a daylight-saving change.
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() + 1 !== month ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hours ||
    parsed.getMinutes() !== minutes
  ) {
    throw new Error(`Enter a valid ${label} date and time.`);
  }

  return parsed.toISOString();
}

export function CreateTapeModal({
  open,
  boxId,
  busy,
  error,
  onSubmit,
  onCancel
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }

    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      if (dialog.open) {
        dialog.close();
      }
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();

        if (!busy && dialogRef.current?.dataset.saving !== "true") {
          onCancel();
        }
      }}
      className="
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl
        overflow-y-auto rounded-2xl
        border border-dashboard-border bg-dashboard-surface p-0
        text-dashboard-text shadow-2xl backdrop:bg-black/50
      "
    >
      {open && (
        <TapeForm
          key={boxId}
          boxId={boxId}
          busy={busy}
          error={error}
          titleId={titleId}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onSavingChange={(saving) => {
            if (dialogRef.current) {
              dialogRef.current.dataset.saving = String(saving);
            }
          }}
        />
      )}
    </dialog>
  );
}

function TapeForm({
  boxId,
  busy,
  error,
  titleId,
  onSubmit,
  onCancel,
  onSavingChange
}: Omit<Props, "open"> & {
  titleId: string;
  onSavingChange: (saving: boolean) => void;
}) {
  const id = useId();
  const submitting = useRef(false);

  const [mediaType, setMediaType] = useState<TapeMediaType>("video");
  const [values, setValues] = useState<Values>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [validation, setValidation] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const locked = busy || saving;
  const format = values.format ?? "";

  const isVideo = mediaType === "video";
  const isAudio = mediaType === "audio";
  const isPhoto = mediaType === "photo";
  const isDocument = mediaType === "document";
  const isVinyl = isAudio && format === "Vinyl";
  const isReel = isAudio && format === "Reel";

  const hasCapacity = isVideo || (isAudio && !isReel);
  const hasEvent = isVideo || isPhoto;
  const hasPaperSize = isDocument || (isPhoto && format === "Printed Photo");

  const capacityOptions = isVinyl ? VINYL_CAPACITIES : CAPACITIES;

  function change(key: string, value: string) {
    setValues((previous) => ({
      ...previous,
      [key]: value
    }));

    setValidation(null);
  }

  function changeScheduleDate(prefix: "start" | "due", date: string) {
    setValues((previous) => ({
      ...previous,
      [`${prefix}_date`]: date,
      [`${prefix}_time`]: date ? previous[`${prefix}_time`] ?? "" : ""
    }));

    setValidation(null);
  }

  function text(key: string, label: string, required = false) {
    const placeholder =
      key === "tape_code"
        ? `e.g. ${boxId}-001-${MEDIA_SUFFIX[mediaType]}`
        : PLACEHOLDERS[key] ?? `Enter ${label.toLowerCase()}`;

    return (
      <label
        key={key}
        htmlFor={`${id}-${key}`}
        className="block space-y-2 text-sm"
      >
        <span>
          {label}
          {required ? " *" : ""}
        </span>

        <input
          id={`${id}-${key}`}
          name={key}
          required={required}
          placeholder={placeholder}
          className={inputClass}
          value={values[key] ?? ""}
          onChange={(event) => change(key, event.target.value)}
        />
      </label>
    );
  }

  function select(
    key: string,
    label: string,
    options: readonly string[],
    required = true
  ) {
    return (
      <label
        key={key}
        htmlFor={`${id}-${key}`}
        className="block space-y-2 text-sm"
      >
        <span>
          {label}
          {required ? " *" : ""}
        </span>

        <FormSelect
          id={`${id}-${key}`}
          name={key}
          required={required}
          value={values[key] ?? ""}
          onChange={(event) => {
            const next = event.target.value;

            if (key === "format") {
              setValues((previous) => ({
                ...previous,
                format: next,
                capacity: "",
                photo_size: "",
                tape_size: "",
                tape_speed: ""
              }));

              setValidation(null);
              return;
            }

            change(key, next);
          }}
        >
          <option value="">Select {label.toLowerCase()}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </FormSelect>
      </label>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (locked || submitting.current) return;

    const materialId = (values.tape_code ?? "").trim();
    const prefix = `${boxId}-`;
    const suffix = `-${MEDIA_SUFFIX[mediaType]}`;

    const sequence =
      materialId.startsWith(prefix) && materialId.endsWith(suffix)
        ? materialId.slice(prefix.length, -suffix.length)
        : "";

    if (!/^\d{3,}$/.test(sequence) || !/[1-9]/.test(sequence)) {
      setValidation(
        `Material ID must follow ${boxId}-001-${MEDIA_SUFFIX[mediaType]} ` +
          "with a positive sequence number."
      );
      return;
    }

    if (!FORMATS[mediaType].includes(format)) {
      setValidation("Select a valid format.");
      return;
    }

    if (hasCapacity && !capacityOptions.includes(values.capacity ?? "")) {
      setValidation("Select a valid capacity.");
      return;
    }

    if (isVideo && !COLOR_SYSTEMS.includes(values.color_system ?? "")) {
      setValidation("Select a color system.");
      return;
    }

    if (isAudio && !AUDIO_TRACKS.includes(values.audio_track ?? "")) {
      setValidation("Select an audio track.");
      return;
    }

    if (hasPaperSize && !SIZES.includes(values.photo_size ?? "")) {
      setValidation("Select a size.");
      return;
    }

    if (
      isVinyl &&
      (!VINYL_SIZES.includes(values.tape_size ?? "") ||
        !VINYL_SPEEDS.includes(values.tape_speed ?? ""))
    ) {
      setValidation("Select a valid vinyl size and speed.");
      return;
    }

    if (
      isReel &&
      (!REEL_SIZES.includes(values.tape_size ?? "") ||
        !REEL_SPEEDS.includes(values.tape_speed ?? ""))
    ) {
      setValidation("Select a valid reel size and speed.");
      return;
    }

    let plannedStart: string | undefined;
    let deadline: string | undefined;

    try {
      plannedStart = scheduleTimestamp(
        values.start_date,
        values.start_time,
        "planned start"
      );

      deadline = scheduleTimestamp(
        values.due_date,
        values.due_time,
        "deadline"
      );

      if (
        plannedStart &&
        deadline &&
        new Date(deadline).getTime() < new Date(plannedStart).getTime()
      ) {
        throw new Error("Planned end cannot precede planned start.");
      }
    } catch (failure) {
      setValidation(
        failure instanceof Error ? failure.message : "Check the schedule dates."
      );
      return;
    }

    const optional = (key: string) => values[key]?.trim() || undefined;

    const input: TapeInput = {
      tape_code: materialId,
      media_type: mediaType,
      format,
      title: optional("title"),
      internal_ref: optional("internal_ref"),
      country: optional("country"),
      summary: optional("summary"),
      content_tags: categories,
      ...(plannedStart ? { planned_start_at: plannedStart } : {}),
      ...(deadline ? { due_at: deadline } : {})
    };

    if (hasCapacity) {
      input.capacity = Number(values.capacity);
    }

    if (isVideo) {
      input.color_system = values.color_system;
    }

    if (isAudio) {
      input.audio_track = Number(values.audio_track);
      input.singer = optional("singer");
      input.musician = optional("musician");
      input.words = optional("words");
      input.company = optional("company");
      input.published_date = optional("published_date");

      if (isVinyl || isReel) {
        input.tape_size = values.tape_size;
        input.tape_speed = values.tape_speed;
      }
    }

    if (hasPaperSize) {
      input.photo_size = values.photo_size;
    }

    if (hasEvent) {
      input.event_date = optional("event_date");
      input.city = optional("city");
      input.people = optional("people");
    }

    setValidation(null);
    submitting.current = true;
    setSaving(true);
    onSavingChange(true);

    try {
      await onSubmit(input);
    } catch (failure) {
      setValidation(individualError(failure, "Could not create the tape."));
    } finally {
      submitting.current = false;
      setSaving(false);
      onSavingChange(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      aria-busy={locked}
      className="p-5 sm:p-8"
    >
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-xl font-semibold">
            Add tape / material
          </h2>

          <p className="mt-2 text-sm text-dashboard-muted">
            Box: {boxId}. Enter the Material ID printed on the item.
          </p>
        </div>

        <button
          type="button"
          disabled={locked}
          onClick={onCancel}
          aria-label="Close add tape modal"
          className="dashboard-btn-secondary"
        >
          ✕
        </button>
      </header>

      <fieldset disabled={locked} className="space-y-6">
        <legend className="sr-only">Material intake</legend>

        <label htmlFor={`${id}-media-type`} className="block space-y-2 text-sm">
          <span>Media type *</span>

          <FormSelect
            id={`${id}-media-type`}
            name="media_type"
            required
            value={mediaType}
            onChange={(event) => {
              const next = event.target.value as TapeMediaType;

              if (!(next in FORMATS)) return;

              setMediaType(next);

              setValues((previous) => ({
                ...previous,
                format: next === "document" ? "Document" : "",
                capacity: "",
                color_system: "",
                audio_track: "",
                photo_size: "",
                tape_size: "",
                tape_speed: ""
              }));

              setValidation(null);
            }}
          >
            {Object.entries(MEDIA_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </FormSelect>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            {text("tape_code", "Material ID", true)}

            <p className="mt-2 text-xs text-dashboard-muted">
              Example: {boxId}-001-{MEDIA_SUFFIX[mediaType]}. Must be unique
              across Individual and POV.
            </p>
          </div>

          {isDocument ? (
            <label
              htmlFor={`${id}-document-format`}
              className="block space-y-2 text-sm"
            >
              <span>Format</span>

              <FormSelect
                id={`${id}-document-format`}
                value="Document"
                disabled
              >
                <option value="Document">Document</option>
              </FormSelect>
            </label>
          ) : (
            select("format", "Format", FORMATS[mediaType])
          )}

          {text("title", "Title")}
          {text("internal_ref", "Internal reference")}
          {text("country", "Country")}
        </div>

        <section className="space-y-4">
          <h3 className="text-base font-semibold">
            {MEDIA_LABELS[mediaType]} details
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {hasCapacity &&
              select("capacity", "Capacity (min)", capacityOptions)}

            {isVideo && select("color_system", "Color system", COLOR_SYSTEMS)}

            {isAudio && select("audio_track", "Audio track", AUDIO_TRACKS)}

            {isVinyl && (
              <>
                {select("tape_size", "Vinyl size", VINYL_SIZES)}
                {select("tape_speed", "Vinyl speed", VINYL_SPEEDS)}
              </>
            )}

            {isReel && (
              <>
                {select("tape_size", "Reel size", REEL_SIZES)}
                {select("tape_speed", "Reel speed (IPS)", REEL_SPEEDS)}
              </>
            )}

            {hasPaperSize && select("photo_size", "Size", SIZES)}

            {hasEvent && (
              <>
                <DateField
                  id={`${id}-event-date`}
                  name="event_date"
                  label="Original event date"
                  value={values.event_date ?? ""}
                  onChange={(value) => change("event_date", value)}
                />

                {text("city", "City")}
                {text("people", "People")}
              </>
            )}

            {isAudio && (
              <>
                {text("singer", "Singer")}
                {text("musician", "Musician")}
                {text("words", "Words / lyricist")}
                {text("company", "Company")}

                <div>
                  {text("published_date", "Published date")}

                  <p className="mt-2 text-xs text-dashboard-muted">
                    A year alone is allowed, for example 1972. For a full date,
                    use YYYY-MM-DD.
                  </p>
                </div>
              </>
            )}
          </div>

          {isReel && (
            <p className="text-xs text-dashboard-muted">
              Reel has no capacity field. Speed is measured in IPS.
            </p>
          )}

          {isVinyl && (
            <p className="text-xs text-dashboard-muted">
              Vinyl speed is measured in RPM.
            </p>
          )}
        </section>

        <section className="space-y-5 rounded-lg border border-dashboard-border p-4">
          <div>
            <h3 className="text-sm font-semibold">Schedule — optional</h3>

            <p className="mt-1 text-xs leading-5 text-dashboard-muted">
              Plan when processing should begin and when the tape should be
              finished. These dates do not start a timer.
            </p>
          </div>

          <ScheduleFields
            id={id}
            prefix="start"
            label="Planned start"
            date={values.start_date ?? ""}
            time={values.start_time ?? ""}
            disabled={locked}
            onDateChange={(value) => changeScheduleDate("start", value)}
            onTimeChange={(value) => change("start_time", value)}
          />

          <div className="border-t border-dashboard-border pt-5">
            <ScheduleFields
              id={id}
              prefix="due"
              label="Planned end / deadline"
              date={values.due_date ?? ""}
              time={values.due_time ?? ""}
              disabled={locked}
              onDateChange={(value) => changeScheduleDate("due", value)}
              onTimeChange={(value) => change("due_time", value)}
            />
          </div>

          <p className="text-xs leading-5 text-dashboard-muted">
            Leave either date empty if it is unknown. Each selected date needs a
            time. Times use your device’s local timezone.
          </p>
        </section>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold">
            Content category — select several
          </legend>

          <div className="grid gap-3 sm:grid-cols-3">
            {CATEGORIES.map((category) => (
              <label
                key={category}
                className="
                  flex cursor-pointer items-center gap-3 rounded-lg
                  border border-dashboard-border px-3 py-3 text-sm
                "
              >
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={(event) => {
                    const checked = event.target.checked;

                    setCategories((previous) =>
                      checked
                        ? [...previous, category]
                        : previous.filter((item) => item !== category)
                    );
                  }}
                  className="h-4 w-4 accent-dashboard-focus"
                />

                <span>{category}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor={`${id}-summary`} className="block space-y-2 text-sm">
          <span>Summary</span>

          <textarea
            id={`${id}-summary`}
            name="summary"
            rows={4}
            placeholder="e.g. Family wedding ceremony and evening party in Oran."
            className={`${inputClass} resize-y`}
            value={values.summary ?? ""}
            onChange={(event) => change("summary", event.target.value)}
          />
        </label>
      </fieldset>

      {(validation || error) && (
        <div role="alert" className="mt-5 space-y-1 text-sm text-dashboard-red">
          {validation && <p>{validation}</p>}
          {error && error !== validation && <p>{error}</p>}
        </div>
      )}

      <footer className="mt-6 flex justify-end gap-3 border-t border-dashboard-border pt-5">
        <button
          type="button"
          disabled={locked}
          onClick={onCancel}
          className="dashboard-btn-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={locked}
          className="dashboard-btn-primary"
        >
          {locked ? "Creating…" : "Create tape"}
        </button>
      </footer>
    </form> 
  );
}
