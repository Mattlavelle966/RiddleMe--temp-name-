import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { getUsername, clearAuth } from "../store/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { darkmode } from "@/assets/styles";
import { ConnectionWindowProps, UserItem } from "../types";

export default function ConnectionWindow({ users, userStatus, isOpen, activeUser, onConnect, onMessage, toggleMenu, isDesktop }: ConnectionWindowProps) {
  
  if (isDesktop) {
      return (
          <LinearGradient
              colors={['rgba(60, 91, 100, 1)', 'rgba(48, 54, 54, 1)']}
              style={darkmode.connectionWindow}
          >
              <View style={darkmode.connectionWindowInner}>
                  <View>
                      {users.map((user) => renderUserCard(user))}
                  </View>
                  <View style={darkmode.logoutTile}>
                      <Text style={darkmode.logoutText}>{getUsername()}</Text>
                      <TouchableOpacity onPress={() => { clearAuth(); router.replace("/login"); }} style={darkmode.buttonSuccessFull}>
                          <Text style={darkmode.label}>Logout</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </LinearGradient>
      );
  }

  return (
    <View style={darkmode.connectionCard} pointerEvents={isOpen ? "auto" : "none"}>
      {isOpen && (
        <>
          <LinearGradient 
            colors={['rgba(60, 91, 100, 1)', 'rgba(48, 54, 54, 1)']} 
            style={{ width: "70%", height: "100%", paddingTop: 50 }}
          >
            <TouchableOpacity onPress={toggleMenu} style={darkmode.menuToggle}>
              <Ionicons name="menu-outline" size={40} color='white' />
            </TouchableOpacity>

            <View style={darkmode.connectionWindowInner}>
              <View>
                {users.map((user) => renderUserCard(user))}
              </View>
              <View style={darkmode.logoutTile}>
                <Text style={darkmode.logoutText}>{getUsername()}</Text>
                <TouchableOpacity onPress={() => { clearAuth(); router.replace("/login"); }} style={darkmode.buttonSuccessFull}>
                  <Text style={darkmode.label}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
          
          <TouchableOpacity activeOpacity={1} onPress={toggleMenu} style={{ width: "30%", height: "100%" }}>
            <LinearGradient 
              colors={['rgba(28, 32, 32, 1)', 'rgba(48, 54, 54, 0.5)']} 
              start={{ x: 0, y: 0.5 }} 
              end={{ x: 1, y: 0.5 }} 
              style={{ flex: 1 }} 
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  function renderUserCard(user: UserItem) {
    const status = userStatus[user.id] || "unknown";
    const dotColor = status === "online" ? "#72D272" : status === "offline" ? "#808080" : "#D27272";
    return (
      <TouchableOpacity onPress={() => onMessage(user)} key={user.id} style={darkmode.userCard}>
        <View style={[darkmode.rowBetween, { width: "100%" }]}>
          <View style={[darkmode.row, { alignItems: "center" }]}>
            <View style={[darkmode.userStatusDot, { backgroundColor: dotColor, marginRight: 8 }]} />
            <Text style={darkmode.label}>{user.username}</Text>
          </View>
          <TouchableOpacity onPress={() => onConnect(user.id)} style={darkmode.buttonSuccessXS}>
            <Ionicons name="call-outline" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}