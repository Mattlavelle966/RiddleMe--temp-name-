import { View, Text, TouchableOpacity } from "react-native";
import { createConversation } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";

type UserItem = {
  id: string;
  username: string;
};

type Props = {
  users: UserItem[];
  userStatus: Record<string, string>;
  onConnect: (userId: string) => void;
  onMessage: (user: UserItem) => void;
};

export default function ConnectionWindow({ users,userStatus,onConnect,onMessage}: Props) {
  return (
    <View style={{ 
    width: "20%",
    minWidth: 220,
    borderRightWidth: 1,
    paddingRight: 12,
    gap: 8,
    }}>
      <Text>Users</Text>

      {users.map((user) => {
        const status = userStatus[user.id] || "unknown";
        const dotColor =
          status === "online"
            ? "green"
            : status === "offline"
            ? "red"
            : "gray";

        return (
          <View
            key={user.id}
            style={{ borderWidth: 1, padding: 10, marginTop: 8, gap: 8 }}
          >
            <Text>Username: {user.username}</Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: dotColor,
                }}
              />
              <Text>{status}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => onConnect(user.id)}>
                <Ionicons name="call-outline" size={24} color="blue" />
              </TouchableOpacity>
              {/*Make a function that should create a converstation if it doesn't
                already exist, then connect to it, and display messages */}
              <TouchableOpacity onPress={() => onMessage(user)}>
                <Ionicons name="chatbubble-outline" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}
