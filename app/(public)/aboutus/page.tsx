import { Metadata } from "next";
import Image from "next/image";
import { MainNavbar } from "@/components/navbars/main-navbar";

import UnderConstruction from "@/components/under-construction";
const under_construction = process.env.UNDER_CONSTRUCTION;

export const metadata: Metadata = {
  title: "Smarty Clone-Contact Us",
};

export default function AboutUsPage() {
  if (under_construction === "true") {
    return (
      <>
        <UnderConstruction />
      </>
    );
  }
  return (
    <div>
      <h1>About Us</h1>
    </div>
  );
}
