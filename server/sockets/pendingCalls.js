const pendingCalls = new Map();

function createPendingCall(callId, callerSocketId, targetSocketId, callerUser) {
  pendingCalls.set(callId, {
    callId,
    callerSocketId,
    targetSocketId,
    callerUser,
  });
}

function getPendingCall(callId) {
  return pendingCalls.get(callId);
}

function removePendingCall(callId) {
  pendingCalls.delete(callId);
}

module.exports = {
  createPendingCall,
  getPendingCall,
  removePendingCall,
};
