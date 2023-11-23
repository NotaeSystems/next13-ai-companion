import { Metadata } from "next";

import UnderConstruction from "@/components/under-construction";
const under_construction = process.env.UNDER_CONSTRUCTION;

export const metadata: Metadata = {
  title: "Smarty Clone-Invitation",
};

export default function InvitationPage() {
  if (under_construction === "true") {
    return (
      <>
        <UnderConstruction />
      </>
    );
  }
  return (
    <div>
      <h1>Invitation</h1>
    </div>
  );
}
