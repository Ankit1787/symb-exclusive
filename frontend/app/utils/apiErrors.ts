import { toast } from "vue-sonner";

type ErrorWithResponse = {
  data?: unknown;
  response?: {
    status?: number;
    _data?: unknown;
  };
  status?: number;
  message?: string;
};

const readMessage = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  return (
    readMessage(record.message) ||
    readMessage(record.error) ||
    readMessage(record.errors)
  );
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  const err = error as ErrorWithResponse;
  const status = err?.response?.status ?? err?.status;

  return (
    readMessage(err?.response?._data) ||
    readMessage(err?.data) ||
    (status === 401 ? "Invalid email or password." : null) ||
    err?.message ||
    fallback
  );
};

export const showApiErrorToast = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  const message = getApiErrorMessage(error, fallback);
  if (import.meta.client) toast.error(message);
  return message;
};
