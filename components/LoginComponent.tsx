
"use client";

import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/FirebaseService";

const provider = new GoogleAuthProvider();

export default function Home() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/mylist");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-8 rounded-2xl shadow-lg bg-white border border-gray-200 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome</h1>
        <p className="text-gray-600 mb-6">Sign in to continue</p>
        <button
          onClick={handleSignIn}
          className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold text-gray-800 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 transition"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C34.5 31.7 30.1 35 24 35c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.2 0 6.2 1.2 8.5 3.2l5.7-5.7C34.7 3.1 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c12.1 0 21.8-8.8 21.8-22 0-1.5-.2-3-.2-4.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.4 16.1 18.8 13 24 13c3.2 0 6.2 1.2 8.5 3.2l5.7-5.7C34.7 3.1 29.6 1 24 1 15.2 1 7.6 6.4 4 14.1z"
            />
            <path
              fill="#4CAF50"
              d="M24 45c6 0 11.4-2.3 15.3-6l-6.8-5.6C30.1 35 26.9 36.5 24 36.5c-6.2 0-10.6-3.3-12.7-8.1l-6.9 5.3C7.5 40.9 15.1 45 24 45z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.7 3.7-5.1 6.5-9.3 7.1l6.8 5.6c3.9-3.6 6.2-9 6.2-14.7 0-1.5-.2-3-.2-4.5z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
