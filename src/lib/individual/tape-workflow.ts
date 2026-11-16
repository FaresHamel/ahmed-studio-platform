import type {
    AssignableStage,
    Station,
    TapeMediaType,
    TapeWorkResult,
} from "@/types/production-api";

export const PRODUCTION_STAGES: AssignableStage[] = [
    "inspected",
    "cleaning",
    "baking",
    "ingest",
    "qc",
    "restoration",
];

export const STATION_ORDER: Station[] = [
    "received",
    ...PRODUCTION_STAGES,
    "ready",
    "shipped",
];

const OPTIONAL_STAGES: Station[] = [
    "cleaning",
    "baking",
    "restoration",
];

const PRODUCTION_MEDIA_TYPES: readonly TapeMediaType[] = [
    "audio",
    "video",
    "photo",
    "document",
];

const SPECIALTY_LABELS: Record<string, string> = {
    supervisor: "Supervisor",
    data_entry: "Data Entry",
    audio_specialist: "Audio Specialist",
    video_specialist: "Video Specialist",
    audio_qc: "Audio QC",
    video_qc: "Video QC",
    restoration: "Restoration Specialist",
};

export function supportsProduction(
    mediaType: string,
): mediaType is TapeMediaType {
    return PRODUCTION_MEDIA_TYPES.some(
        (supported) => supported === mediaType,
    );
}

export function stageLabel(
    value: string | null | undefined,
): string {
    if (!value) return "Not recorded";
    if (value === "qc") return "QC";

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function specialtyLabel(
    value: string | null | undefined,
): string {
    return value
        ? SPECIALTY_LABELS[value] ?? value
        : "No specialty";
}

export function canOperateStage(
    specialty: string | null | undefined,
    stage: AssignableStage,
    mediaType: string,
): boolean {
    if (!supportsProduction(mediaType)) return false;
    if (!specialty) return false;

    if (specialty === "supervisor") return true;

    switch (stage) {
        case "inspected":
        case "cleaning":
            return specialty === "data_entry";

        case "baking":
            return false;

        case "ingest":
            return (
                (mediaType === "audio" &&
                    specialty === "audio_specialist") ||
                (mediaType === "video" &&
                    specialty === "video_specialist")
            );

        case "qc":
            return (
                (mediaType === "audio" &&
                    specialty === "audio_qc") ||
                (mediaType === "video" &&
                    specialty === "video_qc")
            );

        case "restoration":
            return specialty === "restoration";

        default:
            return false;
    }
}

export function movementOptions(
    current: string | null,
    result: TapeWorkResult,
    isAdmin: boolean,
): Station[] {
    const fromIndex = STATION_ORDER.findIndex(
        (stage) => stage === current,
    );

    if (fromIndex < 0 || current === "shipped") return [];

    return STATION_ORDER.filter((target, targetIndex) => {
        if (
            target === "shipped" ||
            targetIndex === fromIndex
        ) {
            return false;
        }

        if (targetIndex < fromIndex) {
            const qcRework =
                current === "qc" &&
                result === "NOT_OK" &&
                ["cleaning", "ingest"].includes(target);

            return isAdmin || qcRework;
        }

        if (result === "NOT_OK") return false;

        return STATION_ORDER
            .slice(fromIndex + 1, targetIndex)
            .every((stage) => OPTIONAL_STAGES.includes(stage));
    });
}