"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { individualService } from "@/services/individual.service";
import { individualError } from "@/hooks/individual/useIndividualJob";
import type { IndividualTapeDetails } from "@/types/production-api";

function label(value: string | null | undefined) {
  if (!value) return "Not recorded";
  if (value === "qc") return "QC";

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not recorded";
  }

  if (Array.isArray(value)) {
    return value.length ? value.map(display).join(", ") : "Not recorded";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function dateTime(value: unknown) {
  if (typeof value !== "string" || !value) return "Not recorded";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function Field({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-dashboard-muted">{title}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">
        {display(value)}
      </dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="dashboard-card space-y-5 p-5 sm:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <dl className="grid gap-5 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

const knownMetadataKeys = new Set([
  "title",
  "internal_ref",
  "country",
  "summary",
  "content_tags",
  "event_date",
  "city",
  "people",
  "singer",
  "musician",
  "words",
  "company",
  "published_date",
  "tape_size",
  "tape_speed"
]);

export default function IndividualTapeDetailsContainer({
  tapeId
}: {
  tapeId: string;
}) {
  const [tape, setTape] = useState<IndividualTapeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setTape(null);

    individualService
      .getTape(tapeId, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setTape(result);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setError(individualError(failure, "Could not load this material."));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [tapeId, reload]);

  if (loading) {
    return (
      <p role="status" className="py-10 text-dashboard-muted">
        Loading material…
      </p>
    );
  }

  if (error || !tape) {
    return (
      <section className="dashboard-card space-y-4 p-6">
        <p role="alert" className="text-sm text-rose-600">
          {error ?? "Material not found."}
        </p>

        <button
          type="button"
          className="dashboard-btn-secondary"
          onClick={() => setReload((previous) => previous + 1)}
        >
          Try again
        </button>

        <Link
          href="/dashboard/admin/individual"
          className="block text-sm underline"
        >
          Back to Individual
        </Link>
      </section>
    );
  }

  const metadata = tape.metadata ?? {};
  const isAudio = tape.media_type === "audio";
  const isVideo = tape.media_type === "video";
  const isPhoto = tape.media_type === "photo";
  const isDocument = tape.media_type === "document";

  const categories = Array.isArray(metadata.content_tags)
    ? metadata.content_tags.filter(
        (category): category is string => typeof category === "string"
      )
    : [];

  const history = Array.isArray(tape.history) ? tape.history : [];

  const additionalMetadata = Object.entries(metadata).filter(
    ([key]) => !knownMetadataKeys.has(key)
  );

  return (
    <section dir="ltr" className="space-y-6 text-dashboard-text">
      <header className="space-y-3">
        <Link
          href="/dashboard/admin/individual"
          className="text-sm text-dashboard-muted hover:underline"
        >
          ← Individual jobs
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold">
              {tape.tape_code ?? tape.id}
            </h1>
            <p className="mt-1 text-sm text-dashboard-muted">
              {display(metadata.title)}
            </p>
          </div>

          <span className="rounded-full bg-dashboard-hover px-3 py-1 text-sm">
            {label(tape.status)}
          </span>
        </div>
      </header>

      <Section title="Identification">
        <Field title="Material ID" value={tape.tape_code} />
        <Field title="Internal ID" value={tape.id} />
        <Field title="Barcode value" value={tape.barcode} />
        <Field title="Box ID" value={tape.box_id} />
        <Field title="Media type" value={label(tape.media_type)} />
        <Field title="Created" value={dateTime(tape.created_at)} />
      </Section>

      <Section title="Shared information">
        <Field title="Title" value={metadata.title} />
        <Field title="Internal reference" value={metadata.internal_ref} />
        <Field title="Country" value={metadata.country} />

        <div>
          <dt className="text-sm text-dashboard-muted">Content categories</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {categories.length ? (
              categories.map((category, index) => (
                <span
                  key={`${category}-${index}`}
                  className="rounded-full bg-dashboard-hover px-3 py-1 text-xs"
                >
                  {category}
                </span>
              ))
            ) : (
              <span className="text-sm">Not recorded</span>
            )}
          </dd>
        </div>

        <div className="sm:col-span-2">
          <Field title="Summary" value={metadata.summary} />
        </div>
      </Section>

      <Section title={`${label(tape.media_type)} information`}>
        <Field title="Format" value={tape.format} />

        {(isVideo || isAudio) && (
          <>
            <Field title="Capacity (minutes)" value={tape.capacity} />
            <Field title="Audio track" value={tape.audio_track} />
          </>
        )}

        {isVideo && <Field title="Color system" value={tape.color_system} />}

        {(isPhoto || isDocument) && (
          <Field title="Size" value={tape.photo_size} />
        )}

        {(isVideo || isPhoto) && (
          <>
            <Field title="Date" value={metadata.event_date} />
            <Field title="City" value={metadata.city} />
            <Field title="People" value={metadata.people} />
          </>
        )}

        {isAudio && (
          <>
            <Field title="Size" value={metadata.tape_size} />
            <Field
              title={tape.format === "Vinyl" ? "Speed (RPM)" : "Speed (IPS)"}
              value={metadata.tape_speed}
            />
            <Field title="Singer" value={metadata.singer} />
            <Field title="Musician" value={metadata.musician} />
            <Field title="Words / lyricist" value={metadata.words} />
            <Field title="Company" value={metadata.company} />
            <Field title="Published date" value={metadata.published_date} />
          </>
        )}
      </Section>

      <Section title="Production">
        <Field title="Current stage" value={label(tape.current_station)} />
        <Field title="Status" value={label(tape.status)} />
      </Section>

      {additionalMetadata.length > 0 && (
        <Section title="Additional saved information">
          {additionalMetadata.map(([key, value]) => (
            <Field key={key} title={label(key)} value={value} />
          ))}
        </Section>
      )}

      <Section title="Picture">
        <Field title="Stored reference" value={tape.picture_key} />
      </Section>

      <section className="dashboard-card space-y-5 p-5 sm:p-6">
        <h2 className="font-semibold">Production history</h2>

        {history.length === 0 ? (
          <p className="text-sm text-dashboard-muted">No history recorded.</p>
        ) : (
          <ol className="space-y-4">
            {history.map((entry, index) => (
              <li
                key={index}
                className="rounded-lg border border-dashboard-border p-4"
              >
                <dl className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(entry).map(([key, value]) => (
                    <Field
                      key={key}
                      title={label(key)}
                      value={key === "at" ? dateTime(value) : value}
                    />
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  );
}
