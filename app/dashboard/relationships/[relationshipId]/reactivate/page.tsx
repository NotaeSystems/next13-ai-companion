import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";

interface DashboardRelationshipRecativatePageProps {
  params: {
    relationshipId: string;
  };
}

const DashboardRelationshipRecativatePage = async ({
  params,
}: DashboardRelationshipRecativatePageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const validSubscription = await checkSubscription();

  if (!validSubscription) {
    return redirect("/");
  }

  let relationship = null;
  // check to see if relationship exists
  relationship = await prismadb.relationship.findUnique({
    where: {
      id: params.relationshipId,
    },
  });

  if (!relationship) {
    return (
      <>
        <h1> No relationship found!</h1>
      </>
    );
  }

  let companion = null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: relationship.companionId,
    },
  });

  if (!companion) {
    return (
      <>
        <h1> No companion found!</h1>
      </>
    );
  }

  if (
    relationship.adminStatus === "Active" &&
    relationship.status != "Active"
  ) {
    console.log("Relation being reactivated");
    relationship = await prismadb.relationship.update({
      where: {
        id: relationship.id,
      },
      data: {
        status: "Active",
      },
    });
  }
  return redirect(`/dashboard/companion/${companion.id}`);
  //const categories = await prismadb.category.findMany();
};

export default DashboardRelationshipRecativatePage;
