import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { setBaseUrl, getBaseUrl } from "../store/connection";
import { darkmode } from "../assets/styles";

export default function Connect() {
  const [url, setUrl] = useState(getBaseUrl());

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={darkmode.label}>Backend URL</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="http://192.168.1.50:3000"
        autoCapitalize="none"
        style={darkmode.textInput}
      />
      <TouchableOpacity
        onPress={() => {
          setBaseUrl(url);
          router.replace("/login");
        }}
		    style={[darkmode.buttonSuccess, {marginLeft: 0, marginRight: 0}]}
      >
        <Text style={darkmode.label}>Continue</Text>
	    </TouchableOpacity>
    </View>
  );
}
