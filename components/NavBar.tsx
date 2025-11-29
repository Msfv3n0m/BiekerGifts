"use client";

import Link from "next/link";
import React, {useEffect, useState} from "react";
import { usePathname } from "next/navigation";
import { Url } from "next/dist/shared/lib/router/router";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, User, signInWithRedirect } from "firebase/auth";
import { auth} from "../services/FirebaseService";
import { useRouter } from "next/navigation";


interface INavbarProps {}

const navItems = [
  {
    id: "mylist",
    label: "My List",
    href: "/mylist",
  },
  {
    id: "otherlists",
    label: "Other Lists",
    href: "/otherlists",
  },
  {
    id: "login",
    label: "Login",
    href: "/login",
  },
];

const Navbar: React.FunctionComponent<INavbarProps> = (props) => {
  const pathname = usePathname();
  const isActive = (path: Url) => pathname === path;
const [user, setUser] = useState<User | null>(null);
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <nav className="pb-4 md:pb-8 flex justify-between items-center">
      <Link
        href="/"
        className="text-lg md:text-3xl font-bold text-spotify-green"
      >
        BiekerGifts
      </Link>
     <ul className="flex justify-end items-center gap-4">
          <li key="mylist">
            <a href="/mylist" className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none">My List</a>
          </li>
          <li key="otherlists">
            <a href="/otherlists" className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none">Other Lists</a>
          </li>
          <li key="logout">
            <button onClick={handleSignOut} className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none">Sign Out</button>
          </li>
      </ul>
    </nav>
  );
};

export default Navbar;