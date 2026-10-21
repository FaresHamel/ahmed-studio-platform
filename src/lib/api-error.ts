import axios from 'axios';
export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred.'): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return 'Unable to connect to the server. Please try again.';
  const message: unknown = error.response.data?.message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) {
    const messages = message.filter((item): item is string => typeof item === 'string');
    if (messages.length) return messages.join('\n');
  }
  return fallback;
}
