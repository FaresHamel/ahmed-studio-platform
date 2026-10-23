"use client";

import { useId, useState, type FormEvent } from "react";
import type { TapeInput } from "@/types/production-api";

interface Props {
  busy: boolean;
  error: string | null;
  onSubmit: (input: TapeInput) => Promise<void>;
  onCancel: () => void;
}

const inputClass = "dashboard-input min-h-12 px-3 py-3";

export function CreateTapeForm({ busy, error, onSubmit, onCancel }: Props) {
  const id = useId();

  const [mediaType, setMediaType] = useState<"audio" | "video">("video");
  const [format, setFormat] = useState("");
  const [capacity, setCapacity] = useState("");
  const [colorSystem, setColorSystem] = useState("");
  const [audioTrack, setAudioTrack] = useState("");
  const [photoSize, setPhotoSize] = useState("");
  const [country, setCountry] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [validation, setValidation] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const cleanFormat = format.trim();
    const cleanColorSystem = colorSystem.trim();
    const capacityValue = Number(capacity);
    const trackValue = Number(audioTrack);

    if (!cleanFormat || !cleanColorSystem) {
      setValidation("Format and color system are required.");
      return;
    }

    if (!Number.isSafeInteger(capacityValue) || capacityValue < 1) {
      setValidation("Capacity must be a positive whole number.");
      return;
    }

    if (audioTrack.trim() && !Number.isSafeInteger(trackValue)) {
      setValidation("Audio track must be a whole number.");
      return;
    }

    setValidation(null);

    const contentTags = Array.from(
      new Set(
        tags
          .split("\n")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );

    await onSubmit({
      media_type: mediaType,
      format: cleanFormat,
      capacity: capacityValue,
      color_system: cleanColorSystem,
      ...(audioTrack.trim() ? { audio_track: trackValue } : {}),
      ...(photoSize.trim() ? { photo_size: photoSize.trim() } : {}),
      ...(country.trim() ? { country: country.trim() } : {}),
      ...(summary.trim() ? { summary: summary.trim() } : {}),
      ...(contentTags.length ? { content_tags: contentTags } : {})
    });
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      aria-busy={busy}
      className="space-y-6"
    >
      <header>
        <h2 className="text-lg font-semibold">Add tape</h2>
        <p className="mt-2 text-sm text-dashboard-muted">
          The tape ID and barcode are generated automatically. New tapes start
          at Received.
        </p>
      </header>

      <fieldset disabled={busy} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span>Media type *</span>
            <select
              className={inputClass}
              value={mediaType}
              onChange={(event) =>
                setMediaType(event.target.value === "audio" ? "audio" : "video")
              }
            >
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span>Format *</span>
            <input
              required
              className={inputClass}
              value={format}
              onChange={(event) => setFormat(event.target.value)}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Capacity *</span>
            <input
              required
              type="number"
              min={1}
              step={1}
              className={inputClass}
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Color system *</span>
            <input
              required
              className={inputClass}
              value={colorSystem}
              onChange={(event) => setColorSystem(event.target.value)}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Audio track (optional)</span>
            <input
              type="number"
              step={1}
              className={inputClass}
              value={audioTrack}
              onChange={(event) => setAudioTrack(event.target.value)}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Photo size (optional)</span>
            <input
              className={inputClass}
              value={photoSize}
              onChange={(event) => setPhotoSize(event.target.value)}
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm">
          <span>Country (optional)</span>
          <input
            className={inputClass}
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Summary (optional)</span>
          <textarea
            rows={3}
            className={`${inputClass} resize-y`}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </label>

        <div>
          <label htmlFor={`${id}-tags`} className="mb-2 block text-sm">
            Content tags (optional)
          </label>
          <textarea
            id={`${id}-tags`}
            rows={3}
            aria-describedby={`${id}-tags-help`}
            className={`${inputClass} resize-y`}
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
          <p
            id={`${id}-tags-help`}
            className="mt-2 text-xs text-dashboard-muted"
          >
            Enter one tag per line.
          </p>
        </div>
      </fieldset>

      {(validation || error) && (
        <p role="alert" className="text-sm text-rose-600">
          {validation || error}
        </p>
      )}

      <footer className="flex justify-end gap-2 border-t border-dashboard-border pt-5">
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="dashboard-btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" disabled={busy} className="dashboard-btn-primary">
          {busy ? "Adding…" : "Add tape"}
        </button>
      </footer>
    </form>
  );
}
