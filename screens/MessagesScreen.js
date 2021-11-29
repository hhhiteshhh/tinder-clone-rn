import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import tailwind from "tailwind-rn";
import ChatHeader from "../components/ChatHeader";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
const statusbarHeight = StatusBar.currentHeight;

const MessagesScreen = (route) => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      message: input,
    });
    setInput("");
  };
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "matches", matchDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) =>
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
  }, [matchDetails, db]);
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "ios" ? 0 : statusbarHeight,
        marginBottom: Platform.OS === "ios" ? 0 : statusbarHeight,
        flex: 1,
      }}
    >
      <ChatHeader
        callEnabled
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tailwind("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
          <FlatList
            data={messages}
            inverted={-1}
            style={tailwind("pl-4")}
            keyExtractor={(item) => {
              item.id;
            }}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={tailwind(
            "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            style={tailwind("h-10 text-lg")}
            placeholder="Send Message..."
            onChangeText={(text) => setInput(text)}
            onSumbitEditing={sendMessage}
            value={input}
          />
          <Button title="send" color="#ff5864" onPress={() => sendMessage()} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagesScreen;
