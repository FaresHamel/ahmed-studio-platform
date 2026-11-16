"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";

import api from "@/apis/axios";
import { individualService } from "@/services/individual.service";
import { individualError } from "@/hooks/individual/useIndividualJob";
import type { AssignableStage, TapeSummary } from "@/types/production-api";
import {
  PRODUCTION_STAGES,
  canOperateStage,
  specialtyLabel,
  stageLabel
} from "@/lib/individual/tape-workflow";
import { supportsProduction } from "@/lib/individual/tape-workflow";
interface Props {
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

const selectClass = "dashboard-input min-h-12 appearance-none py-3 pl-3 pr-10";

const labelClass = "mb-3 block text-sm font-medium text-dashboard-text";

function operatorName(operator: Operator) {
  return operator.profiles?.display_name?.trim() || operator.email;
}

function SelectArrow() {
  return (
    <ChevronDown
      size={16}
      aria-hidden="true"
      className="
        pointer-events-none absolute right-3 top-1/2
        -translate-y-1/2 text-dashboard-muted
      "
    />
  );
}

export default function AssignmentModal({ tape, onClose, onAssigned }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lock = useRef(false);
  const mounted = useRef(false);
  const id = useId();

  const initialStage =
    PRODUCTION_STAGES.find((item) => item === tape.current_station) ??
    "inspected";

  const [stage, setStage] = useState<AssignableStage>(initialStage);

  const [operatorId, setOperatorId] = useState(
    tape.assignments?.find((item) => item.stage === initialStage)
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
    const previousOverflow = document.body.style.overflow;

    if (element && !element.open) {
      element.showModal();
    }

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
        const result = new Map<string, Operator>();
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

          if (controller.signal.aborted) return;

          for (const operator of data.data) {
            if (operator.status === "active") {
              result.set(operator.id, operator);
            }
          }

          totalPages = data.meta.totalPages;
          page++;
        } while (page <= totalPages);

        setOperators(
          Array.from(result.values()).sort((a, b) =>
            operatorName(a).localeCompare(operatorName(b))
          )
        );
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(individualError(failure, "Could not load operators."));
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

  const eligibleOperators = operators.filter((operator) =>
    canOperateStage(operator.profiles?.operator_type, stage, tape.media_type)
  );

  const selectedOperator = eligibleOperators.find(
    (operator) => operator.id === operatorId
  );

  const currentAssignment = tape.assignments?.find(
    (assignment) => assignment.stage === stage
  );

  const currentName = currentAssignment
    ? currentAssignment.operator.profiles?.display_name?.trim() ||
      currentAssignment.operator.email
    : null;

const unavailable =
  !supportsProduction(tape.media_type) ||
  tape.status === "shipped" ||
  tape.current_station === "shipped";

  function close() {
    if (!lock.current) {
      onClose();
    }
  }

  function changeStage(next: AssignableStage) {
    setStage(next);

    setOperatorId(
      tape.assignments?.find((assignment) => assignment.stage === next)
        ?.operator_id ?? ""
    );

    setError(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (lock.current || loading || unavailable || !selectedOperator) {
      return;
    }

    lock.current = true;
    setSaving(true);
    setError(null);

    try {
      await individualService.assignTape(tape.id, {
        stage,
        operator_id: selectedOperator.id
      });
    } catch (failure) {
      lock.current = false;

      if (mounted.current) {
        setSaving(false);
        setError(individualError(failure, "Could not save assignment."));
      }

      return;
    }

    toast.success(
      `${operatorName(selectedOperator)} assigned to ${stageLabel(stage)}.`
    );

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
      aria-labelledby={`${id}-title`}
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
        aria-busy={saving}
        className="space-y-6"
      >
        <header className="flex items-start justify-between gap-3">
          <div>
            <h2 id={`${id}-title`} className="text-lg font-semibold">
              Assign operator
            </h2>

            <p className="mt-3 break-all text-sm text-dashboard-blue">
              {tape.tape_code ?? tape.id}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={close}
            aria-label="Close assignment"
            className="dashboard-icon-button"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <fieldset disabled={saving || unavailable} className="space-y-5">
          <div>
            <label htmlFor={`${id}-stage`} className={labelClass}>
              Assign for stage
            </label>

            <div className="relative">
              <select
                id={`${id}-stage`}
                value={stage}
                onChange={(event) =>
                  changeStage(event.target.value as AssignableStage)
                }
                className={selectClass}
              >
                {PRODUCTION_STAGES.map((item) => (
                  <option key={item} value={item}>
                    {stageLabel(item)}
                  </option>
                ))}
              </select>

              <SelectArrow />
            </div>
          </div>

          <div className="rounded-lg bg-dashboard-hover p-3 text-sm">
            <span className="text-dashboard-muted">Currently assigned: </span>

            <span className="font-medium">{currentName || "No operator"}</span>
          </div>

          <div>
            <label htmlFor={`${id}-operator`} className={labelClass}>
              Operator
            </label>

            <div className="relative">
              <select
                id={`${id}-operator`}
                required
                disabled={loading}
                value={selectedOperator ? operatorId : ""}
                onChange={(event) => {
                  setOperatorId(event.target.value);
                  setError(null);
                }}
                className={selectClass}
              >
                <option value="">
                  {loading ? "Loading operators…" : "Select an operator"}
                </option>

                {eligibleOperators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operatorName(operator)}
                    {" · "}
                    {specialtyLabel(operator.profiles?.operator_type)}
                  </option>
                ))}
              </select>

              <SelectArrow />
            </div>
          </div>

          <p className="text-xs leading-5 text-dashboard-muted">
            This person is responsible for {stageLabel(stage)}. Other stage
            assignments stay unchanged. Work starts when the operator presses
            Start.
          </p>

          {stage === "baking" && (
            <p className="rounded-lg bg-dashboard-amber-soft p-3 text-xs leading-5 text-dashboard-amber">
              Baking can currently be assigned to a supervisor. Admins can also
              perform baking directly.
            </p>
          )}
        </fieldset>

        {unavailable && (
          <p className="text-sm text-dashboard-amber">
            Assignment is unavailable for this material.
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-dashboard-red">
            {error}
          </p>
        )}

        {!loading && !unavailable && eligibleOperators.length === 0 && (
          <p role="status" className="text-sm text-dashboard-muted">
            No active operators match this stage and media type.
          </p>
        )}

        {!loading && (
          <button
            type="button"
            disabled={saving}
            onClick={() => setReload((previous) => previous + 1)}
            className="
              text-xs text-dashboard-blue underline
              underline-offset-4 disabled:opacity-50
            "
          >
            Reload operators
          </button>
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
            disabled={loading || saving || unavailable || !selectedOperator}
            className="dashboard-btn-primary"
          >
            {saving ? "Saving…" : "Save assignment"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
