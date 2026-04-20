import { getToken } from "../store/auth";
import { apiBase } from "./config";

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

export async function getUserStatus(userId: string) {
  return api(`/api/users/${userId}/status`);
}

export async function getUsers() {
  return api("/api/users");
}

export async function getMe() {
  return api("/api/me");
}

export async function createConversation(
  type: string = "dm",
  targetUserId: string
) {
  return api("/api/conversations", {
    method: "POST",
    body: JSON.stringify({ type, targetUserId }),
  });
}

export async function getMessages(conversationId: string) {
  return api(`/api/messages/${conversationId}`);
}

export async function sendMessage(conversationId: string, body: string) {
  return api("/api/messages", {
    method: "POST",
    body: JSON.stringify({
      conversationId,
      body,
    }),
  });
}
