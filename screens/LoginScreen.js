import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tailwind from "tailwind-rn";
const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <View style={[tailwind("flex-1"), { opacity: 1 }]}>
      <ImageBackground
        resizeMode="cover"
        source={{ uri: "https://tinder.com/static/tinder.png" }}
        style={tailwind("flex-1")}
      >
        <TouchableOpacity
          disabled={loading}
          onPress={signInWithGoogle}
          style={[
            tailwind("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={"#ff5864"} />
          ) : (
            <Text style={tailwind("font-semibold text-center")}>
              Sign in & get swiping
            </Text>
          )}
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
