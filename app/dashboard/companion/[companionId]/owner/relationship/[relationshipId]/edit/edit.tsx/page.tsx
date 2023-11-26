import { Metadata } from "next";
import Image from "next/image";
import { MainNavbar } from "@/components/navbars/main-navbar";

import UnderConstruction from "@/components/under-construction";
const under_construction = process.env.UNDER_CONSTRUCTION;

export const metadata: Metadata = {
  title: "Smarty Clone-Contact Us",
};
interface DashboardCompanionOwnerRelationshipEditPageProps {
  params: {
    companionId: string;
    relationshipId: string;
  };
}
export default function DashboardCompanionOwnerRelationshipEditPage() {
  if (under_construction === "true") {
    return (
      <>
        <UnderConstruction />
      </>
    );
  }
  return (
    <div>
      <h1>Edit Relationship</h1>
    </div>
  );
}
