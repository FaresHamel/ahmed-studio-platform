import axios from "axios";

export function povError(
    failure: unknown,
    fallback = "The request failed. Please try again."
): string {
    if (axios.isAxiosError<{ message?: string | string[] }>(failure)) {
        const message = failure.response?.data?.message;

        if (Array.isArray(message)) return message.join(" ");
        if (typeof message === "string") return message;
    }

    if (failure instanceof Error && !axios.isAxiosError(failure)) {
        return failure.message;
    }

    return fallback;
}

export function povDate(
    value: string | null | undefined,
    includeTime = true
): string {
    if (!value) return "Not recorded";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date not available";
    }

    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        ...(includeTime
            ? { timeStyle: "short" as const }
            : { timeZone: "UTC" })
    }).format(date);
}

export function povDuration(seconds: number): string {
    if (!Number.isFinite(seconds)) return "Not recorded";

    const total = Math.max(0, Math.floor(seconds));
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;

    return `${minutes}m ${total % 60}s`;
}

export function povName(value: string): string {
    const name = value.trim();

    if (!name) return "Account not available";
    if (name.includes("@")) return name;

    return name
        .toLocaleLowerCase()
        .replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase());
}