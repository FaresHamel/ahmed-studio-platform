"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import { individualService } from "@/services/individual.service";
import { individualError } from "@/hooks/individual/useIndividualJob";
import { useAuthStore } from "@/store/auth.store";
import type { TapeSummary } from "@/types/production-api";

interface Props {
  tape: TapeSummary;
  onClose: () => void;
  onDeleted: () => void | Promise<void>;
}

export default function DeleteTapeModal({ tape, onClose, onDeleted }: Props) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mounted = useRef(false);
  const lock = useRef(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const materialId = tape.tape_code ?? tape.id;
  const title = tape.metadata?.title?.trim() || "Untitled material";

  useEffect(() => {
    mounted.current = true;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    document.body.style.overflow = "hidden";

    return () => {
      mounted.current = false;
      document.body.style.overflow = previousOverflow;

      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  function close() {
    if (!lock.current) {
      onClose();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (lock.current) return;

    const actor = useAuthStore.getState().user;

    if (!actor?.roles.includes("admin")) {
      setError("Only admins can delete materials.");
      return;
    }

    lock.current = true;
    setSaving(true);
    setError(null);

    try {
      await individualService.removeTape(tape.id);
    } catch (failure) {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
        setError(individualError(failure, "Could not delete this material."));
      }

      return;
    }

    // Deletion succeeded. A refresh failure must not invite another deletion.
    try {
      if (useAuthStore.getState().user?.id === actor.id) {
        toast.success(`Material ${materialId} deleted.`);
        await onDeleted();
      }
    } catch {
      toast.error(
        "Material deleted, but the box could not refresh. Reload the page."
      );
    } finally {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
        onClose();
      }
    }
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
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md
        overflow-y-auto rounded-xl border border-dashboard-border
        bg-dashboard-surface p-6 text-dashboard-text
        shadow-xl backdrop:bg-black/50
      "
    >
      <form
        onSubmit={(event) => void submit(event)}
        aria-busy={saving}
        className="space-y-6"
      >
        <header className="flex items-start justify-between gap-3">
          <h2 id={`${id}-title`} className="text-lg font-semibold">
            Delete material
          </h2>

          <button
            type="button"
            disabled={saving}
            onClick={close}
            aria-label="Close deletion confirmation"
            className="dashboard-icon-button"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="rounded-lg bg-dashboard-hover p-4">
          <p className="break-words text-sm font-medium">{title}</p>

          <p className="mt-3 break-all text-xs text-dashboard-blue">
            {materialId}
          </p>
        </div>

        <p
          id={`${id}-description`}
          className="text-sm leading-6 text-dashboard-muted"
        >
          Permanently delete this material from the box? This action cannot be
          undone. Materials with recorded production work cannot be deleted.
        </p>

        {error && (
          <p role="alert" className="text-sm text-dashboard-red">
            {error}
          </p>
        )}

        <footer className="flex justify-end gap-3 border-t border-dashboard-border pt-5">
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
            disabled={saving}
            className="
              dashboard-btn-secondary
              border-dashboard-red
              bg-dashboard-red-soft text-dashboard-red
              hover:bg-dashboard-red-soft
            "
          >
            <Trash2 size={15} aria-hidden="true" />
            {saving ? "Deleting…" : "Delete material"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
