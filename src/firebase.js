// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTNJFsMC3UR4lwW4L77COPXXf3QsCQZ8g",
  authDomain: "charaad2025.firebaseapp.com",
  projectId: "charaad2025",
  storageBucket: "charaad2025.firebasestorage.app",
  messagingSenderId: "130243431253",
  appId: "1:130243431253:web:7444f189cf9a5efaa3fddc",
  measurementId: "G-RQ57F5BJVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (بۆ هەڵگرتنی داتا)
export const db = getFirestore(app);

// Initialize Auth (بۆ یوسەرەکان)
export const auth = getAuth(app);

export default app;