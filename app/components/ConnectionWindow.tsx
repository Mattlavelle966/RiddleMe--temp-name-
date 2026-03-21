import { View, Text, Button } from "react-native";

type UserItem = {
  id: string;
  username: string;
};

type Props = {
  users: UserItem[];
  userStatus: Record<string, string>;
  onCheckStatus: (userId: string) => void;
  onConnect: (userId: string) => void;
};

export default function ConnectionWindow({ users,userStatus,onCheckStatus,onConnect,}: Props) {
  return (
    <View style={{ marginTop: 20, gap: 8 }}>
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

            <Button
              title="Check Status"
              onPress={() => onCheckStatus(user.id)}
            />

            <Button
              title="Connect"
              onPress={() => onConnect(user.id)}
            />
          </View>
        );
      })}
    </View>
  );
}
