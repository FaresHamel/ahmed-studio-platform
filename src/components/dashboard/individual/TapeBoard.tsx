"use client";

import { useState } from "react";
import { ChevronDown, Search, UserRound } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useTapeColumns } from "@/hooks/individual/useTapeColumns";
import type { TapeSummary } from "@/types/production-api";

import AssignmentModal from "./AssignmentModal";
import ChangeTapeStageModal from "./ChangeTapeStageModal";
import DeleteTapeModal from "./DeleteTapeModal";
import TapeStageColumn, { REVIEW_STAGE, TAPE_STAGES } from "./TapeStageColumn";

interface Props {
  boxId: string;
  boxOpen: boolean;
  tapes: TapeSummary[];
  onAssigned: () => void | Promise<void>;
}

type TapeAction = {
  type: "assign" | "stage" | "delete";
  tape: TapeSummary;
};

type AssignedOperator = NonNullable<
  TapeSummary["assignments"]
>[number]["operator"];

const TOOLBAR_BUTTON =
  "rounded-md border border-dashboard-border " +
  "bg-dashboard-surface px-3 py-2 text-xs text-dashboard-text " +
  "hover:bg-dashboard-hover focus-visible:outline-2 " +
  "focus-visible:outline-dashboard-focus";

function operatorName(operator: AssignedOperator) {
  return operator.profiles?.display_name?.trim() || operator.email;
}

export default function TapeBoard({
  boxId,
  boxOpen,
  tapes,
  onAssigned
}: Props) {
  const isAdmin = useAuthStore((state) =>
    Boolean(state.user?.roles.includes("admin"))
  );

  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("all");
  const [action, setAction] = useState<TapeAction | null>(null);

  const { expanded, toggle, update } = useTapeColumns(boxId);

  const assigneeNames = new Map<string, string>();

  const groups = new Map<string, TapeSummary[]>(
    TAPE_STAGES.map((stage) => [stage.key, []])
  );

  groups.set("unknown", []);

  const query = search.trim().toLowerCase();
  let visibleCount = 0;
  let hasUnknown = false;

  for (const tape of tapes) {
    const assignments = tape.assignments ?? [];

    for (const assignment of assignments) {
      assigneeNames.set(
        assignment.operator_id,
        operatorName(assignment.operator)
      );
    }

    const stageKey =
      tape.current_station && groups.has(tape.current_station)
        ? tape.current_station
        : "unknown";

    if (stageKey === "unknown") {
      hasUnknown = true;
    }

    const matchesAssignee =
      assignee === "all" ||
      (assignee === "unassigned"
        ? assignments.length === 0
        : assignments.some(
            (assignment) => assignment.operator_id === assignee
          ));

    const searchable = [
      tape.id,
      tape.tape_code,
      tape.metadata?.title,
      tape.media_type,
      ...assignments.map((assignment) => operatorName(assignment.operator))
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (matchesAssignee && searchable.includes(query)) {
      groups.get(stageKey)?.push(tape);
      visibleCount++;
    }
  }

  const columns = hasUnknown ? [...TAPE_STAGES, REVIEW_STAGE] : TAPE_STAGES;

  function closeAction() {
    setAction(null);
  }

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2">
          <UserRound
            size={16}
            aria-hidden="true"
            className="text-dashboard-muted"
          />

          <span className="sr-only">Filter by assigned operator</span>

          <div className="relative">
            <select
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
              className="
                dashboard-input min-h-10 appearance-none
                py-2 pl-3 pr-10 text-sm
              "
            >
              <option value="all">All assignees</option>
              <option value="unassigned">No assignments</option>

              {Array.from(assigneeNames.entries())
                .sort((a, b) => a[1].localeCompare(b[1]))
                .map(([operatorId, name]) => (
                  <option key={operatorId} value={operatorId}>
                    {name}
                  </option>
                ))}
            </select>

            <ChevronDown
              size={16}
              aria-hidden="true"
              className="
                pointer-events-none absolute right-3 top-1/2
                -translate-y-1/2 text-dashboard-muted
              "
            />
          </div>
        </label>

        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search materials</span>

          <Search
            size={16}
            aria-hidden="true"
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              text-dashboard-muted
            "
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search materials…"
            className="
              dashboard-input min-h-10 w-full
              py-2 pl-10 pr-3 text-sm
            "
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-xs text-dashboard-muted">
          {visibleCount} of {tapes.length} materials
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update(columns.map((stage) => stage.key))}
            className={TOOLBAR_BUTTON}
          >
            Expand all
          </button>

          <button
            type="button"
            onClick={() => update([])}
            className={TOOLBAR_BUTTON}
          >
            Collapse all
          </button>
        </div>
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-label="Materials by production stage"
        className="max-w-full overflow-x-auto pb-4"
      >
        <div className="flex w-max items-start gap-3">
          {columns.map((stage) => (
            <TapeStageColumn
              key={stage.key}
              stage={stage}
              tapes={groups.get(stage.key) ?? []}
              expanded={expanded.includes(stage.key)}
              isAdmin={isAdmin}
              boxOpen={boxOpen}
              onToggle={() => toggle(stage.key)}
              onAssign={(tape) => setAction({ type: "assign", tape })}
              onChangeStage={(tape) => setAction({ type: "stage", tape })}
              onDelete={(tape) => setAction({ type: "delete", tape })}
            />
          ))}
        </div>
      </div>

      {action?.type === "stage" && (
        <ChangeTapeStageModal
          key={`stage-${action.tape.id}`}
          tape={action.tape}
          onClose={closeAction}
          onUpdated={onAssigned}
        />
      )}

      {action?.type === "assign" && isAdmin && (
        <AssignmentModal
          key={`assignment-${action.tape.id}`}
          tape={action.tape}
          onClose={closeAction}
          onAssigned={onAssigned}
        />
      )}

      {action?.type === "delete" && isAdmin && (
        <DeleteTapeModal
          key={`delete-${action.tape.id}`}
          tape={action.tape}
          onClose={closeAction}
          onDeleted={onAssigned}
        />
      )}
    </section>
  );
}
