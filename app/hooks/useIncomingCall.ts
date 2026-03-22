import { useState } from "react";

export type IncomingCallData = {
  callId: string;
  callerId: string;
  callerName: string;
} | null;

export function useIncomingCall() {
  const [incomingCall, setIncomingCall] = useState<IncomingCallData>(null);

  function showIncomingCall(callId: string, callerId: string, callerName: string) {
    setIncomingCall({
      callId,
      callerId,
      callerName,
    });
  }

  function clearIncomingCall() {
    setIncomingCall(null);
  }

  return {
    incomingCall,
    showIncomingCall,
    clearIncomingCall,
  };
}
