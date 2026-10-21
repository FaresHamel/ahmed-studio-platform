"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function DashboardDialog({ title, children, busy = false, onClose }: {
  title: string; children: ReactNode; busy?: boolean; onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return <dialog ref={ref} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
    onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}
    className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-dashboard-border bg-dashboard-surface p-0 text-dashboard-text shadow-xl backdrop:bg-black/45">
    <div className="p-6" onClick={event => event.stopPropagation()}>
      <header className="mb-5 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
        <button type="button" disabled={busy} onClick={onClose} aria-label="Close dialog" className="dashboard-icon-button"><X size={18} aria-hidden="true" /></button>
      </header>
      {children}
    </div>
  </dialog>;
}
