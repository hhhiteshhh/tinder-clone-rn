import React from "react";
import {
  SafeAreaView,
  View,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ChatHeader from "../components/ChatHeader";
import ChatList from "../components/ChatList";
const statusbarHeight = StatusBar.currentHeight;

const ChatScreen = () => {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "ios" ? 0 : statusbarHeight,
        marginBottom: Platform.OS === "ios" ? 0 : statusbarHeight,
        flex: 1,
      }}
    >
      <ChatHeader title={"Chat"} />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
