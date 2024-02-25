// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG8Jy_z217rKGk7dVC7uXJp5p_njq8p7g",
  authDomain: "hackplaksha-9b2bf.firebaseapp.com",
  projectId: "hackplaksha-9b2bf",
  storageBucket: "hackplaksha-9b2bf.appspot.com",
  messagingSenderId: "952041223160",
  appId: "1:952041223160:web:882ae59b417055ffcb9c0d",
  measurementId: "G-WB32ECRVHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export db along with auth