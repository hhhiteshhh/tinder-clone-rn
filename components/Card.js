import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import tailwind from "tailwind-rn";

const Card = ({ card }) => {
  return card ? (
    <View
      key={card?.id}
      style={[tailwind("bg-white h-3/4 rounded-xl relative")]}
    >
      <Image
        // resizeMode="contain"
        source={{ uri: card?.photoURL }}
        style={tailwind("h-full w-full rounded-xl absolute top-0")}
      />
      <View
        style={[
          tailwind(
            "bg-white w-full h-20 absolute bottom-0 items-center justify-between flex-row px-6 py-2 rounded-b-xl"
          ),
          styles.cardShadow,
        ]}
      >
        <View>
          <Text style={tailwind("text-xl font-bold")}>{card?.displayName}</Text>
          <Text>{card?.occupation}</Text>
        </View>
        <Text style={tailwind("text-2xl font-bold")}>{card?.age}</Text>
      </View>
    </View>
  ) : (
    <View
      style={[
        tailwind(
          "relative bg-white h-3/4 rounded-xl justify-center items-center"
        ),
        styles.cardShadow,
      ]}
    >
      <Text style={tailwind("font-bold pb-5")}>No more Profiles</Text>
      <Image
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/6gb" }}
        height={100}
        width={100}
        style={tailwind("h-20 w-full")}
      />
    </View>
  );
};

export default Card;

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
