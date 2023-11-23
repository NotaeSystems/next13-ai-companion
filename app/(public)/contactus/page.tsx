import { Metadata } from "next";

import UnderConstruction from "@/components/under-construction";
const under_construction = process.env.UNDER_CONSTRUCTION;

export const metadata: Metadata = {
  title: "Smarty Clone-Contact Us",
};

export default function ContactUsPage() {
  if (under_construction === "true") {
    return (
      <>
        <UnderConstruction />
      </>
    );
  }
  return (
    <div>
      <h1>Contact Us</h1>
    </div>
  );
}
