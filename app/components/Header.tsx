import { darkmode } from "@/assets/styles";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type ChatUser = {
  id: string;
  username: string;
};

type Props = {
  users: ChatUser[];
  activeUser: ChatUser | null;
  menuOpen: boolean;
  toggleMenu: () => void;
};

export default function Header({users, activeUser, menuOpen, toggleMenu}: Props) {


  if (!activeUser) {
    return (
      <View/>
    )
  }

  return (
		<View>
      {(activeUser.username && !menuOpen) && ( 
        <LinearGradient
          colors={['rgba(60, 91, 100, 1)', 'rgba(48, 54, 54, 1)']}
          style={darkmode.headerBackground}
          >
            
          <TouchableOpacity onPress={toggleMenu} style={{zIndex: 999}}>
            <Ionicons name="menu-outline" size={30} color="white" />
          </TouchableOpacity>

          <Text style={darkmode.header}>
            {activeUser.username}
          </Text>
          <View style={darkmode.buttonSuccessSmall}>
            <Ionicons name="call-outline" size={30} color="white" />
          </View>
        </LinearGradient>
      )}
		</View>
	);
}