const socketToCall = new Map(); // socketId -> callId
const callToSockets = new Map(); // callId -> Set(socketId)

function joinCall(socketId, callId) {
  leaveCall(socketId);

  socketToCall.set(socketId, callId);

  if (!callToSockets.has(callId)) {
    callToSockets.set(callId, new Set());
  }

  callToSockets.get(callId).add(socketId);
}

function leaveCall(socketId) {
  const callId = socketToCall.get(socketId);
  if (!callId) return;

  socketToCall.delete(socketId);

  const members = callToSockets.get(callId);
  if (!members) return;

  members.delete(socketId);

  if (members.size === 0) {
    callToSockets.delete(callId);
  }
}

function getCallIdBySocketId(socketId) {
  return socketToCall.get(socketId) || null;
}

function getSocketIdsByCallId(callId) {
  return callToSockets.get(callId) || new Set();
}

module.exports = {
  joinCall,
  leaveCall,
  getCallIdBySocketId,
  getSocketIdsByCallId,
};
