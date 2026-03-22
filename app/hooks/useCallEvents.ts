import { useEffect } from "react";
import { connectSocket } from "../lib/socket";
import { MediaClient } from "../lib/mediaClient";
import { startActiveCallMedia } from "../lib/callSessions";

let mediaClient: MediaClient | null = null;

type IncomingCallHandler = (
  callId: string,
  callerId: string,
  callerName: string
) => void;

type ClearIncomingCallHandler = () => void;

export function useCallEvents(
  token: string | null,
  showIncomingCall: IncomingCallHandler,
  clearIncomingCall: ClearIncomingCallHandler,
  setUsers: (users: any[]) => void,
  getUsers: () => Promise<{ users: any[] }>
) {
  useEffect(() => {
    if (!token) {
      return;
    }

    connectSocket();

    if (!mediaClient) {
      mediaClient = new MediaClient();
    }

    const handleIncomingCall = ({callId,callerId,callerName,}: {callId: string;callerId: string;callerName: string;}) => {
      showIncomingCall(callId, callerId, callerName);
    };

    const handleCallAccepted = async ({ callId }: { callId: string }) => {
      console.log("call accepted", callId);

      if (!mediaClient) {
        return;
      }

      clearIncomingCall();
      await startActiveCallMedia(mediaClient);
    };

    const handleCallDeclined = ({ callId }: { callId: string }) => {
      console.log("call declined", callId);
      clearIncomingCall();
    };

    mediaClient.onIncomingCall(handleIncomingCall);
    mediaClient.onCallAccepted(handleCallAccepted);
    mediaClient.onCallDeclined(handleCallDeclined);

    getUsers().then((data) => setUsers(data.users));

    return () => {
      mediaClient?.offIncomingCall(handleIncomingCall);
      mediaClient?.offCallAccepted(handleCallAccepted);
      mediaClient?.offCallDeclined(handleCallDeclined);
    };
  }, [token, showIncomingCall, clearIncomingCall, setUsers, getUsers]);
}

export function getMediaClient() {
  return mediaClient;
}
