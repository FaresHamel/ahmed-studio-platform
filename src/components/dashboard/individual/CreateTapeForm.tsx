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
import type { TapeInput, TapeMediaType } from "@/types/production-api";

interface Props {
  open: boolean;
  boxId: string;
  busy: boolean;
  error: string | null;
  onSubmit: (input: TapeInput) => Promise<void>;
  onCancel: () => void;
}

const inputClass = "dashboard-input min-h-12 px-4 py-3";

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

  function text(key: string, label: string, required = false) {
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

    const dueDate = values.due_date?.trim();
    const dueTime = values.due_time?.trim();

    let deadline: string | undefined;

    if (dueDate || dueTime) {
      if (!dueDate || !dueTime) {
        setValidation("Select both the due date and due time.");
        return;
      }

      const date = new Date(`${dueDate}T${dueTime}`);

      if (Number.isNaN(date.getTime())) {
        setValidation("Enter a valid tape deadline.");
        return;
      }

      deadline = date.toISOString();
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
    } catch {
      setValidation(
        "Could not create the tape. Check the API error and retry."
      );
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
                {text("event_date", "Date")}
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
                {text("published_date", "Published date")}
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

        <section className="space-y-4 rounded-lg border border-dashboard-border p-4">
          <div>
            <h3 className="text-sm font-semibold">Schedule</h3>

            <p className="mt-1 text-xs text-dashboard-muted">
              Optional deadline for completing this tape.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label
              htmlFor={`${id}-due-date`}
              className="block space-y-2 text-sm"
            >
              <span>Due date</span>

              <input
                id={`${id}-due-date`}
                name="due_date"
                type="date"
                className={inputClass}
                value={values.due_date ?? ""}
                aria-describedby={`${id}-schedule-help`}
                onChange={(event) => {
                  const date = event.target.value;

                  setValues((previous) => ({
                    ...previous,
                    due_date: date,
                    due_time: date ? previous.due_time ?? "" : ""
                  }));

                  setValidation(null);
                }}
              />
            </label>

            <label
              htmlFor={`${id}-due-time`}
              className="block space-y-2 text-sm"
            >
              <span>Due time</span>

              <input
                id={`${id}-due-time`}
                name="due_time"
                type="time"
                step={60}
                disabled={locked || !values.due_date}
                required={Boolean(values.due_date)}
                className={inputClass}
                value={values.due_time ?? ""}
                onChange={(event) => change("due_time", event.target.value)}
                aria-describedby={`${id}-schedule-help`}
              />
            </label>
          </div>

          <p
            id={`${id}-schedule-help`}
            className="text-xs text-dashboard-muted"
          >
            Leave the date empty for no deadline. If you select a date, select a
            time too. Times use your device’s local timezone.
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
            className={`${inputClass} resize-y`}
            value={values.summary ?? ""}
            onChange={(event) => change("summary", event.target.value)}
          />
        </label>
      </fieldset>

      {(validation || error) && (
        <div role="alert" className="mt-5 space-y-1 text-sm text-dashboard-red">
          {validation && <p>{validation}</p>}
          {error && <p>{error}</p>}
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
