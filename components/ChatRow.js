import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import tailwind from "tailwind-rn";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  const [lastMessage, setLastMessage] = useState("");
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "matches", matchDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
    );
  }, [matchDetails, db]);
  return (
    <TouchableOpacity
      style={[
        tailwind(
          "flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"
        ),
        styles.cardShadow,
      ]}
      onPress={() => {
        navigation.navigate("Messages", {
          matchDetails,
        });
      }}
    >
      <Image
        source={{ uri: matchedUserInfo?.photoURL }}
        style={tailwind("rounded-full h-16 w-16 mr-4")}
      />
      <View>
        <Text style={tailwind("text-lg font-bold")}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || "Say Hi"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
