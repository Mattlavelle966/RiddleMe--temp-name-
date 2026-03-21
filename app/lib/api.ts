import { apiBase } from "./config";
import { getToken } from "../store/auth";

export async function api(path: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "request failed");
  }

  return data;
}
