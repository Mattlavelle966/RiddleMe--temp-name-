let token: string | null = null;
let username: string | null = null;

export function setAuth(newToken: string, newUsername: string) {
  token = newToken;
  username = newUsername;
}

export function clearAuth() {
  token = null;
  username = null;
}

export function getToken() {
  return token;
}

export function getUsername() {
  return username;
}
