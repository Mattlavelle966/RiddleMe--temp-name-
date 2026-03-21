import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { clearAuth, getToken, getUsername } from "../store/auth";
import { getBaseUrl } from "../store/connection";

export default function Home() {
  if (!getToken()) {
    router.replace("/login");
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text>Home</Text>
      <Text>User: {getUsername()}</Text>
      <Text>Backend: {getBaseUrl()}</Text>
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
