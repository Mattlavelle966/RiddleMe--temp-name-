const userToSocket = new Map<string, string>();
const socketToUser = new Map<string, string>();

export function bindUserToSocket(userId: string, socketId: string) {
  const oldSocketId = userToSocket.get(userId);

  if (oldSocketId && oldSocketId !== socketId) {
    socketToUser.delete(oldSocketId);
  }

  userToSocket.set(userId, socketId);
  socketToUser.set(socketId, userId);
}

export function unbindSocket(socketId: string) {
  const userId = socketToUser.get(socketId);
  if (!userId) return;

  socketToUser.delete(socketId);

  const currentSocketId = userToSocket.get(userId);
  if (currentSocketId === socketId) {
    userToSocket.delete(userId);
  }
}

export function getSocketIdByUserId(userId: string) {
  return userToSocket.get(userId) || null;
}

export function getUserIdBySocketId(socketId: string) {
  return socketToUser.get(socketId) || null;
}
