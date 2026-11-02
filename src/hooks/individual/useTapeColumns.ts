"use client";

import { useEffect, useState } from "react";

const DEFAULT_OPEN = ["received", "inspected", "ingest", "qc"];

export function useTapeColumns(boxId: string) {
  const storageKey = `individual-box:${boxId}:open-stages`;

  const [preferences, setPreferences] = useState<{
    key: string;
    stages: string[];
  }>({
    key: storageKey,
    stages: DEFAULT_OPEN,
  });

  const expanded =
    preferences.key === storageKey
      ? preferences.stages
      : DEFAULT_OPEN;

  useEffect(() => {
    let stages = DEFAULT_OPEN;

    try {
      const saved = localStorage.getItem(storageKey);

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every((value) => typeof value === "string")
        ) {
          stages = parsed;
        }
      }
    } catch {
      // Storage may be unavailable; the board still works.
    }

    setPreferences({ key: storageKey, stages });
  }, [storageKey]);

  function update(stages: string[]) {
    setPreferences({ key: storageKey, stages });

    try {
      localStorage.setItem(storageKey, JSON.stringify(stages));
    } catch {
      // Keep the preference for the current session.
    }
  }

  function toggle(stage: string) {
    update(
      expanded.includes(stage)
        ? expanded.filter((key) => key !== stage)
        : [...expanded, stage],
    );
  }

  return { expanded, toggle, update };
}