import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Smarty Persona-Welcome",
};

export default function Profile() {
  return (
    <div>
      <h1>Welcome Profile Page</h1>
      <p>
        {" "}
        Welcome to Smarty Persona. Chat with your favorite personalities. Tell
        us a little about yourself.
      </p>
    </div>
  );
}
