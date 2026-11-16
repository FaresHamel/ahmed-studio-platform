"use client";

import { useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { TapeSummary } from "@/types/production-api";
import TapeCard from "./TapeCard";
import { supportsProduction } from "@/lib/individual/tape-workflow";

export interface TapeStage {
  key: string;
  label: string;
  color: string;
  background: string;
  badgeBackground: string;
}

const stageColors = {
  color: "var(--dashboard-muted)",
  background: "var(--dashboard-hover)",
  badgeBackground: "var(--dashboard-surface)"
};

export const TAPE_STAGES: TapeStage[] = [
  { key: "received", label: "Received", ...stageColors },
  { key: "inspected", label: "Inspected", ...stageColors },
  { key: "cleaning", label: "Cleaning", ...stageColors },
  { key: "baking", label: "Baking", ...stageColors },
  { key: "ingest", label: "Ingest", ...stageColors },
  { key: "qc", label: "QC", ...stageColors },
  { key: "restoration", label: "Restoration", ...stageColors },
  { key: "ready", label: "Ready", ...stageColors },
  { key: "shipped", label: "Shipped", ...stageColors }
];

export const REVIEW_STAGE: TapeStage = {
  key: "unknown",
  label: "Needs review",
  ...stageColors
};

interface Props {
  stage: TapeStage;
  tapes: TapeSummary[];
  expanded: boolean;
  isAdmin: boolean;
  onToggle: () => void;
  onAssign: (tape: TapeSummary) => void;
  onChangeStage: (tape: TapeSummary) => void;
  boxOpen: boolean;
  onDelete: (tape: TapeSummary) => void;
}

function assignmentAllowed(tape: TapeSummary): boolean {
  return (
    supportsProduction(tape.media_type) &&
    tape.status !== "shipped" &&
    tape.current_station !== "shipped"
  );
}

export default function TapeStageColumn({
  stage,
  tapes,
  expanded,
  isAdmin,
  boxOpen,
  onToggle,
  onAssign,
  onChangeStage,
  onDelete
}: Props) {
  const contentId = useId();

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={false}
        aria-label={`Expand ${stage.label}, ${tapes.length} materials`}
        className="flex shrink-0 cursor-pointer flex-col items-center gap-3 rounded-lg bg-dashboard-hover py-3 text-dashboard-muted hover:bg-dashboard-active hover:text-dashboard-text focus-visible:outline-2 focus-visible:outline-dashboard-focus"
        style={{ width: 44, minHeight: 190 }}
      >
        <ChevronRight size={16} aria-hidden="true" />

        <span className="text-[11px] font-medium">{tapes.length}</span>

        <span
          className="text-xs font-medium"
          style={{ writingMode: "vertical-rl" }}
        >
          {stage.label}
        </span>
      </button>
    );
  }

  return (
    <section
      aria-label={`${stage.label}: ${tapes.length} materials`}
      className="shrink-0 rounded-lg p-2"
      style={{
        width: 320,
        backgroundColor: stage.background
      }}
    >
      <header className="mb-2 flex h-8 items-center gap-2 px-1">
        <h3
          className="m-0 inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-dashboard-text"
          style={{ backgroundColor: stage.badgeBackground }}
        >
          <span
            aria-hidden="true"
            className="shrink-0 rounded-full"
            style={{
              width: 7,
              height: 7,
              backgroundColor: stage.color
            }}
          />
          {stage.label}
        </h3>

        <span className="text-[11px] text-dashboard-muted">{tapes.length}</span>

        <button
          type="button"
          onClick={onToggle}
          aria-label={`Collapse ${stage.label}`}
          aria-expanded={true}
          aria-controls={contentId}
          title="Collapse column"
          className="ml-auto rounded p-1 text-dashboard-muted hover:bg-dashboard-active hover:text-dashboard-text focus-visible:outline-2 focus-visible:outline-dashboard-focus"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
      </header>

      <div id={contentId} className="space-y-2">
        {tapes.map((tape) => (
          <TapeCard
            key={tape.id}
            tape={tape}
            color={stage.color}
            canAssign={isAdmin && boxOpen && assignmentAllowed(tape)}
            canDelete={
              isAdmin &&
              boxOpen &&
              tape.status === "received" &&
              tape.current_station === "received" &&
              (tape.stage_timings?.length ?? 0) === 0
            }
            onAssign={onAssign}
            onChangeStage={onChangeStage}
            onDelete={onDelete}
            editable={boxOpen}
          />
        ))}
      </div>
    </section>
  );
}
