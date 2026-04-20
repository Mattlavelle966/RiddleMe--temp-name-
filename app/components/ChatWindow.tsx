import { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { darkmode } from "@/assets/styles";
import { Ionicons } from "@expo/vector-icons";
import { getMessages, sendMessage } from "../lib/api";
import { ChatWindowProps, Message } from "../types";

export default function ChatWindow({ conversationId, activeUser, isOpen, onMenuToggle, isDesktop }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadMessages() {
    if (!conversationId) { setMessages([]); return; }
    try {
      setLoading(true);
      const data = await getMessages(conversationId);
      setMessages(data.messages ?? []);
    } finally { setLoading(false); }
  }

  async function handleSend() {
    if (!conversationId || !draft.trim()) return;
    try {
      const data = await sendMessage(conversationId, draft.trim());
      setDraft("");
      await loadMessages();
    } catch (err) {}
  }

  useEffect(() => { loadMessages(); }, [conversationId]);

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
      <View style={darkmode.chatContainer}>
        <LinearGradient colors={['rgba(60, 91, 100, 1)', 'rgba(48, 54, 54, 1)']} style={darkmode.headerBackground}>
          {!isDesktop && !isOpen && (
            <TouchableOpacity onPress={onMenuToggle}>
              <Ionicons name="menu-outline" size={30} color="white" />
            </TouchableOpacity>
          )}
        </LinearGradient>
        <View style={darkmode.chatEmpty}>
          <Text style={darkmode.label}>No chat selected</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={darkmode.chatContainer}> 
      <LinearGradient colors={['rgba(60, 91, 100, 1)', 'rgba(48, 54, 54, 1)']} style={darkmode.headerBackground}>
        
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          {!isDesktop && !isOpen && (
            <TouchableOpacity onPress={onMenuToggle} style={{ zIndex: 995 }}>
              <Ionicons name="menu-outline" size={30} color="white" />
            </TouchableOpacity>
          )}
          <Text style={darkmode.header}>{activeUser.username}</Text>
        </View>

        <View style={darkmode.buttonSuccessSmall}>
          <Ionicons name="call-outline" size={24} color="white" />
        </View>

      </LinearGradient>

      <View style={darkmode.w100}>
        <ScrollView style={darkmode.chatScroll} contentContainerStyle={{ gap: 8 }}>
          {loading ? (<Text style={darkmode.label}>Loading...</Text>) : messages.length === 0 ? (<Text style={darkmode.label}>No messages yet</Text>) 
          : (
            messages.map((message) => (
                <View key={message.id} style={[
                  message.senderId === activeUser.id ? darkmode.messageIn : darkmode.messageOut, 
                  darkmode.messageBubble,
                  isDesktop && { maxWidth: '60%', padding: 15 } 
                ]}>
                  <Text style={[darkmode.messageText, isDesktop && { fontSize: 25 }]}>
                    {message.body}
                  </Text>
                </View>
            ))
          )}
        </ScrollView>

        <View style={darkmode.messageBox}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor="#FFF"
            style={darkmode.messageInputField}
          />
          <TouchableOpacity onPress={handleSend} style={darkmode.sendButton}>
            <Ionicons name="send-outline" size={20} color="white"/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}