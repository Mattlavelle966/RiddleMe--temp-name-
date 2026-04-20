import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { api } from "../lib/api";
import { setAuth } from "../store/auth";
import { darkmode } from "../assets/styles";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hidePassword, hide] = useState(true);

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
      <View style={[
        darkmode.well,
        {display: "flex", height: 400, justifyContent: 'space-between'}
        ]}>
        <View>
          <Text style={darkmode.header}>Log in</Text>
          <View style={{display: "flex", flexDirection: "row"}}>
            <Text style={darkmode.subHeader}>Or register for an </Text>
            <Link style={darkmode.link} href="/register">account.</Link>
          </View>
        </View>
        <View>
          <View>
            <Text style={darkmode.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={darkmode.textInput}
            />
          </View>
          <View style={{marginTop: 30}}>
            <View style={{display: "flex", flexDirection: "row"}}>
              <Text style={darkmode.label}>Password</Text>
              <Text style={[darkmode.link, {marginLeft: 'auto'}]} onPress={() => hide(!hidePassword)}>Show</Text>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              style={darkmode.textInput}
            />
            {!!error && <Text style={darkmode.error}>{error}</Text>}

          </View>
        </View>
        <TouchableOpacity 
          onPress={submit} 
          style={[darkmode.buttonSuccess, {width: "100%", marginTop: 10}]}
        > 
          <Text style={darkmode.label}>Log in</Text>
        </TouchableOpacity>

        <Link style={[darkmode.link, {marginLeft: "auto", marginRight: "auto"}]} href="/connect">Change backend URL</Link>
      </View>
    </View>
  );
}
