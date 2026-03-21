import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Link, router } from "expo-router";
import { api } from "../lib/api";
import { setAuth } from "../store/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    try {
      setError("");
      const data = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setAuth(data.token, username);
      router.replace("/home");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text>Login</Text>
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
      <Button title="Login" onPress={submit} />
      <Link href="/register">Register</Link>
      <Link href="/connect">Change backend</Link>
    </View>
  );
}
