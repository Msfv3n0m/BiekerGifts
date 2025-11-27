// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFOjnHKKAdITE6dEpHhtdbfDGyFhaRJ60",
  authDomain: "biekergifts.firebaseapp.com",
  databaseURL: "https://biekergifts-default-rtdb.firebaseio.com",
  projectId: "biekergifts",
  storageBucket: "biekergifts.firebasestorage.app",
  messagingSenderId: "336512209054",
  appId: "1:336512209054:web:e4e1e9512a387370a86b8f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// googleLogin.addEventListener("click", () => {
//   signInWithRedirect(auth, provider);
// });