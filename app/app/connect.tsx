import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { router } from "expo-router";
import { setBaseUrl, getBaseUrl } from "../store/connection";

export default function Connect() {
  const [url, setUrl] = useState(getBaseUrl());

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text>Backend URL</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="http://192.168.1.50:3000"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10 }}
      />
      <Button
        title="Continue"
        onPress={() => {
          setBaseUrl(url);
          router.replace("/login");
        }}
      />
    </View>
  );
}
