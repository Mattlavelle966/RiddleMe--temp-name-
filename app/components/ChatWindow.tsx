import { useEffect, useState,  } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { darkmode } from "@/assets/styles";
import { Ionicons } from "@expo/vector-icons";
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
  isOpen: boolean;
  onMenuToggle: () => void;
};

export default function ChatWindow({
  conversationId,
  activeUser,
  isOpen,
  onMenuToggle,
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
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
		<TouchableOpacity onPress={onMenuToggle} style={!isOpen && {display:"none"}}>
          <Ionicons name="menu-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text>No chat selected</Text>
      </View>
    );
  }

  return (
    <View style={{display: 'flex', height: '100%', justifyContent: 'space-between'}}> 
      <LinearGradient
        colors={['rgba(60, 91, 100, 1)', 'rgba(48, 54, 54, 1)']}
        style={darkmode.headerBackground}
        >
          
        <TouchableOpacity onPress={onMenuToggle} style={isOpen ? {zIndex: 999} : {zIndex: 995}}>
          <Ionicons name="menu-outline" size={30} color="white" />
        </TouchableOpacity>

        <Text style={darkmode.header}>
          {activeUser.username}
        </Text>

        <View style={darkmode.buttonSuccessSmall}>
          <Ionicons name="call-outline" size={30} color="white" />
        </View>

      </LinearGradient>

      <View style={{width: '100%'}}>
        <ScrollView style={{ display: 'flex', flexDirection: 'column-reverse', width: '95%', marginLeft:'auto', marginRight:'auto'}} 
        contentContainerStyle={{ gap: 8 }}>
        
          {loading ? (<Text>Loading...</Text>) : messages.length === 0 ? (<Text>No messages yet</Text>) 
          : (
            messages.map((message) => {return (
                <View key={message.id}
                  style={[(message.senderId === activeUser.id ? darkmode.messageIn : darkmode.messageOut),
                    { maxWidth: 240, padding: 10, alignSelf: 'flex-start' }]}
                >

                  <Text style={{color: '#fff'}}>{message.body}</Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={darkmode.messageBox}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor="#FFF"
            style={darkmode.messageInputField}
          >
          </TextInput>
          <TouchableOpacity
            onPress={handleSend}
            style={darkmode.sendButton}
          >
            <Ionicons name="send-outline" size={20} color="white"/>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
