import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { api } from "../lib/api";
import { darkmode } from "../assets/styles";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
	const [hidePassword, hide] = useState(true);

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
			<View style={[
        darkmode.well,
        {display: "flex", height: 400, justifyContent: 'space-between'}
        ]}>


				<Text style={[darkmode.header, {marginBottom: 14}]}>Register</Text>
				
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
					<Text style={darkmode.label}>Register</Text>
				</TouchableOpacity>
      	<Link style={[darkmode.link, {marginLeft: "auto", marginRight: "auto"}]} href="/login">Back to login</Link>

			</View>

			
    </View>
  );
}
