import { View, Text, Button } from "react-native";
import { clearAuth } from "../store/auth";
import { router } from "expo-router";
import IncomingCallPopup from "./IncomingCallPopup";
import ChatWindow from "./ChatWindow";
import { darkmode } from "../assets/styles"

type ChatUser = {
  id: string;
  username: string;
};

type Props = {
  visible: boolean;
  callerName: string;
  callId: string;
  onAccept: () => void;
  onDecline: () => void;
  isOpen: boolean;
  activeConversationId: string | null;
  activeChatUser: ChatUser | null;
  onMenuToggle: () => void;
};

export default function MainPanel({
  visible, 
  callerName, 
  callId, 
  onAccept, 
  onDecline,
  isOpen,
  activeConversationId, 
  activeChatUser,
  onMenuToggle
}: Props) {
  return (
    <View>
      {/* <View
        style={{
          borderWidth: 1,
          padding: 12,
          minHeight: 100,
        }}
      >
        <Text>Popup Area</Text>
          <IncomingCallPopup
          visible={visible}
          callerName={callerName}
          callId={callId}
          onAccept={onAccept}
          onDecline={onDecline}
        />

      </View> */}

      <ChatWindow 
        conversationId={activeConversationId} 
        activeUser={activeChatUser} 
        onMenuToggle={onMenuToggle}
        isOpen={isOpen}
      />

    </View>
  );
}
