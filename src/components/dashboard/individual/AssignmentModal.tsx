"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import api from "@/apis/axios";
import { individualService } from "@/services/individual.service";
import { individualError } from "@/hooks/individual/useIndividualJob";

import type { AssignableStage, TapeSummary } from "@/types/production-api";

interface AssignmentModalProps {
  tape: TapeSummary;
  onClose: () => void;
  onAssigned: () => void | Promise<void>;
}

interface Operator {
  id: string;
  email: string;
  status: string;
  profiles: {
    display_name: string | null;
    operator_type: string | null;
  } | null;
}

interface OperatorPage {
  data: Operator[];
  meta: {
    totalPages: number;
  };
}

const ASSIGNABLE_STAGES: AssignableStage[] = [
  "inspected",
  "cleaning",
  "baking",
  "ingest",
  "qc",
  "restoration"
];

function stageLabel(value: string) {
  if (value === "qc") return "QC";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function operatorName(operator: Operator) {
  return operator.profiles?.display_name || operator.email;
}

export default function AssignmentModal({
  tape,
  onClose,
  onAssigned
}: AssignmentModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lock = useRef(false);
  const mounted = useRef(false);
  const titleId = useId();

  const initialStage =
    ASSIGNABLE_STAGES.find((stage) => stage === tape.current_station) ??
    "inspected";

  const [stage, setStage] = useState<AssignableStage>(initialStage);

  const [operatorId, setOperatorId] = useState(
    tape.assignments?.find((assignment) => assignment.stage === initialStage)
      ?.operator_id ?? ""
  );

  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    mounted.current = true;

    const element = dialog.current;

    if (element && !element.open) {
      element.showModal();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      mounted.current = false;
      document.body.style.overflow = previousOverflow;

      if (element?.open) {
        element.close();
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOperators() {
      setLoading(true);
      setError(null);
      setOperators([]);

      try {
        const result: Operator[] = [];

        let page = 1;
        let totalPages = 1;

        do {
          const { data } = await api.get<OperatorPage>("/users", {
            params: {
              role: "operator",
              page,
              limit: 50
            },
            signal: controller.signal
          });

          result.push(...data.data);
          totalPages = data.meta.totalPages;
          page++;
        } while (page <= totalPages);

        if (!controller.signal.aborted) {
          const uniqueOperators = new Map<string, Operator>();

          for (const operator of result) {
            if (operator.status === "active") {
              uniqueOperators.set(operator.id, operator);
            }
          }

          setOperators(
            Array.from(uniqueOperators.values()).sort((a, b) =>
              operatorName(a).localeCompare(operatorName(b))
            )
          );
        }
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(individualError(failure, "Could not load Operators."));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadOperators();

    return () => controller.abort();
  }, [reload]);

  const operatorAvailable = operators.some(
    (operator) => operator.id === operatorId
  );

  function close() {
    if (!lock.current) {
      onClose();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (lock.current || loading || !operatorAvailable) {
      return;
    }

    lock.current = true;
    setSaving(true);
    setError(null);

    try {
      await individualService.assignTape(tape.id, {
        stage,
        operator_id: operatorId
      });
    } catch (failure) {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
        setError(individualError(failure, "Could not assign this Operator."));
      }

      return;
    }

    toast.success("Operator assigned.");

    try {
      await onAssigned();
    } catch {
      toast.error("Assignment saved. Reload to refresh the board.");
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
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-dashboard-border bg-white p-6 text-slate-900 shadow-xl backdrop:bg-black/50"
    >
      <form
        onSubmit={(event) => void submit(event)}
        aria-busy={saving}
        className="space-y-5"
      >
        <header className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-lg font-semibold">
              Assign Operator
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500">
              {tape.tape_code ?? tape.id}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={close}
            aria-label="Close assignment"
            className="rounded p-1"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <fieldset disabled={saving} className="space-y-4">
          <label className="block space-y-2 text-sm">
            <span>Production stage</span>

            <select
              value={stage}
              onChange={(event) => {
                const next = event.target.value as AssignableStage;

                setStage(next);
                setOperatorId(
                  tape.assignments?.find(
                    (assignment) => assignment.stage === next
                  )?.operator_id ?? ""
                );
                setError(null);
              }}
              className="dashboard-input min-h-12 w-full px-3 py-3"
            >
              {ASSIGNABLE_STAGES.map((item) => (
                <option key={item} value={item}>
                  {stageLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span>Operator</span>

            <select
              required
              disabled={loading}
              value={operatorAvailable ? operatorId : ""}
              onChange={(event) => {
                setOperatorId(event.target.value);
                setError(null);
              }}
              className="dashboard-input min-h-12 w-full px-3 py-3"
            >
              <option value="">
                {loading ? "Loading Operators…" : "Select Operator"}
              </option>

              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operatorName(operator)}
                  {" · "}
                  {operator.profiles?.operator_type || "No specialty"}
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs text-slate-500">
            Assignment applies to the selected stage. It does not move the tape
            or start work. The server checks Operator specialty.
          </p>
        </fieldset>

        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}

        {!loading && operators.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">
              No active Operators loaded.
            </p>

            <button
              type="button"
              disabled={saving}
              onClick={() => setReload((previous) => previous + 1)}
              className="dashboard-btn-secondary"
            >
              Reload Operators
            </button>
          </div>
        )}

        <footer className="flex justify-end gap-3">
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
            disabled={loading || saving || !operatorAvailable}
            className="dashboard-btn-primary"
          >
            {saving ? "Saving…" : "Save assignment"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
