"use client";
import LoginPage from "../../components/LoginComponent";
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import {auth} from "../../services/FirebaseService";

const provider = new GoogleAuthProvider();

export default function Home() {

  const user = getAuth().currentUser;
  console.log(user)

  return (
    <div>

     <button onClick={() => signInWithRedirect(auth, provider)}>Sign in with Google</button>
    </div>
  );
}
