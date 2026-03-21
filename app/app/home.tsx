import { View, Text, Button } from "react-native";
import { Redirect, router } from "expo-router";
import { clearAuth, getToken, getUsername } from "../store/auth";
import { getBaseUrl } from "../store/connection";
import { useEffect } from "react";
import { connectSocket } from "../lib/socket";

export default function Home() {
  const token = getToken();


  useEffect(() => {
    if (token) {
      connectSocket();
    }
  }, [token]);

  if (!token) {
    return <Redirect href="/login" />;
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
