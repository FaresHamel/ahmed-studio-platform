"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode
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

type Values = Record<string, string>;
type SchedulePrefix = "start" | "due";

const INPUT_CLASS =
  "dashboard-input min-h-12 px-4 py-3 placeholder:text-dashboard-muted";

const PLACEHOLDERS: Record<string, string> = {
  title: "e.g. Wedding of Abdullah and Noura",
  internal_ref: "e.g. FAM-1998-03",
  country: "e.g. Saudi Arabia",
  city: "e.g. Riyadh",
  people: "e.g. Abdullah, Noura, family",
  singer: "e.g. Mohammed Abdu",
  musician: "e.g. Saudi National Orchestra",
  words: "e.g. Traditional",
  company: "e.g. Rotana",
  published_date: "e.g. 1972 or 1972-06-15",
  summary: "e.g. Family wedding ceremony and evening celebration in Riyadh."
};

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

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

function FormField({
  id,
  label,
  required = false,
  hint,
  children
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-3 block text-sm font-medium text-dashboard-text"
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {children}

      {hint && (
        <p
          id={`${id}-help`}
          className="mt-2 text-xs leading-5 text-dashboard-muted"
        >
          {hint}
        </p>
      )}
    </div>
  );
}

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
  disabled?: boolean;
  onChange: (value: string) => void;
}

function DateField({
  id,
  name,
  label,
  value,
  disabled,
  onChange
}: DateFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      hint="Example: 18 March 2027. Choose from the calendar or type using the format shown in the field."
    >
      <input
        id={id}
        name={name}
        type="date"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={INPUT_CLASS}
        aria-describedby={`${id}-help`}
      />
    </FormField>
  );
}

interface ScheduleFieldsProps {
  id: string;
  prefix: SchedulePrefix;
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
  const timeId = `${id}-${prefix}-time`;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <DateField
        id={`${id}-${prefix}-date`}
        name={`${prefix}_date`}
        label={`${label} date`}
        value={date}
        disabled={disabled}
        onChange={onDateChange}
      />

      <FormField
        id={timeId}
        label={`${label} time`}
        hint="Example: 09:30. Required when a date is selected."
      >
        <input
          id={timeId}
          name={`${prefix}_time`}
          type="time"
          step={60}
          disabled={disabled || !date}
          required={Boolean(date)}
          className={INPUT_CLASS}
          value={time}
          onChange={(event) => onTimeChange(event.target.value)}
          aria-describedby={`${timeId}-help`}
        />
      </FormField>
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

  function changeScheduleDate(prefix: SchedulePrefix, date: string) {
    setValues((previous) => ({
      ...previous,
      [`${prefix}_date`]: date,
      [`${prefix}_time`]: date ? previous[`${prefix}_time`] ?? "" : ""
    }));

    setValidation(null);
  }

  function text(key: string, label: string, required = false, hint?: string) {
    const fieldId = `${id}-${key}`;

    const placeholder =
      key === "tape_code"
        ? `e.g. ${boxId}-001-${MEDIA_SUFFIX[mediaType]}`
        : PLACEHOLDERS[key] ?? `Enter ${label.toLowerCase()}`;

    return (
      <FormField
        key={key}
        id={fieldId}
        label={label}
        required={required}
        hint={hint}
      >
        <input
          id={fieldId}
          name={key}
          required={required}
          placeholder={placeholder}
          className={INPUT_CLASS}
          value={values[key] ?? ""}
          onChange={(event) => change(key, event.target.value)}
          aria-describedby={hint ? `${fieldId}-help` : undefined}
        />
      </FormField>
    );
  }

  function select(
    key: string,
    label: string,
    options: readonly string[],
    required = true
  ) {
    const fieldId = `${id}-${key}`;

    return (
      <FormField key={key} id={fieldId} label={label} required={required}>
        <FormSelect
          id={fieldId}
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
      </FormField>
    );
  }

  function validateMaterial() {
    const materialId = (values.tape_code ?? "").trim();
    const prefix = `${boxId}-`;
    const suffix = `-${MEDIA_SUFFIX[mediaType]}`;

    const sequence =
      materialId.startsWith(prefix) && materialId.endsWith(suffix)
        ? materialId.slice(prefix.length, -suffix.length)
        : "";

    if (!/^\d{3,}$/.test(sequence) || !/[1-9]/.test(sequence)) {
      throw new Error(
        `Material ID must follow ${boxId}-001-${MEDIA_SUFFIX[mediaType]} ` +
          "with a positive sequence number."
      );
    }

    if (!FORMATS[mediaType].includes(format)) {
      throw new Error("Select a valid format.");
    }

    if (hasCapacity && !capacityOptions.includes(values.capacity ?? "")) {
      throw new Error("Select a valid capacity.");
    }

    if (isVideo && !COLOR_SYSTEMS.includes(values.color_system ?? "")) {
      throw new Error("Select a color system.");
    }

    if (isAudio && !AUDIO_TRACKS.includes(values.audio_track ?? "")) {
      throw new Error("Select an audio track.");
    }

    if (hasPaperSize && !SIZES.includes(values.photo_size ?? "")) {
      throw new Error("Select a size.");
    }

    if (
      isVinyl &&
      (!VINYL_SIZES.includes(values.tape_size ?? "") ||
        !VINYL_SPEEDS.includes(values.tape_speed ?? ""))
    ) {
      throw new Error("Select a valid vinyl size and speed.");
    }

    if (
      isReel &&
      (!REEL_SIZES.includes(values.tape_size ?? "") ||
        !REEL_SPEEDS.includes(values.tape_speed ?? ""))
    ) {
      throw new Error("Select a valid reel size and speed.");
    }

    return materialId;
  }

  function buildInput(): TapeInput {
    const materialId = validateMaterial();

    const plannedStart = scheduleTimestamp(
      values.start_date,
      values.start_time,
      "planned start"
    );

    const deadline = scheduleTimestamp(
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

    return input;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (locked || submitting.current) return;

    let input: TapeInput;

    try {
      input = buildInput();
    } catch (failure) {
      setValidation(
        failure instanceof Error
          ? failure.message
          : "Check the material information."
      );
      return;
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
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-xl font-semibold">
            Add tape / material
          </h2>

          <p className="mt-3 text-sm text-dashboard-muted">
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

      <fieldset disabled={locked} className="space-y-8">
        <legend className="sr-only">Material intake</legend>

        <FormField id={`${id}-media-type`} label="Media type" required>
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
        </FormField>

        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          {text(
            "tape_code",
            "Material ID",
            true,
            `Example: ${boxId}-001-${MEDIA_SUFFIX[mediaType]}. Must be unique across Individual and POV.`
          )}

          {isDocument ? (
            <FormField id={`${id}-document-format`} label="Format">
              <FormSelect
                id={`${id}-document-format`}
                value="Document"
                disabled
              >
                <option value="Document">Document</option>
              </FormSelect>
            </FormField>
          ) : (
            select("format", "Format", FORMATS[mediaType])
          )}

          {text("title", "Title")}
          {text("internal_ref", "Internal reference")}
          {text("country", "Country")}
        </div>

        <section>
          <h3 className="mb-5 text-base font-semibold">
            {MEDIA_LABELS[mediaType]} details
          </h3>

          <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
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
                {text(
                  "published_date",
                  "Published date",
                  false,
                  "A year alone is allowed, for example 1972. For a full date, use YYYY-MM-DD."
                )}
              </>
            )}
          </div>

          {isReel && (
            <p className="mt-4 text-xs text-dashboard-muted">
              Reel has no capacity field. Speed is measured in IPS.
            </p>
          )}

          {isVinyl && (
            <p className="mt-4 text-xs text-dashboard-muted">
              Vinyl speed is measured in RPM.
            </p>
          )}
        </section>

        <section className="space-y-6 rounded-lg border border-dashboard-border p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold">Schedule — optional</h3>

            <p className="mt-3 text-xs leading-5 text-dashboard-muted">
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

          <div className="border-t border-dashboard-border pt-6">
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
          <legend className="mb-4 text-sm font-semibold">
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

        <FormField id={`${id}-summary`} label="Summary">
          <textarea
            id={`${id}-summary`}
            name="summary"
            rows={4}
            placeholder={PLACEHOLDERS.summary}
            className={`${INPUT_CLASS} resize-y`}
            value={values.summary ?? ""}
            onChange={(event) => change("summary", event.target.value)}
          />
        </FormField>
      </fieldset>

      {(validation || error) && (
        <div role="alert" className="mt-5 space-y-1 text-sm text-dashboard-red">
          {validation && <p>{validation}</p>}
          {error && error !== validation && <p>{error}</p>}
        </div>
      )}

      <footer className="mt-8 flex justify-end gap-3 border-t border-dashboard-border pt-5">
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
