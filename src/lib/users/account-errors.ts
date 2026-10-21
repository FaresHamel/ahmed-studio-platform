import axios from "axios";

export function accountError(error: unknown, fallback = "The request failed. Please try again."): string {
  if (!axios.isAxiosError(error)) return fallback;
  const message: unknown = error.response?.data?.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    const messages = message.filter((item): item is string => typeof item === "string");
    if (messages.length) return messages.join(" ");
  }
  if (!error.response) return "Unable to connect to the server.";
  return fallback;
}
