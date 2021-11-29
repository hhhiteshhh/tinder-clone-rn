// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB6AO6JtBw45BqlzeEZUkV5cTe8LuUGJew",
  authDomain: "tinder-clone-ebeb8.firebaseapp.com",
  projectId: "tinder-clone-ebeb8",
  storageBucket: "tinder-clone-ebeb8.appspot.com",
  messagingSenderId: "929069127873",
  appId: "1:929069127873:web:19d9ca0d6750adef731c40",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
