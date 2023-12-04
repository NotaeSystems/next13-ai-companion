"use client";

// Not Used at this time. This uses next-auth instead of Clerk

//import { MainNavbar } from "@/components/main-navbar";
////import GoogleButton from "react-google-button"
import { signIn } from "next-auth/react";

export default function LogIn() {
  return (
    <main className="text-center w-full mx-auto max-w-[1240px] mt-16">
      <h1 className="text4xl font-bold">Signin</h1>

      {/* <GoogleButton onClick={() =>signIn('google')} className="mx-auto mt-16"/> */}
    </main>
  );
}
