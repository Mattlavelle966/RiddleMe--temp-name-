import { View, Text, Button } from "react-native";

type Props = {
  visible: boolean;
  callerName: string;
  callId: string;
  onAccept: () => void;
  onDecline: () => void;
};

export default function IncomingCallPopup({visible,callerName,callId,onAccept,onDecline,}: Props) {
  if (!visible) return null;

  return (
    <View
      style={{
        borderWidth: 1,
        padding: 12,
        gap: 8,
      }}
    >
      <Text>Incoming Call</Text>
      <Text>{callerName} is calling you</Text>
      <Text>Call ID: {callId}</Text>
      <Button title="Accept" onPress={onAccept} />
      <Button title="Decline" onPress={onDecline} />
    </View>
  );
}
