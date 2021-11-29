import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { onSnapshot, collection, query, where } from "@firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import tailwind from "tailwind-rn";
import ChatRow from "./ChatRow";

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        (snapshot) => {
          setMatches(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      );
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    fetchChatData();
  }, [user]);
  return loading ? (
    <ActivityIndicator color={"#ff5864"} />
  ) : matches.length > 0 ? (
    <FlatList
      style={tailwind("h-full")}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tailwind("p-5")}>
      <Text style={tailwind("text-center text-lg")}>
        No matches at the moment
      </Text>
    </View>
  );
};

export default ChatList;
