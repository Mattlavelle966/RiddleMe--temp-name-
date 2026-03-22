import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import {  getToken, getUsername } from "../store/auth";
import { getBaseUrl } from "../store/connection";


import { useState } from "react";
import { requestCall, acceptIncomingCallSession, declineIncomingCallSession,} from "../lib/callSessions";
import ConnectionWindow from "../components/ConnectionWindow";
import { getUsers, getUserStatus } from "../lib/api";

import { useUserStatusPolling } from "../hooks/useUserStatusPolling";
import MainPanel from "../components/MainPanel";
import { useIncomingCall } from "../hooks/useIncomingCall";

import { useCallEvents, getMediaClient } from "../hooks/useCallEvents";




export default function Home() {
  const token = getToken();
  const [users, setUsers] = useState([]);
  const [userStatus, setUserStatus] = useState<Record<string, string>>({});
  const { incomingCall, showIncomingCall, clearIncomingCall } = useIncomingCall();

  useUserStatusPolling(users, token, setUserStatus);
  useCallEvents(token, showIncomingCall, clearIncomingCall, setUsers, getUsers);

  async function connectToUser(userId: string) {
    const result = await requestCall(userId);

    if(!result?.ok){
      console.log("Call Failed");
      return;
    }

    console.log("waiting for call acceptance", result.callId);

  }

  async function acceptIncomingCall() {
    const mediaClient = getMediaClient();
    if (!incomingCall || !mediaClient) {
      return;
    }

    await acceptIncomingCallSession(mediaClient, incomingCall.callId);
    clearIncomingCall();
  }
  async function declineIncomingCall() {
    const mediaClient = getMediaClient();
    if (!incomingCall || !mediaClient) {
      return;
    }

    await declineIncomingCallSession(mediaClient, incomingCall.callId);
    clearIncomingCall();
  }


  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text>Home</Text>
      <Text>User: {getUsername()}</Text>
      <Text>Backend: {getBaseUrl()}</Text>
      <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
        <ConnectionWindow
          users={users}
          userStatus={userStatus}
          onConnect={connectToUser}
        /> 

     

        <MainPanel
          visible={!!incomingCall}
          callerName={incomingCall?.callerName ?? ""}
          callId={incomingCall?.callId ?? ""}
          onAccept={acceptIncomingCall}
          onDecline={declineIncomingCall}
        />
      </View>

    </View>
  );
}
