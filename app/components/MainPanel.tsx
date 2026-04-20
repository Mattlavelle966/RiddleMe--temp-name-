import { View } from "react-native";
import ChatWindow from "./ChatWindow";
import { MainPanelProps } from "../types";
import IncomingCallPopup from "./IncomingCallPopup";
export default function MainPanel({ visible, callerName, callId, onAccept, onDecline, isOpen, activeConversationId, activeChatUser, onMenuToggle, isDesktop }: MainPanelProps) {
  return (
    <View style={{ flex: 1 }}> 
        <View
          style={{
            borderWidth: 1,
            padding: 12,
            minHeight: 100,
          }}
        >
          <IncomingCallPopup
            visible={visible}
            callerName={callerName}
            callId={callId}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        </View>
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
