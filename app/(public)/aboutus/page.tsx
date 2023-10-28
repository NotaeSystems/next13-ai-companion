import { Metadata } from "next";
import { MainNavbar } from "@/components/main-navbar";

export const metadata: Metadata = {
  title: "Smarty Clone-Contact Us",
};

export default function Page() {
  return (
    <div>
      <MainNavbar />

      <h1>About Us</h1>
    </div>
  );
}
