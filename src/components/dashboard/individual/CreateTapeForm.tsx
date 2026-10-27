"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { TapeInput, TapeMediaType } from "@/types/production-api";

interface Props {
  open: boolean;
  boxId: string;
  busy: boolean;
  error: string | null;
  onSubmit: (input: TapeInput) => Promise<void>;
  onCancel: () => void;
}

const inputClass = "dashboard-input w-full min-h-12 px-3 py-3";

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

// ISO country / territory codes.
// Names are displayed in English; flag emoji support depends on the device.
const COUNTRY_CODES = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ EC EE EG EH ER ES ET
FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT
JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA
RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW
`
  .trim()
  .split(/\s+/);

const countryNames = new Intl.DisplayNames(["en"], {
  type: "region"
});

function countryFlag(code: string) {
  return String.fromCodePoint(
    ...Array.from(code).map((character) => 127397 + character.charCodeAt(0))
  );
}

const COUNTRIES = COUNTRY_CODES.map((code) => ({
  code,
  name: countryNames.of(code) ?? code,
  flag: countryFlag(code)
})).sort((a, b) => a.name.localeCompare(b.name, "en"));

type Values = Record<string, string>;

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

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        // Escape closes the modal unless a request is running.
        if (!busy && dialogRef.current?.dataset.saving !== "true") {
          onCancel();
        }
      }}
      className="
        m-auto w-[calc(100%-2rem)] max-w-4xl
        max-h-[90dvh] overflow-y-auto rounded-2xl
        border border-dashboard-border bg-white p-0
        text-slate-900 shadow-2xl
        backdrop:bg-black/50
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
  const [countrySearch, setCountrySearch] = useState("");
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

  const visibleCountries = COUNTRIES.filter((country) =>
    `${country.name} ${country.code}`
      .toLowerCase()
      .includes(countrySearch.trim().toLowerCase())
  );

  // Keep the selected country visible while searching.
  const countryOptions = COUNTRIES.filter(
    (country) =>
      country.name === values.country ||
      visibleCountries.some((item) => item.code === country.code)
  );

  function change(key: string, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
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
        <select
          id={`${id}-${key}`}
          name={key}
          required={required}
          className={inputClass}
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
            } else {
              change(key, next);
            }
          }}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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

    if (isAudio && !["2", "4", "8"].includes(values.audio_track ?? "")) {
      setValidation("Select an audio track.");
      return;
    }

    if (hasPaperSize && !SIZES.includes(values.photo_size ?? "")) {
      setValidation("Select a size.");
      return;
    }

    if ((isVinyl || isReel) && (!values.tape_size || !values.tape_speed)) {
      setValidation("Select the size and speed.");
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
      content_tags: categories
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

        <label className="block space-y-2 text-sm">
          <span>Media type *</span>
          <select
            className={inputClass}
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
          </select>
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
            <label className="block space-y-2 text-sm">
              <span>Format</span>
              <select className={inputClass} value="Document" disabled>
                <option value="Document">Document</option>
              </select>
            </label>
          ) : (
            select("format", "Format", FORMATS[mediaType])
          )}

          {text("title", "Title")}
          {text("internal_ref", "Internal reference")}
        </div>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Country</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span>Find a country</span>
              <input
                type="search"
                className={inputClass}
                value={countrySearch}
                placeholder="Search name or country code"
                onChange={(event) => setCountrySearch(event.target.value)}
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span>Country</span>
              <select
                className={inputClass}
                value={values.country ?? ""}
                onChange={(event) => change("country", event.target.value)}
              >
                <option value="">Select country</option>
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-base font-semibold">
            {MEDIA_LABELS[mediaType]} details
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {hasCapacity &&
              select("capacity", "Capacity (min)", capacityOptions)}

            {isVideo && select("color_system", "Color system", COLOR_SYSTEMS)}

            {isAudio && select("audio_track", "Audio track", ["2", "4", "8"])}

            {isVinyl && (
              <>
                {select("tape_size", "Vinyl size", ['7"', '10"', '12"'])}
                {select("tape_speed", "Vinyl speed", ["33 1/3", "45", "78"])}
              </>
            )}

            {isReel && (
              <>
                {select("tape_size", "Reel size", ['3"', '7"', '10.5"'])}
                {select("tape_speed", "Reel speed (IPS)", [
                  "1 7/8",
                  "3 3/4",
                  "7 1/2",
                  "15",
                  "30"
                ])}
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
                  className="h-4 w-4"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block space-y-2 text-sm">
          <span>Summary</span>
          <textarea
            rows={4}
            className={`${inputClass} resize-y`}
            value={values.summary ?? ""}
            onChange={(event) => change("summary", event.target.value)}
          />
        </label>
      </fieldset>

      {(validation || error) && (
        <div role="alert" className="mt-5 space-y-1 text-sm text-rose-600">
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
