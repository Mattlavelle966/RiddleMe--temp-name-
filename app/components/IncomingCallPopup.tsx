import { View, Text, TouchableOpacity } from "react-native";
import { darkmode } from "@/assets/styles";

type Props = {
  visible: boolean;
  callerName: string;
  callId: string;
  onAccept: () => void;
  onDecline: () => void;
};

export default function IncomingCallPopup({
  visible,
  callerName,
  callId,
  onAccept,
  onDecline,
}: Props) {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 85,
        right: 20,
        zIndex: 1000,
        minWidth: 260,
        padding: 14,
        borderRadius: 8,
        backgroundColor: "rgba(48, 54, 54, 0.98)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        gap: 10,
      }}
    >
      <Text style={darkmode.label}>Incoming Call</Text>
      <Text style={darkmode.label}>{callerName} is calling you</Text>
      <Text style={darkmode.subHeader}>Call ID: {callId}</Text>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
        <TouchableOpacity
          onPress={onAccept}
          style={[darkmode.buttonSuccess, { flex: 1, minWidth: 0 }]}
        >
          <Text style={darkmode.label}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDecline}
          style={[
            darkmode.buttonSuccess,
            { flex: 1, minWidth: 0, backgroundColor: "#8b3a3a" },
          ]}
        >
          <Text style={darkmode.label}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
