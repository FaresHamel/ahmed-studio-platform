"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

interface JobIntakeModalProps {
  closed: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function JobIntakeModal({
  closed,
  busy,
  error,
  onClose,
  onConfirm
}: JobIntakeModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [reason, setReason] = useState("");

  const title = closed ? "Allow more boxes" : "Finish adding boxes";

  useEffect(() => {
    const element = dialog.current;

    if (element && !element.open) {
      element.showModal();
    }

    return () => {
      if (element?.open) element.close();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg
        overflow-y-auto rounded-xl border border-dashboard-border
        bg-dashboard-surface p-6 text-dashboard-text
        shadow-xl backdrop:bg-black/50
      "
    >
      <form
        aria-busy={busy}
        onSubmit={(event) => {
          event.preventDefault();
          if (busy || (closed && !reason.trim())) return;
          void onConfirm(reason.trim());
        }}
        className="space-y-5"
      >
        <header className="flex items-start justify-between gap-4">
          <h2 id={`${id}-title`} className="text-base font-semibold">
            {title}
          </h2>

          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            aria-label="Close confirmation"
            className="
              rounded-md p-1 text-dashboard-muted
              hover:bg-dashboard-hover hover:text-dashboard-text
              focus-visible:outline-2
              focus-visible:outline-dashboard-focus
            "
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <p
          id={`${id}-description`}
          className="text-[13px] leading-6 text-dashboard-muted"
        >
          {closed
            ? "Allow additional boxes under this INV. Existing boxes keep their current status."
            : "Prevent additional boxes under this INV. Existing boxes and their materials can continue through their normal workflow. This does not close or ship any box."}
        </p>

        {closed && (
          <label className="block">
            <span className="mb-3 block text-[13px] font-medium">
              Reason for allowing more boxes
            </span>

            <textarea
              required
              autoFocus
              disabled={busy}
              maxLength={1000}
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="For example: The customer delivered another box."
              className="
                dashboard-input w-full resize-y
                px-3 py-2 text-[13px]
              "
            />

            <span className="mt-2 block text-xs text-dashboard-muted">
              Your name, the date, and this reason will be recorded.
            </span>
          </label>
        )}

        {error && (
          <p role="alert" className="text-[13px] text-dashboard-red">
            {error}
          </p>
        )}

        <footer className="flex justify-end gap-3">
          <button
            type="button"
            autoFocus={!closed}
            disabled={busy}
            onClick={onClose}
            className="dashboard-btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy || (closed && !reason.trim())}
            className="dashboard-btn-primary"
          >
            {busy ? "Saving…" : title}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
