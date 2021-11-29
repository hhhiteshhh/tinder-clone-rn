import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import tailwind from "tailwind-rn";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
const statusbarHeight = StatusBar.currentHeight;

const ModalScreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState();
  const [job, setJob] = useState();
  const [age, setAge] = useState();
  const navigation = useNavigation();
  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Update your Profile",
      headerStyle: { backgroundColor: "#ff5864" },
      headerTitleStyle: { color: "white" },
      headerTintColor: "white",
    });
  }, []);
  return (
    <View
      style={[
        tailwind("flex-1 items-center"),
        { marginBottom: Platform.OS === "ios" ? 0 : statusbarHeight },
      ]}
    >
      <Image
        style={tailwind("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />
      <Text style={tailwind("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>
      <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 1: The Profile Picture
      </Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        placeholder={"Enter a profile pic URL"}
        style={tailwind("text-center text-xl pb-2")}
      />
      <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={(text) => setJob(text)}
        placeholder={"Enter your occupation"}
        style={tailwind("text-center text-xl pb-2")}
      />
      <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 3: The Age
      </Text>
      <TextInput
        maxLength={2}
        value={age}
        keyboardType="numeric"
        onChangeText={(text) => setAge(text)}
        placeholder={"Enter your age"}
        style={tailwind("text-center text-xl pb-2")}
      />
      <TouchableOpacity
        disabled={incompleteForm}
        onPress={() => updateUserProfile()}
        style={[
          tailwind("w-64 p-3 rounded-xl absolute bottom-0"),
          incompleteForm ? tailwind("bg-gray-400") : tailwind("bg-red-400"),
        ]}
      >
        <Text style={tailwind("text-center text-xl text-white")}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
