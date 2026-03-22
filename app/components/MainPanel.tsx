import { View, Text, Button } from "react-native";
import { clearAuth } from "../store/auth";
import { router } from "expo-router";
import IncomingCallPopup from "./IncomingCallPopup";


type Props = {
  visible: boolean;
  callerName: string;
  callId: string;
  onAccept: () => void;
  onDecline: () => void;
};

export default function MainPanel({ visible, callerName, callId, onAccept, onDecline,}: Props) {
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        padding: 12,
        gap: 12,
      }}
    >
      <View
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

      </View>

      <View
        style={{
          flex: 1,
          borderWidth: 1,
          padding: 12,
        }}
      >
        <Text>Main Call / Chat Area</Text>
        <Text>Active call UI and chat will go here.</Text>
      </View>

      <Button
        title="Logout"
        onPress={() => {
          clearAuth();
          router.replace("/login");
        }}
      />
    </View>
  );
}
