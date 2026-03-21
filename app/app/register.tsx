import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Link, router } from "expo-router";
import { api } from "../lib/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    try {
      setError("");
      await api("/api/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      router.replace("/login");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text>Register</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10 }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10 }}
      />
      {!!error && <Text>{error}</Text>}
      <Button title="Register" onPress={submit} />
      <Link href="/login">Back to login</Link>
    </View>
  );
}
