import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tailwind from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const Header = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={tailwind("flex-row items-center justify-between px-5 pt-2")}>
      <TouchableOpacity
        onPress={() => {
          logout();
        }}
      >
        <Image
          source={{ uri: user?.photoURL }}
          style={tailwind("h-10 w-10 rounded-full")}
        />
      </TouchableOpacity>
          <TouchableOpacity
          onPress={() => {navigation.navigate("Modal")}}
          >
        <Image
          source={require("../assets/images/logo.png")}
          style={tailwind("h-14 w-12")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Chat");
        }}
      >
        <Ionicons name="chatbubbles-sharp" size={30} color={"#ff5864"} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
