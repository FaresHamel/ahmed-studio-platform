"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { PackagePlus, X } from "lucide-react";
import toast from "react-hot-toast";

import { povError } from "@/lib/pov/display";
import { povService } from "@/services/pov.service";
import { useAuthStore } from "@/store/auth.store";

import type { RecordInput, TapeMediaType } from "@/types/production-api";

interface CreatePovRecordModalProps {
  projectId: string;
  finished: boolean;
  onClose: () => void;
  onCreated: () => Promise<boolean>;
}

const INPUT_CLASS = "dashboard-input min-h-10 w-full px-3 py-2 text-[13px]";

const LABEL_CLASS = "mb-2 block text-[13px] font-medium";

const MEDIA_TYPES: Array<{
  value: TapeMediaType;
  label: string;
}> = [
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "photo", label: "Photo" },
  { value: "document", label: "Document" }
];

const TECHNICAL_FIELDS = [
  {
    name: "color_system",
    label: "Color system",
    placeholder: "PAL, NTSC, SECAM"
  },
  {
    name: "frame_rate",
    label: "Frame rate",
    placeholder: "25 fps"
  },
  {
    name: "resolution",
    label: "Resolution",
    placeholder: "1920 × 1080"
  },
  {
    name: "aspect_ratio",
    label: "Aspect ratio",
    placeholder: "16:9"
  }
] as const;

const OUTPUT_OPTIONS = [
  { name: "trim", label: "Trim" },
  { name: "restoration", label: "Restoration" },
  { name: "master_file", label: "Master file" },
  { name: "access_copy", label: "Access copy" }
] as const;

function optionalText(form: FormData, field: string): string | undefined {
  const value = form.get(field);

  if (typeof value !== "string") return undefined;

  return value.trim() || undefined;
}

function optionalNumber(
  form: FormData,
  field: string,
  label: string,
  integer = false
): number | undefined {
  const raw = optionalText(form, field);

  if (raw === undefined) return undefined;

  const value = Number(raw);

  if (
    !Number.isFinite(value) ||
    value < 0 ||
    (integer && (!Number.isInteger(value) || value > 2_147_483_647))
  ) {
    throw new Error(
      integer
        ? `${label} must be a supported whole number of zero or more.`
        : `${label} must be a number of zero or more.`
    );
  }

  return value;
}

export default function CreatePovRecordModal({
  projectId,
  finished,
  onClose,
  onCreated
}: CreatePovRecordModalProps) {
  const id = useId();

  const [mediaType, setMediaType] = useState<TapeMediaType>("video");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const mounted = useRef(false);
  const saveLock = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      mounted.current = false;
      dialog?.close();
    };
  }, []);

  function close() {
    if (saveLock.current) return;
    onClose();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const actor = useAuthStore.getState().user;

    if (saveLock.current || finished || !actor?.roles.includes("admin")) {
      return;
    }

    setError(null);

    const form = new FormData(event.currentTarget);

    let input: RecordInput;

    try {
      const code = optionalText(form, "tape_code");
      const format = optionalText(form, "format");

      if (!code || !/^\S+(?: \S+)*$/.test(code)) {
        throw new Error("Enter a Material ID without repeated spaces.");
      }

      if (!format) {
        throw new Error("Enter the material format.");
      }

      input = {
        tape_code: code,
        media_type: mediaType,
        format,
        label: optionalText(form, "label"),
        internal_ref: optionalText(form, "internal_ref"),

        capacity: optionalNumber(form, "capacity", "Capacity", true),

        duration: optionalNumber(form, "duration", "Duration", true),

        file_size: optionalNumber(form, "file_size", "File size"),

        color_system: optionalText(form, "color_system"),
        frame_rate: optionalText(form, "frame_rate"),
        resolution: optionalText(form, "resolution"),
        aspect_ratio: optionalText(form, "aspect_ratio"),

        trim: form.get("trim") === "on",
        restoration: form.get("restoration") === "on",
        master_file: form.get("master_file") === "on",
        access_copy: form.get("access_copy") === "on",

        note: optionalText(form, "note"),
        photo_url: optionalText(form, "photo_url")
      };
    } catch (failure) {
      setError(povError(failure, "Check the Material information."));
      return;
    }

    const actorId = actor.id;

    function isCurrentAccount() {
      const current = useAuthStore.getState().user;

      return (
        mounted.current &&
        current?.id === actorId &&
        Boolean(current?.roles.includes("admin"))
      );
    }

    saveLock.current = true;
    setSaving(true);

    try {
      try {
        await povService.addRecord(projectId, input);
      } catch (failure) {
        if (isCurrentAccount()) {
          setError(povError(failure, "Could not add the Material."));
        }
        return;
      }

      if (!isCurrentAccount()) return;

      toast.success("Material added.");

      let refreshed = false;

      try {
        refreshed = await onCreated();
      } catch {
        // Record creation already succeeded.
      }

      if (!isCurrentAccount()) return;

      if (!refreshed) {
        toast.error("Material added, but some information could not refresh.");
      }

      onClose();
    } finally {
      saveLock.current = false;

      if (mounted.current) {
        setSaving(false);
      }
    }
  }

  const disabled = saving || finished;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl
        overflow-y-auto rounded-xl border border-dashboard-border
        bg-dashboard-surface p-0 text-dashboard-text shadow-xl
        backdrop:bg-black/45
      "
    >
      <header className="flex items-start justify-between gap-4 border-b border-dashboard-border px-5 py-4">
        <div>
          <h2
            id={`${id}-title`}
            className="flex items-center gap-2 text-[15px] font-semibold"
          >
            <PackagePlus
              size={16}
              aria-hidden="true"
              className="text-dashboard-blue"
            />
            Add Material
          </h2>

          <p
            id={`${id}-description`}
            className="mt-2 text-xs leading-5 text-dashboard-muted"
          >
            Add a tape, photo or document to this POV project. New materials
            start with the On shelf status.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={close}
          aria-label="Close add Material modal"
          className="rounded-lg p-2 text-dashboard-muted hover:bg-dashboard-hover disabled:opacity-40"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </header>

      <form onSubmit={(event) => void submit(event)}>
        <fieldset disabled={disabled} className="min-w-0 space-y-6 p-5">
          <section>
            <h3 className="mb-4 text-[13px] font-semibold">
              Material identification
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${id}-code`} className={LABEL_CLASS}>
                  Material ID
                </label>

                <input
                  id={`${id}-code`}
                  name="tape_code"
                  required
                  className={INPUT_CLASS}
                  placeholder="123450-002021-V"
                />
              </div>

              <div>
                <label htmlFor={`${id}-media`} className={LABEL_CLASS}>
                  Media type
                </label>

                <select
                  id={`${id}-media`}
                  value={mediaType}
                  onChange={(event) =>
                    setMediaType(event.target.value as TapeMediaType)
                  }
                  className={`${INPUT_CLASS} pr-8`}
                >
                  {MEDIA_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${id}-format`} className={LABEL_CLASS}>
                  Format
                </label>

                <input
                  id={`${id}-format`}
                  name="format"
                  required
                  className={INPUT_CLASS}
                  placeholder="Enter the format for this media type"
                />
              </div>

              <div>
                <label htmlFor={`${id}-label`} className={LABEL_CLASS}>
                  Label / title
                </label>

                <input
                  id={`${id}-label`}
                  name="label"
                  className={INPUT_CLASS}
                  placeholder="Riyadh event archive"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${id}-reference`} className={LABEL_CLASS}>
                  Internal reference
                </label>

                <input
                  id={`${id}-reference`}
                  name="internal_ref"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-dashboard-border pt-5">
            <h3 className="mb-4 text-[13px] font-semibold">
              Material information
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor={`${id}-capacity`} className={LABEL_CLASS}>
                  Capacity
                </label>

                <input
                  id={`${id}-capacity`}
                  name="capacity"
                  type="number"
                  min={0}
                  max={2_147_483_647}
                  step={1}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor={`${id}-duration`} className={LABEL_CLASS}>
                  Duration · minutes
                </label>

                <input
                  id={`${id}-duration`}
                  name="duration"
                  type="number"
                  min={0}
                  max={2_147_483_647}
                  step={1}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor={`${id}-size`} className={LABEL_CLASS}>
                  File size · GB
                </label>

                <input
                  id={`${id}-size`}
                  name="file_size"
                  type="number"
                  min={0}
                  step="any"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </section>

          <details className="border-t border-dashboard-border pt-5">
            <summary className="cursor-pointer text-[13px] font-medium text-dashboard-blue">
              Technical information and outputs
            </summary>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {TECHNICAL_FIELDS.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={`${id}-${field.name}`}
                    className={LABEL_CLASS}
                  >
                    {field.label}
                  </label>

                  <input
                    id={`${id}-${field.name}`}
                    name={field.name}
                    placeholder={field.placeholder}
                    className={INPUT_CLASS}
                  />
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs leading-5 text-dashboard-muted">
              Leave frame rate and resolution blank to use the backend defaults
              for a recognized color system.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {OUTPUT_OPTIONS.map((option) => (
                <label
                  key={option.name}
                  className="flex items-center gap-2 text-[13px]"
                >
                  <input
                    name={option.name}
                    type="checkbox"
                    className="size-4 accent-blue-600"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </details>

          <section className="space-y-4 border-t border-dashboard-border pt-5">
            <div>
              <label htmlFor={`${id}-photo`} className={LABEL_CLASS}>
                Reference image URL
              </label>

              <input
                id={`${id}-photo`}
                name="photo_url"
                type="url"
                className={INPUT_CLASS}
                placeholder="https://…"
              />
            </div>

            <div>
              <label htmlFor={`${id}-note`} className={LABEL_CLASS}>
                Notes
              </label>

              <textarea
                id={`${id}-note`}
                name="note"
                rows={3}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="Condition, identifying information or instructions"
              />
            </div>
          </section>
        </fieldset>

        {finished && (
          <p className="px-5 pb-4 text-[13px] text-dashboard-muted">
            This project is finished. Reopen it to add materials
          </p>
        )}

        {error && (
          <p role="alert" className="px-5 pb-4 text-[13px] text-dashboard-red">
            {error}
          </p>
        )}

        <footer className="flex justify-end gap-3 border-t border-dashboard-border px-5 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={close}
            className="dashboard-btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={disabled}
            className="dashboard-btn-primary"
          >
            {saving ? "Adding…" : "Add Material"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
