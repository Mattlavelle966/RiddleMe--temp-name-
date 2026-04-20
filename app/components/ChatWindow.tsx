import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { getMessages, sendMessage } from "../lib/api";
import { getSocket } from "../lib/socket";

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
    if (!conversationId) return;
    if (!draft.trim()) return;

    try {
      const data = await sendMessage(conversationId, draft.trim());
      setDraft("");

      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg.id === data.message.id);
        if (alreadyExists) return prev;
        return [...prev, data.message];
      });
    } catch (err) {
      console.log("failed to send message", err);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("joinConversation", { conversationId });

    return () => {
      socket.emit("leaveConversation", { conversationId });
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    if (!socket) return;

    const handleMessageCreated = ({ message }: { message: Message }) => {
      if (message.conversationId !== conversationId) {
        return;
      }

      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg.id === message.id);
        if (alreadyExists) return prev;
        return [...prev, message];
      });
    };

    socket.on("messageCreated", handleMessageCreated);

    return () => {
      socket.off("messageCreated", handleMessageCreated);
    };
  }, [conversationId]);

  if (!activeUser) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>No chat selected</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 12 }}>
        Chat with {activeUser.username}
      </Text>

      {loading ? (
        <Text>Loading messages...</Text>
      ) : (
        <ScrollView style={{ flex: 1, marginBottom: 12 }}>
          {messages.map((message) => {
            const isMine = message.senderId === myUserId;

            return (
              <View
                key={message.id}
                style={{
                  alignSelf: isMine ? "flex-end" : "flex-start",
                  backgroundColor: "#e5e5e5",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 8,
                  maxWidth: "80%",
                }}
              >
                <Text>{message.body}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={{
            backgroundColor: "#007AFF",
            paddingHorizontal: 16,
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
