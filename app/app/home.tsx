import { View, useWindowDimensions } from "react-native";
import { Redirect } from "expo-router";
import { getToken } from "../store/auth";
import { useState } from "react";
import { requestCall, acceptIncomingCallSession, declineIncomingCallSession } from "../lib/callSessions";
import ConnectionWindow from "../components/ConnectionWindow";
import { getUsers } from "../lib/api";
import { useUserStatusPolling } from "../hooks/useUserStatusPolling";
import MainPanel from "../components/MainPanel";
import { useIncomingCall } from "../hooks/useIncomingCall";
import { useCallEvents, getMediaClient } from "../hooks/useCallEvents";
import { createConversation } from "../lib/api";
import { UserItem } from "../types";
import { darkmode } from "../assets/styles";

export default function Home() {
  const token = getToken();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userStatus, setUserStatus] = useState<Record<string, string>>({});
  const { incomingCall, showIncomingCall, clearIncomingCall } = useIncomingCall();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<UserItem | null>(null);
  
  // Desktop Layout Detection
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [sideMenuOpen, setIsMenuOpen] = useState(true);

  useUserStatusPolling(users, token, setUserStatus);
  useCallEvents(token, showIncomingCall, clearIncomingCall, setUsers, getUsers);

  async function connectToUser(userId: string) {
    const result = await requestCall(userId);
    if(!result?.ok){ return; }
  }

  async function acceptIncomingCall() {
    const mediaClient = getMediaClient();
    if (!incomingCall || !mediaClient) return;
    await acceptIncomingCallSession(mediaClient, incomingCall.callId);
    clearIncomingCall();
  }

  async function declineIncomingCall() {
    const mediaClient = getMediaClient();
    if (!incomingCall || !mediaClient) return;
    await declineIncomingCallSession(mediaClient, incomingCall.callId);
    clearIncomingCall();
  }

  async function openChat(user: UserItem) {
    setActiveChatUser(user);
    setActiveConversationId(null);
    if (!isDesktop) setIsMenuOpen(true); 

    try {
      const data = await createConversation("dm", user.id);
      setActiveConversationId(data.conversation.id);
    } catch (err) {
      console.log("failed to create conversation", err);
    }
  }

  function toggleMenu() {
    setIsMenuOpen(prev => !prev);
  }

  if (!token) return <Redirect href="/login" />;

  if (isDesktop) {
    return (
      <View style={darkmode.desktopLayout}>
        <View style={darkmode.sidebarDesktop}>
          <ConnectionWindow
            users={users}
            userStatus={userStatus}
            onConnect={connectToUser}
            onMessage={openChat}
            isOpen={true}
            toggleMenu={toggleMenu}
            activeUser={activeChatUser}
            isDesktop={isDesktop}
          />
        </View>
        <View style={darkmode.mainDesktop}>
          <MainPanel
            visible={!!incomingCall}
            callerName={incomingCall?.callerName ?? ""}
            callId={incomingCall?.callId ?? ""}
            onAccept={acceptIncomingCall}
            onDecline={declineIncomingCall}
            activeConversationId={activeConversationId}
            activeChatUser={activeChatUser}
            onMenuToggle={toggleMenu}
            isOpen={true}
            isDesktop={isDesktop}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={darkmode.homeContainer}>
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
        isDesktop={isDesktop}
      />
      
      <ConnectionWindow
        users={users}
        userStatus={userStatus}
        onConnect={connectToUser}
        onMessage={openChat}
        isOpen={sideMenuOpen}
        toggleMenu={toggleMenu}
        activeUser={activeChatUser}
        isDesktop={isDesktop}
      />
    </View>
  );
}