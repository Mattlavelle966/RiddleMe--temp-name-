import { useEffect, useState,  } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { getMessages, sendMessage } from "../lib/api";
import { getUserId } from "../store/auth";

type ChatUser = {
  id: string;
  username: string;
};

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: number;
};

type Props = {
  conversationId: string | null;
  activeUser: ChatUser | null;
};

export default function ChatWindow({
  conversationId,
  activeUser,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const myUserId = null;

  async function loadMessages() {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getMessages(conversationId);
      setMessages(data.messages ?? []);
    } catch (err) {
      console.log("failed to load messages", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!conversationId || !draft.trim()) {
      return;
    }

    try {
      await sendMessage(conversationId, draft.trim());
      setDraft("");
      await loadMessages();
    } catch (err) {
      console.log("failed to send message", err);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  if (!conversationId || !activeUser) {
    return (
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No chat selected</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Chat with {activeUser.username}
      </Text>

      <ScrollView
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
        }}
        contentContainerStyle={{ gap: 8 }}
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : messages.length === 0 ? (
          <Text>No messages yet</Text>
        ) : (
          messages.map((message) => {
            return (
              <View
                key={message.id}
                style={{
                  maxWidth: "80%",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 4,
                    fontWeight: "600",
                  }}
                >
                </Text>

                <Text>{message.body}</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message"
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
