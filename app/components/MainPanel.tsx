import { View } from "react-native";
import ChatWindow from "./ChatWindow";
import IncomingCallPopup from "./IncomingCallPopup";
import { MainPanelProps } from "../types";

export default function MainPanel({
  visible,
  callerName,
  callId,
  onAccept,
  onDecline,
  isOpen,
  activeConversationId,
  activeChatUser,
  onMenuToggle,
  isDesktop,
}: MainPanelProps) {
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ChatWindow
        conversationId={activeConversationId}
        activeUser={activeChatUser}
        onMenuToggle={onMenuToggle}
        isOpen={isOpen}
        isDesktop={isDesktop}
      />

      <IncomingCallPopup
        visible={visible}
        callerName={callerName}
        callId={callId}
        onAccept={onAccept}
        onDecline={onDecline}
      />
    </View>
  );
}
