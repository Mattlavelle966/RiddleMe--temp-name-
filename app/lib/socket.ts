import { io } from "socket.io-client";
import { getToken } from "../store/auth";
import { getBaseUrl } from "../store/connection";

let socket: any = null;

export function connectSocket() {
  const token = getToken();
  const base = getBaseUrl();

  socket = io(base, {
    auth: {
      token: token,
    },
  });

  return socket;
}

export function getSocket() {
  return socket;
}
