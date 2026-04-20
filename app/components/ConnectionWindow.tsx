import { View, Text, TouchableOpacity, Button } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { createConversation } from "../lib/api";
import {  getToken, getUsername } from "../store/auth";
import { getBaseUrl } from "../store/connection";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { clearAuth } from "../store/auth";
import { darkmode } from "@/assets/styles";

type UserItem = {
  id: string;
  username: string;
};

type Props = {
  users: UserItem[];
  userStatus: Record<string, string>;
  isOpen: boolean;
  activeUser: UserItem | null;
  toggleMenu: () => void;
  onConnect: (userId: string) => void;
  onMessage: (user: UserItem) => void;
};

export default function ConnectionWindow({ users,userStatus,isOpen,activeUser,onConnect,onMessage,toggleMenu}: Props) {
  return (
    <View style={[darkmode.connectionCard, !isOpen && {height:"100%"}]}>
      <View style={{width:"40%"}}>
        <TouchableOpacity onPress={() => toggleMenu()} 
        style={[{position:"absolute", zIndex:999}, !isOpen && {right: 10, top: 10}, (activeUser && isOpen) && {display:"none"}]}
        >
          <Ionicons name="menu-outline" size={40} color='white' />
        </TouchableOpacity>
        <View style={[darkmode.connectionBackdrop, isOpen && {display:"none"}]}/>
        <LinearGradient 
          colors={['rgba(60, 91, 100, 1)', 'rgba(60, 91, 100, 0)']}
          style={[darkmode.connectionWindow, isOpen && {display:"none"}, {height:"100%"}]}
          >
          <View style={{display:"flex", height:"100%", justifyContent: "space-between", paddingBottom: 40}}>
            <View>
              {users.map((user) => {
                const status = userStatus[user.id] || "unknown";
                const dotColor =
                status === "online" ? "#72D272" : status === "offline" ? "#808080" : "#D27272";
                
                return (
                  
                  <TouchableOpacity onPress={() => onMessage(user)} key={user.id} style={[darkmode.userCard]}>
                    <View style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", width:"100%"}}>
                      <View style={{display:"flex", flexDirection:"row", alignItems:"center", gap: 5}}>
                        <View style={{width: 12,height: 12,borderRadius: 6,backgroundColor: dotColor,}}/>
                        <Text style={{ color:"#FFF"}}>{user.username}</Text>
                      </View>

                      <TouchableOpacity onPress={() => onConnect(user.id)} style={darkmode.buttonSuccessXS}>
                        <Ionicons name="call-outline" size={12} color="white" />
                      </TouchableOpacity>
                    </View>
                    <View>
                      {/*Make a function that should create a converstation if it doesn't
                        already exist, then connect to it, and display messages */}
                      {/* <TouchableOpacity onPress={() => onMessage(user)}>
                        <Ionicons name="chatbubble-outline" size={24} color="green" />
                        </TouchableOpacity> */}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={darkmode.logoutTile}>
              <Text style={{fontSize:20, color:"#fff"}}>{getUsername()}</Text>
              <TouchableOpacity onPress={() => { clearAuth(); router.replace("/login"); }} style={darkmode.buttonSuccess}>
                <Text style={{color: "#fff"}}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
          

        </LinearGradient>
        
      </View>
      <View style={{width:"60%"}}>
        <LinearGradient 
          colors={['rgba(28, 32, 32, 1)', 'rgba(48, 54, 54, 0.5)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[darkmode.connectionWindow, isOpen && {display:"none"}, {height:"100%"}]}
          />
      </View>
    </View>
  );
}
