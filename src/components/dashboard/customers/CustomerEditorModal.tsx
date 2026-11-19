"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { CustomerForm } from "./CustomerForm";
import type { Customer, CustomerInput } from "@/types/production-api";

interface CustomerEditorModalProps {
  customer?: Customer;
  busy: boolean;
  error: string | null;
  onSubmit: (input: CustomerInput) => Promise<void>;
  onClose: () => void;
}

export default function CustomerEditorModal({
  customer,
  busy,
  error,
  onSubmit,
  onClose
}: CustomerEditorModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) {
      dialog.showModal();
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
    if (!busy) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={customer ? "Edit customer" : "Create customer"}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl
        overflow-y-auto rounded-[4px] border border-dashboard-border
        bg-dashboard-surface text-dashboard-text
        shadow-xl backdrop:bg-black/50
      "
    >
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={close}
            aria-label="Close customer form"
            className="
              inline-flex size-8 items-center justify-center
              rounded-[4px] text-dashboard-muted transition-colors
              hover:bg-dashboard-hover hover:text-dashboard-text
              focus-visible:outline-2
              focus-visible:outline-dashboard-focus
              disabled:cursor-not-allowed disabled:opacity-40
            "
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <CustomerForm
          customer={customer}
          busy={busy}
          error={error}
          onSubmit={onSubmit}
          onCancel={close}
        />
      </div>
    </dialog>
  );
}
