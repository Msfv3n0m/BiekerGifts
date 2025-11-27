"use client";
import LoginPage from "../../components/LoginComponent";
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import {auth} from "../../services/FirebaseService";


export default function Home() {
  const provider = new GoogleAuthProvider();
  
  return (
    <div>

     <button onClick={() => signInWithPopup(auth, provider)}>Sign in with Google</button>
     {console.log(getRedirectResult(auth))}
    </div>
  );
}
