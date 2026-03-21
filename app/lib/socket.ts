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

export function connectToUserSocket(targetUserId: string) {
  return new Promise((resolve) => {
    if (!socket) {
      console.log("no socket");
      resolve({ error: "no socket" });
      return;
    }

    socket.emit("connectToUser", { targetUserId }, (result: any) => {
      console.log("connectToUser result", result);
      resolve(result);
    });
  });
}


export function getSocket() {
  return socket;
}
