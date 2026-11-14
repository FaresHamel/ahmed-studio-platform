"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type BoxAction = "close" | "reopen" | "delete" | "ship";

interface Props {
  action: BoxAction;
  boxId: string;
  materialCount: number;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

const ACTION_CONTENT: Record<
  BoxAction,
  { title: string; description: string; confirm: string }
> = {
  close: {
    title: "Close box",
    description:
      "Close and lock this box. Materials, assignments, stages, timers, dates, and comments become read-only until the box is reopened. This does not ship the box.",
    confirm: "Close box"
  },
  reopen: {
    title: "Reopen box",
    description:
      "Reopen intake to add or remove eligible materials. Existing production work and assignments stay unchanged.",
    confirm: "Reopen box"
  },
  delete: {
    title: "Delete empty box",
    description:
      "Permanently delete this empty box from its Individual job. This action cannot be undone.",
    confirm: "Delete box"
  },
  ship: {
    title: "Ship box",
    description:
      "Mark this box and every material inside it as Shipped. Production and intake changes will be locked. Other boxes in this Individual job are not shipped by this action.",
    confirm: "Ship box"
  }
};

export default function BoxActionModal({
  action,
  boxId,
  materialCount,
  busy,
  error,
  onClose,
  onConfirm
}: Props) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [reason, setReason] = useState("");

  const content = ACTION_CONTENT[action];
  const requiresReason = action === "reopen";

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  function close() {
    if (!busy) {
      onClose();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy || (requiresReason && !reason.trim())) return;

    await onConfirm(reason.trim());
  }

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
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg
        overflow-y-auto rounded-xl border border-dashboard-border
        bg-dashboard-surface p-6 text-dashboard-text
        shadow-xl backdrop:bg-black/50
      "
    >
      <form
        onSubmit={(event) => void submit(event)}
        aria-busy={busy}
        className="space-y-6"
      >
        <header className="flex items-start justify-between gap-3">
          <h2 id={`${id}-title`} className="text-lg font-semibold">
            {content.title}
          </h2>

          <button
            type="button"
            disabled={busy}
            onClick={close}
            aria-label="Close confirmation"
            className="dashboard-icon-button"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="rounded-lg bg-dashboard-hover p-4">
          <p className="break-all text-sm font-medium">{boxId}</p>

          <p className="mt-3 text-xs text-dashboard-muted">
            {materialCount} {materialCount === 1 ? "material" : "materials"}
          </p>
        </div>

        <p
          id={`${id}-description`}
          className="text-sm leading-6 text-dashboard-muted"
        >
          {content.description}
        </p>

        {requiresReason && (
          <div>
            <label
              htmlFor={`${id}-reason`}
              className="mb-3 block text-sm font-medium"
            >
              Reason for reopening *
            </label>

            <textarea
              id={`${id}-reason`}
              required
              disabled={busy}
              maxLength={1000}
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="e.g. One material was missed during intake."
              className="dashboard-input resize-y px-3 py-3"
            />
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-dashboard-red">
            {error}
          </p>
        )}

        <footer className="flex justify-end gap-3 border-t border-dashboard-border pt-5">
          <button
            ref={cancelRef}
            type="button"
            disabled={busy}
            onClick={close}
            className="dashboard-btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy || (requiresReason && !reason.trim())}
            className={
              action === "delete"
                ? "dashboard-btn-secondary text-dashboard-red"
                : "dashboard-btn-primary"
            }
          >
            {busy ? "Saving…" : content.confirm}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
