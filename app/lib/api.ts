import { apiBase } from "./config";
import { getToken } from "../store/auth";
import { getBaseUrl } from "../store/connection";

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
  const token = getToken();
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, targetUserId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "failed to create conversation");
  }

  return data;
}

export async function getMessages(conversationId: string) {
  const token = getToken();
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/messages/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("failed to fetch messages");
  }

  return await res.json();
}

export async function sendMessage(conversationId: string, body: string) {
  const token = getToken();
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      conversationId,
      body,
    }),
  });

  if (!res.ok) {
    throw new Error("failed to send message");
  }

  return await res.json();
}

async function messageUser(userId: string) {
  try {
    const data = await createConversation("dm");
    router.push(`/messages/${data.conversation.id}`);
  } catch (err) {
    console.log("failed to open message screen", err);
  }
}
