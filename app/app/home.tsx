import { View, Text, TouchableOpacity } from "react-native";
import { Redirect } from "expo-router";
import {  getToken, getUsername } from "../store/auth";
import { getBaseUrl } from "../store/connection";
import { Ionicons } from "@expo/vector-icons";


import { useState } from "react";
import { requestCall, acceptIncomingCallSession, declineIncomingCallSession,} from "../lib/callSessions";
import ConnectionWindow from "../components/ConnectionWindow";
import { getUsers, getUserStatus, createConversation } from "../lib/api";

import { useUserStatusPolling } from "../hooks/useUserStatusPolling";
import MainPanel from "../components/MainPanel";
import { useIncomingCall } from "../hooks/useIncomingCall";

import { useCallEvents, getMediaClient } from "../hooks/useCallEvents";
import Header from "@/components/Header";




export default function Home() {
  const token = getToken();
  const [users, setUsers] = useState([]);
  const [userStatus, setUserStatus] = useState<Record<string, string>>({});
  const { incomingCall, showIncomingCall, clearIncomingCall } = useIncomingCall();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<{ id: string; username: string } | null>(null);
  const [sideMenuOpen, setIsMenuOpen] = useState(true);

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

  async function openChat(user: { id: string; username: string }) {
    setActiveChatUser(user);
    setActiveConversationId(null);
    setIsMenuOpen(true);

    try {
      console.log("creating dm for", user.id, user.username);
      const data = await createConversation("dm", user.id);
      console.log("conversation created", data);
      setActiveConversationId(data.conversation.id);
    } catch (err) {
      console.log("failed to create conversation", err);
    }
  }

  function toggleMenu() {
    setIsMenuOpen(prev => !prev);
  }


  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{paddingTop: 20}}>
	    {/* <Text>User: {getUsername()}</Text> */}
      {/* <Text>Backend: {getBaseUrl()}</Text> */}
      {/* <Header 
        users={users}
        activeUser={activeChatUser}
        menuOpen={!sideMenuOpen}
        toggleMenu={toggleMenu}
      /> */}
      <ConnectionWindow
        users={users}
        userStatus={userStatus}
        onConnect={connectToUser}
        onMessage={openChat}
        isOpen={sideMenuOpen}
        toggleMenu={toggleMenu}
        activeUser={activeChatUser}
      />
     

      <MainPanel
        visible={!!incomingCall}
        callerName={incomingCall?.callerName ?? ""}
        callId={incomingCall?.callId ?? ""}
        onAccept={acceptIncomingCall}
        onDecline={declineIncomingCall}
        activeConversationId={activeConversationId}
        activeChatUser={activeChatUser}
        onMenuToggle={toggleMenu}
        isOpen={sideMenuOpen}
      />

    </View>
  );
}
