"use client";

import { useState } from "react";
import { Search, UserRound } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import type { TapeSummary } from "@/types/production-api";

import AssignmentModal from "./AssignmentModal";
import TapeStageColumn, { REVIEW_STAGE, TAPE_STAGES } from "./TapeStageColumn";
import { useTapeColumns } from "@/hooks/individual/useTapeColumns";
import ChangeTapeStageModal from "./ChangeTapeStageModal";

interface Props {
  boxId: string;
  tapes: TapeSummary[];
  onAssigned: () => void | Promise<void>;
}

type AssignedOperator = NonNullable<
  TapeSummary["assignments"]
>[number]["operator"];

function operatorName(operator: AssignedOperator) {
  return operator.profiles?.display_name?.trim() || operator.email;
}

export default function TapeBoard({ boxId, tapes, onAssigned }: Props) {
  const isAdmin = useAuthStore((state) =>
    Boolean(state.user?.roles.includes("admin"))
  );

  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("all");
  const [selectedTape, setSelectedTape] = useState<TapeSummary | null>(null);
const [stageTape, setStageTape] = useState<TapeSummary | null>(null);
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

    if (stageKey === "unknown") hasUnknown = true;

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
      groups.get(stageKey)!.push(tape);
      visibleCount++;
    }
  }

  const columns = hasUnknown ? [...TAPE_STAGES, REVIEW_STAGE] : TAPE_STAGES;

  const toolbarButton =
    "rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-xs text-dashboard-text hover:bg-dashboard-hover focus-visible:outline-2 focus-visible:outline-dashboard-focus";

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2">
          <UserRound
            size={16}
            aria-hidden="true"
            className="text-dashboard-muted"
          />

          <span className="sr-only">Filter by assigned Operator</span>

          <select
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            className="dashboard-input min-h-10 px-3 py-2 text-sm"
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
        </label>

        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search materials</span>

          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dashboard-muted"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search materials…"
            className="dashboard-input min-h-10 w-full py-2 pl-10 pr-3 text-sm"
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
            className={toolbarButton}
          >
            Expand all
          </button>

          <button
            type="button"
            onClick={() => update([])}
            className={toolbarButton}
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
              onToggle={() => toggle(stage.key)}
              onAssign={setSelectedTape}
              onChangeStage={setStageTape}
            />
          ))}
        </div>
      </div>
      {stageTape && (
        <ChangeTapeStageModal
          key={stageTape.id}
          tape={stageTape}
          onClose={() => setStageTape(null)}
          onUpdated={onAssigned}
        />
      )}
      {selectedTape && isAdmin && (
        <AssignmentModal
          key={selectedTape.id}
          tape={selectedTape}
          onClose={() => setSelectedTape(null)}
          onAssigned={onAssigned}
        />
      )}
    </section>
  );
}
