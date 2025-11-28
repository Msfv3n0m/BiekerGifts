"use client";
import { getAuth, getRedirectResult, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import {auth} from "../services/FirebaseService";

export default function Home() {
  const provider = new GoogleAuthProvider();
  
  return (
    <div>
     <button onClick={() => signInWithRedirect(auth, provider)}>Sign in with Google</button>
     <button onClick={() => signOut(auth)}>Sign out</button>
    </div>
  );
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(uid);
    // ...
  } else {
    // User is signed out
    // ...
    console.log("signed out");
  }
});