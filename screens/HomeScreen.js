import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Swiper from "react-native-deck-swiper";
import tailwind from "tailwind-rn";
import Card from "../components/Card";
import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import generateId from "../lib/generatedId";
const statusbarHeight = StatusBar.currentHeight;
const HomeScreen = () => {
  const swiperRef = useRef(null);
  const { user } = useAuth();
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swiped")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUsersIds = passes.length > 0 ? passes : ["test"];
      const swipedUsersIds = swipes.length > 0 ? swipes : ["test"];
      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUsersIds, ...swipedUsersIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };
    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();
    // check if user swiped on you
    getDoc(doc(db, "users", userSwiped.id, "swiped", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          console.log("hooray its a match");
          console.log("making matched db");
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: { [user.uid]: loggedInProfile, [userSwiped.id]: userSwiped },
            timestamp: serverTimestamp(),
            usersMatched: [user.uid, userSwiped.id],
          });
          console.log("mathed db created");
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          console.log("you swiped first");
        }
      }
    );
    setDoc(doc(db, "users", user.uid, "swiped", userSwiped.id), userSwiped);
  };
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "ios" ? 0 : statusbarHeight,
        marginBottom: Platform.OS === "ios" ? 0 : statusbarHeight,
        flex: 1,
      }}
    >
      <Header />
      <View style={tailwind("flex-1 -mt-6")}>
        <Swiper
          ref={swiperRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4fd0e9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
          }}
          renderCard={(card) => <Card card={card} />}
        />
      </View>
      <View style={tailwind("flex flex-row justify-evenly items-center")}>
        <TouchableOpacity
          onPress={() => {
            swiperRef.current.swipeLeft();
          }}
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            swiperRef.current.swipeRight();
          }}
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
