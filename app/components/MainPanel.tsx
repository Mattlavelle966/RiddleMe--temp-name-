import { View } from "react-native";
import ChatWindow from "./ChatWindow";
import { MainPanelProps } from "../types";

export default function MainPanel({ visible, callerName, callId, onAccept, onDecline, isOpen, activeConversationId, activeChatUser, onMenuToggle, isDesktop }: MainPanelProps) {
  return (
    <View style={{ flex: 1 }}> 
      <ChatWindow 
        conversationId={activeConversationId} 
        activeUser={activeChatUser} 
        onMenuToggle={onMenuToggle}
        isOpen={isOpen}
        isDesktop={isDesktop}
      />
    </View>
  );
}