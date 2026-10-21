"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowLeft, Building2, Eye, UserRound } from "lucide-react";
import type { Customer, CustomerInput } from "@/types/production-api";

interface CustomerFormProps {
  customer?: Customer;
  busy: boolean;
  error: string | null;
  onSubmit: (input: CustomerInput) => Promise<void>;
  onCancel: () => void;
}

interface PreviewFieldProps {
  label: string;
  value?: string;
}

function PreviewField({ label, value }: PreviewFieldProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-dashboard-muted">{label}</dt>
      <dd className="mt-1.5 whitespace-pre-wrap break-words text-sm text-dashboard-text">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

export function CustomerForm({
  customer,
  busy,
  error,
  onSubmit,
  onCancel
}: CustomerFormProps) {
  const id = useId();

  const [name, setName] = useState(customer?.name ?? "");
  const [type, setType] = useState<"individual" | "company">(
    customer?.client_type ?? "individual"
  );
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [notes, setNotes] = useState(customer?.notes ?? "");

  const [preview, setPreview] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);

  const isCompany = type === "company";
  const Icon = isCompany ? Building2 : UserRound;

  function buildInput(): CustomerInput | null {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setValidation(
        isCompany ? "Company name is required." : "Full name is required."
      );
      return null;
    }

    if (cleanPhone && !/^[0-9+\s-]{8,15}$/.test(cleanPhone)) {
      setValidation("Enter a valid phone number.");
      return null;
    }

    if (
      customer &&
      ((customer.phone && !cleanPhone) || (customer.email && !cleanEmail))
    ) {
      setValidation(
        "Removing an existing phone or email is not supported yet."
      );
      return null;
    }

    setValidation(null);

    return {
      name: cleanName,
      client_type: type,
      ...(cleanEmail ? { email: cleanEmail } : {}),
      ...(cleanPhone ? { phone: cleanPhone } : {}),
      notes: notes.trim()
    };
  }

  function showPreview(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;

    if (!form?.reportValidity()) return;
    if (!buildInput()) return;

    setPreview(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const input = buildInput();
    if (input) await onSubmit(input);
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="space-y-7"
      aria-busy={busy}
    >
      <header>
        <h2 className="text-lg font-semibold text-dashboard-text">
          {preview
            ? "Customer preview"
            : customer
            ? "Edit customer"
            : "Create new customer"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-dashboard-muted">
          {preview
            ? "Review the information below. Nothing is saved until you submit."
            : "Enter the person or company details. Login accounts are linked separately."}
        </p>
      </header>

      {/* Keep fields mounted so browser validation works in preview. */}
      <fieldset
        disabled={busy}
        hidden={preview}
        className="space-y-7 disabled:opacity-60"
      >
        <section aria-labelledby={`${id}-identity`}>
          <h3
            id={`${id}-identity`}
            className="mb-4 text-sm font-semibold text-dashboard-text"
          >
            Customer information
          </h3>

          <div className="space-y-5">
            <div>
              <label
                htmlFor={`${id}-type`}
                className="mb-2 block text-sm font-medium"
              >
                Customer type
              </label>

              <select
                id={`${id}-type`}
                className="dashboard-input min-h-12 px-3"
                value={type}
                onChange={(event) => {
                  setType(
                    event.target.value === "company" ? "company" : "individual"
                  );
                  setValidation(null);
                }}
              >
                <option
                  value="individual"
                  className="dashboard-input min-h-12 px-3"
                >
                  Individual person
                </option>
                <option
                  value="company"
                  className="dashboard-input min-h-12 px-3"
                >
                  Company
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`${id}-name`}
                className="mb-2 block text-sm font-medium"
              >
                {isCompany ? "Company name" : "Full name"}
                <span className="ms-1 text-dashboard-muted">*</span>
              </label>

              <input
                id={`${id}-name`}
                required
                autoComplete={isCompany ? "organization" : "name"}
                className="dashboard-input min-h-12 px-3"
                placeholder={
                  isCompany ? "e.g. ABC Archive Company" : "Enter full name"
                }
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setValidation(null);
                }}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby={`${id}-contact`}>
          <h3
            id={`${id}-contact`}
            className="mb-4 text-sm font-semibold text-dashboard-text"
          >
            Contact information
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${id}-email`}
                className="mb-2 block text-sm font-medium"
              >
                Email
                <span className="ms-1 font-normal text-dashboard-muted">
                  (optional)
                </span>
              </label>

              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                className="dashboard-input min-h-12 px-3"
                placeholder="contact@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor={`${id}-phone`}
                className="mb-2 block text-sm font-medium"
              >
                Phone
                <span className="ms-1 font-normal text-dashboard-muted">
                  (optional)
                </span>
              </label>

              <input
                id={`${id}-phone`}
                type="tel"
                autoComplete="tel"
                className="dashboard-input min-h-12 px-3"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-dashboard-muted">
            This contact email does not create a login or grant access.
          </p>
        </section>

        <section aria-labelledby={`${id}-notes-title`}>
          <h3
            id={`${id}-notes-title`}
            className="mb-4 text-sm font-semibold text-dashboard-text"
          >
            Additional information
          </h3>

          <label
            htmlFor={`${id}-notes`}
            className="mb-2 block text-sm font-medium"
          >
            Notes
            <span className="ms-1 font-normal text-dashboard-muted">
              (optional)
            </span>
          </label>

          <textarea
            id={`${id}-notes`}
            rows={4}
            className="dashboard-input resize-y px-3 py-3"
            placeholder="Add useful customer information..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </section>
      </fieldset>

      {preview && (
        <section
          aria-label="Customer preview"
          className="rounded-xl border border-dashboard-border p-5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500"
            >
              <Icon size={22} />
            </span>

            <div className="min-w-0">
              <h3 className="break-words font-semibold">{name.trim()}</h3>
              <p className="mt-1 text-sm text-dashboard-muted">
                {isCompany ? "Company" : "Individual person"}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <PreviewField label="Email" value={email.trim()} />
            <PreviewField label="Phone" value={phone.trim()} />

            <div className="sm:col-span-2">
              <PreviewField label="Notes" value={notes.trim()} />
            </div>
          </dl>

          <p className="mt-6 border-t border-dashboard-border pt-4 text-xs leading-5 text-dashboard-muted">
            {customer
              ? "Saving updates this customer record. Account memberships remain unchanged."
              : "This creates a customer record only. No login account, Individual job, or POV project will be created."}
          </p>
        </section>
      )}

      {(validation || error) && (
        <p role="alert" className="text-sm text-rose-600">
          {validation || error}
        </p>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border pt-5">
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="dashboard-btn-secondary"
        >
          Cancel
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {preview ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => setPreview(false)}
              className="dashboard-btn-secondary"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to edit
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={showPreview}
              className="dashboard-btn-secondary"
            >
              <Eye size={16} aria-hidden="true" />
              Preview
            </button>
          )}

          <button
            type="submit"
            disabled={busy}
            className="dashboard-btn-primary"
          >
            {busy ? "Saving…" : customer ? "Save changes" : "Create customer"}
          </button>
        </div>
      </footer>
    </form>
  );
}
