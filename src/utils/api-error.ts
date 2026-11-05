import { isAxiosError } from 'axios';

interface ApiErrorBody {
  message?: unknown;
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }
  const message = error.response?.data?.message;
  return typeof message === 'string' ? message : fallback;
}
