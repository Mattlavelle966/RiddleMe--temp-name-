import { View, Text, Button } from "react-native";
import { Redirect, router } from "expo-router";
import { clearAuth, getToken, getUsername } from "../store/auth";
import { getBaseUrl } from "../store/connection";
import { useEffect, useState } from "react";
import { connectSocket } from "../lib/socket";
import { connectToUserSocket } from "../lib/socket";
import ConnectionWindow from "../components/ConnectionWindow";
import { getUsers, getUserStatus } from "../lib/api";
import { MediaClient } from "../lib/mediaClient";

let mediaClient: MediaClient | null = null;

export default function Home() {
  const token = getToken();
  const [users, setUsers] = useState([]);
  const [userStatus, setUserStatus] = useState<Record<string, string>>({});

  async function checkStatus(userId: string) {
    try {
      const data = await getUserStatus(userId);

      setUserStatus((prev) => ({
        ...prev,
        [userId]: data.online ? "online" : "offline",
      }));
    } catch {
      setUserStatus((prev) => ({
        ...prev,
        [userId]: "error",
      }));
    }
  }

  async function connectToUser(userId: string) {
    const result = await connectToUserSocket(userId); // signaling
    if (!result?.ok) {
      console.log("Call Failed");
      return;
    };

    mediaClient = new MediaClient();
    
    mediaClient.onRemoteStream = ({ stream, producerId }) => {
      console.log("remote stream arrived", producerId, stream);
      const audio = document.createElement("audio");
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.controls = true;
      audio.muted = false;

      document.body.appendChild(audio);

      audio.play().then(() => {
        console.log("audio playing");
      }).catch((err) => {
        console.log("audio play failed", err);
      });
    };

    console.log("mic init")
    await mediaClient.init();
    console.log("startMic")
    await mediaClient.startMic();
    console.log("begin consumption")
    await mediaClient.consumeExistingProducers();
  }

  useEffect(() => {
    if (token) {
      connectSocket();
      getUsers().then((data) => setUsers(data.users));
    }
  }, [token]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text>Home</Text>
      <Text>User: {getUsername()}</Text>
      <Text>Backend: {getBaseUrl()}</Text>

      <ConnectionWindow
        users={users}
        userStatus={userStatus}
        onCheckStatus={checkStatus}
        onConnect={connectToUser}
      />

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
