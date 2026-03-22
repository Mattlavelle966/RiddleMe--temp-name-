let baseUrl = process.env.EXPO_PUBLIC_API_BASE || "";

export function setBaseUrl(url: string) {
  baseUrl = url.trim().replace(/\/+$/, "");
}

export function getBaseUrl() {
  return baseUrl;
}
