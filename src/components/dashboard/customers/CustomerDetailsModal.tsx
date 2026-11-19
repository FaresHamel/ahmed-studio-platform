"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface CustomerDetailsModalProps {
  title: string;
  busy: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CustomerDetailsModal({
  title,
  busy,
  onClose,
  children
}: CustomerDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) dialog.showModal();

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog?.open) dialog.close();
    };
  }, []);

  function close() {
    if (!busy) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="
        m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl
        overflow-y-auto rounded-xl border border-dashboard-border
        bg-dashboard-surface text-dashboard-text
        shadow-xl backdrop:bg-black/50
      "
    >
      <header className="flex items-center justify-between gap-4 border-b border-dashboard-border px-5 py-4">
        <h2 id={titleId} className="text-[15px] font-semibold">
          {title}
        </h2>

        <button
          type="button"
          disabled={busy}
          onClick={close}
          aria-label={`Close ${title}`}
          className="
            inline-flex size-8 shrink-0 items-center justify-center
            rounded-lg text-dashboard-muted transition-colors
            hover:bg-dashboard-hover hover:text-dashboard-text
            focus-visible:outline-2
            focus-visible:outline-dashboard-focus
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div aria-busy={busy} className="p-5 sm:p-6">
        {children}
      </div>
    </dialog>
  );
}
